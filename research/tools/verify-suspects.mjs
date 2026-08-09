#!/usr/bin/env node
/**
 * Verificação cirúrgica com Whisper.
 *
 * A base é construída sobre legenda automática do YouTube. A run 1 tratava ASR
 * ruim re-transcrevendo o vídeo INTEIRO quando "parecia ruim" — caro, e o
 * critério era subjetivo. Aqui é o contrário: `list-suspects.mjs` aponta
 * mecanicamente as janelas que importam (número e negação) e só elas voltam
 * para o áudio.
 *
 * O que este arquivo faz, por alvo:
 *   1. baixa SÓ o áudio do vídeo, com cache em `research/corpus/.audio/`
 *      (vários alvos caem no mesmo vídeo — baixar duas vezes é desperdício puro);
 *   2. recorta a janela `at − 20 s` … `at + 40 s` com ffmpeg;
 *   3. transcreve a janela com o Whisper (`whisper-window.py`, um único load);
 *   4. compara o resultado com o `verbatim` da legenda e com os `params`.
 *
 * ── O QUE ESTE ARQUIVO NÃO FAZ ──────────────────────────────────────────────
 *
 * Ele NÃO decide veredito de correção. Ele detecta DIVERGÊNCIA e para ali.
 *
 * A distinção é o ponto inteiro do passe. Máquina sabe dizer "a legenda diz 21
 * e o Whisper diz 20" — isso é comparação de string e não admite opinião.
 * Máquina não sabe dizer qual dos dois é o certo quando os dois são ASR do
 * mesmo áudio ruim. Então o único veredito automático é `CONFIRMADO`, e só
 * quando número e polaridade batem exatamente. Qualquer divergência sai como
 * `DIVERGENTE` e vira trabalho humano no relatório.
 *
 * Chutar o que "devia" ter sido dito é precisamente o defeito que esta base
 * existe para não ter.
 *
 * Uso:
 *   node research/tools/verify-suspects.mjs              # tudo
 *   node research/tools/verify-suspects.mjs --only R002  # um vídeo
 *   node research/tools/verify-suspects.mjs --skip-audio # reaproveita clipes já cortados
 */

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const TOOLS = join(ROOT, 'research/tools');
const AUDIO = join(ROOT, 'research/corpus/.audio');
const CLIPS = join(AUDIO, 'clips');
const PY = join(TOOLS, '.venv-whisper/bin/python');
const MANIFEST = join(ROOT, 'research/corpus/manifest.json');
const OUT_JSON = join(ROOT, 'research/kb/suspeitos-whisper.json');

/** Janela de escuta. Sobra antes porque o `at` da legenda marca o início do bloco,
 *  não a sílaba; sobra depois porque o número quase sempre vem no fim da frase. */
const ANTES_SEC = 20;
const DEPOIS_SEC = 40;

const argv = process.argv.slice(2);
const onlyIdx = argv.indexOf('--only');
const ONLY = onlyIdx >= 0 ? argv[onlyIdx + 1] : null;
const SKIP_AUDIO = argv.includes('--skip-audio');

const toSec = (s) => String(s).trim().split(':').map(Number).reduce((a, p) => a * 60 + p, 0);

const norm = (s) =>
  (s ?? '').normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

// ── alvos e manifesto ───────────────────────────────────────────────────────

const alvos = JSON.parse(
  execFileSync('node', [join(TOOLS, 'list-suspects.mjs'), '--json'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  }),
).filter((a) => !ONLY || a.src === ONLY);

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const byRef = new Map(manifest.videos.map((v) => [v.ref, v]));

mkdirSync(CLIPS, { recursive: true });

// ── 1. áudio, com cache por vídeo ───────────────────────────────────────────

/** Um vídeo já baixado é qualquer arquivo `R002.*` na pasta — a extensão vem do
 *  yt-dlp e varia por vídeo (m4a, webm, opus), então o cache olha pelo prefixo. */
function audioCache(ref) {
  const hit = readdirSync(AUDIO).find((f) => f.startsWith(`${ref}.`) && !f.endsWith('.part'));
  return hit ? join(AUDIO, hit) : null;
}

function baixarAudio(ref) {
  const cached = audioCache(ref);
  if (cached) return cached;
  const v = byRef.get(ref);
  if (!v?.url) return null;
  const r = spawnSync(
    'yt-dlp',
    ['-f', 'bestaudio', '--no-playlist', '--quiet', '--no-warnings', '-o', join(AUDIO, `${ref}.%(ext)s`), v.url],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );
  if (r.status !== 0) {
    console.error(`  ✗ ${ref}: yt-dlp falhou — ${(r.stderr ?? '').trim().split('\n').pop()}`);
    return null;
  }
  return audioCache(ref);
}

const refs = [...new Set(alvos.map((a) => a.src))].sort();
console.error(`\n${alvos.length} alvo(s) em ${refs.length} vídeo(s)\n`);

const audioPor = new Map();
if (!SKIP_AUDIO) {
  refs.forEach((ref, i) => {
    process.stderr.write(`  áudio ${String(i + 1).padStart(3)}/${refs.length}  ${ref} … `);
    const p = baixarAudio(ref);
    audioPor.set(ref, p);
    console.error(p ? 'ok' : 'INDISPONÍVEL');
  });
} else {
  for (const ref of refs) audioPor.set(ref, audioCache(ref));
}

// ── 2. recorte da janela ────────────────────────────────────────────────────

const jobs = [];
for (const a of alvos) {
  const wav = join(CLIPS, `${a.id}.wav`);
  a._wav = wav;
  a._t0 = Math.max(0, toSec(a.at) - ANTES_SEC);
  if (existsSync(wav)) {
    jobs.push({ id: a.id, wav });
    continue;
  }
  const src = audioPor.get(a.src);
  if (!src) continue;
  const r = spawnSync(
    'ffmpeg',
    ['-nostdin', '-loglevel', 'error', '-ss', String(a._t0), '-t', String(ANTES_SEC + DEPOIS_SEC),
     '-i', src, '-ac', '1', '-ar', '16000', '-c:a', 'pcm_s16le', '-y', wav],
    { encoding: 'utf8' },
  );
  if (r.status === 0 && existsSync(wav)) jobs.push({ id: a.id, wav });
  else console.error(`  ✗ ${a.id}: ffmpeg falhou`);
}
console.error(`\n${jobs.length} janela(s) recortada(s) de ${alvos.length} alvo(s)\n`);

// ── 3. Whisper, um load só ──────────────────────────────────────────────────

const jobsPath = join(AUDIO, 'jobs.json');
const resPath = join(AUDIO, 'whisper-raw.json');

// Cache por janela, e não por execução: a transcrição é a parte cara e imutável
// (mesmo áudio, mesmo modelo, mesmo resultado), enquanto a COMPARAÇÃO abaixo foi
// reescrita várias vezes enquanto este passe era afinado. Separar os dois deixa
// iterar no julgamento sem pagar o Whisper de novo.
const whisper = new Map(
  existsSync(resPath) ? JSON.parse(readFileSync(resPath, 'utf8')).map((r) => [r.id, r]) : [],
);
const pendentes = jobs.filter((j) => !whisper.has(j.id) || whisper.get(j.id).erro);

if (pendentes.length > 0) {
  writeFileSync(jobsPath, JSON.stringify(pendentes));
  const parcial = join(AUDIO, 'whisper-parcial.json');
  const r = spawnSync(PY, [join(TOOLS, 'whisper-window.py'), jobsPath, parcial], { stdio: 'inherit' });
  if (r.status !== 0) {
    console.error('\nWhisper falhou. Nada foi escrito na base.');
    process.exit(1);
  }
  for (const x of JSON.parse(readFileSync(parcial, 'utf8'))) whisper.set(x.id, x);
  writeFileSync(resPath, JSON.stringify([...whisper.values()], null, 1));
} else {
  console.error('todas as janelas já transcritas — reaproveitando cache\n');
}

// ── 4. comparação ───────────────────────────────────────────────────────────

/**
 * Números "de conteúdo" de um texto. Ignora ordinais e ano solto? Não: ignorar
 * seria decidir o que importa, e o que importa é justamente o número que a claim
 * declarou. Extrai tudo e a comparação é feita contra os `params`.
 */
const numeros = (s) => [...norm(s).matchAll(/\d+(?:[.,]\d+)?/g)].map((m) => m[0].replace(',', '.'));

/** Número por extenso conta como número: o ASR alterna entre "three" e "3" para o
 *  mesmo áudio, e ignorar a forma escrita produziria divergência fantasma. */
const EXTENSO = {
  zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7',
  eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12', thirteen: '13',
  fourteen: '14', fifteen: '15', sixteen: '16', seventeen: '17', eighteen: '18',
  nineteen: '19', twenty: '20', thirty: '30', forty: '40', fifty: '50', sixty: '60',
  seventy: '70', eighty: '80', ninety: '90', hundred: '100', thousand: '1000',
};
const numerosComExtenso = (s) => {
  const t = norm(s);
  const out = numeros(t);
  for (const w of t.split(' ')) if (EXTENSO[w]) out.push(EXTENSO[w]);
  return out;
};

/** `norm` já separou o apóstrofo, então `don't` chega aqui como `don t`. */
const negacoes = (s) =>
  norm(s).match(/\b(\w+ t|not|never|no|none|nothing|without|neither|nor)\b/g)?.filter(
    // `\w+ t` casaria "about t" num corte infeliz; só contam contrações reais.
    (m) => !/ t$/.test(m) || /\b(do|does|did|is|are|was|were|has|have|had|can|could|would|should|wo|ai|must|might|need|does)n t$/.test(m),
  ) ?? [];

/**
 * Alinha o `verbatim` da legenda dentro da janela do Whisper.
 *
 * Sem isso a comparação é inútil: o verbatim tem ~15 palavras e a janela tem
 * ~180, então contar negações nos dois textos inteiros acusa divergência em
 * 100% dos casos — a janela simplesmente contém MAIS frases, todas legítimas.
 * O primeiro rascunho deste arquivo fazia exatamente isso e marcou os seis
 * alvos do R002 como divergentes quando os seis batiam perfeitamente.
 *
 * Janela deslizante de tamanho elástico (80%–140% do verbatim), pontuada por
 * palavras em comum. Devolve o trecho do Whisper que corresponde à frase citada,
 * e é SÓ nesse trecho que número e polaridade são comparados.
 */
function alinhar(verbatim, texto) {
  const V = norm(verbatim).split(' ').filter(Boolean);
  const W = norm(texto).split(' ').filter(Boolean);
  if (V.length === 0 || W.length === 0) return { trecho: '', cobertura: 0 };

  const alvo = new Set(V.filter((w) => w.length > 2));
  let melhor = { ini: 0, fim: Math.min(W.length, V.length), pontos: -1 };
  for (const fator of [0.8, 1, 1.2, 1.4]) {
    const n = Math.max(4, Math.round(V.length * fator));
    for (let i = 0; i + 1 < W.length; i++) {
      const fim = Math.min(W.length, i + n);
      let pontos = 0;
      for (let j = i; j < fim; j++) if (alvo.has(W[j])) pontos++;
      // Normaliza pelo tamanho para que a janela de 140% não vença só por ser maior.
      const nota = pontos - (fim - i) * 0.05;
      if (nota > melhor.pontos) melhor = { ini: i, fim, pontos: nota };
      if (fim === W.length) break;
    }
  }
  const trecho = W.slice(melhor.ini, melhor.fim).join(' ');
  const presentes = new Set(trecho.split(' '));
  const cobertura = alvo.size ? [...alvo].filter((w) => presentes.has(w)).length / alvo.size : 0;
  return { trecho, cobertura };
}

const relatorio = [];
for (const a of alvos) {
  const w = whisper.get(a.id);
  const texto = w?.text ?? '';
  const { trecho, cobertura } = alinhar(a.verbatim, texto);

  const numLegenda = numerosComExtenso(a.verbatim);
  const numWhisper = numerosComExtenso(trecho);
  const numJanela = numerosComExtenso(texto);
  const numParams = a.params.map((p) => String(p.value).replace(',', '.'));

  const contem = (lista, n) => lista.includes(n) || lista.includes(String(Number(n)));

  // O param sobreviveu ao Whisper? É a pergunta que importa: `params` é o que a
  // base consome; o `verbatim` é só a evidência dele. Procura primeiro no trecho
  // alinhado e, se não achar, na janela inteira — número dito uma frase antes
  // ainda é o número certo, e reprovar por deslocamento de alinhamento seria
  // fabricar divergência.
  const paramsAusentes = numParams.filter((n) => !contem(numWhisper, n) && !contem(numJanela, n));
  const numNovos = numWhisper.filter((n) => !contem(numLegenda, n));
  const numPerdidos = numLegenda.filter((n) => !contem(numWhisper, n) && !contem(numJanela, n));

  const negLegenda = negacoes(a.verbatim);
  const negWhisper = negacoes(trecho);

  // Único veredito automático é CONFIRMADO, e só com número e polaridade batendo.
  // Todo o resto é DIVERGENTE e vira julgamento humano no relatório.
  const motivo = [];
  let veredito;
  if (!texto) {
    veredito = 'SEM_AUDIO';
    motivo.push('Whisper não produziu texto para a janela');
  } else if (cobertura < 0.4) {
    veredito = 'DIVERGENTE';
    motivo.push(`alinhamento fraco (${(cobertura * 100).toFixed(0)}% das palavras da legenda) — a frase citada pode não estar na janela`);
  } else if (paramsAusentes.length === 0 && negLegenda.length === negWhisper.length && numPerdidos.length === 0) {
    veredito = 'CONFIRMADO';
  } else {
    veredito = 'DIVERGENTE';
    if (paramsAusentes.length) motivo.push(`param ausente no áudio: ${paramsAusentes.join(', ')}`);
    if (numPerdidos.length) motivo.push(`número da legenda não ouvido: ${numPerdidos.join(', ')}`);
    if (numNovos.length) motivo.push(`número novo no áudio: ${numNovos.join(', ')}`);
    if (negLegenda.length !== negWhisper.length) {
      motivo.push(`POLARIDADE: legenda ${negLegenda.length} negação(ões) [${negLegenda.join(', ')}], áudio ${negWhisper.length} [${negWhisper.join(', ')}]`);
    }
  }

  relatorio.push({
    id: a.id, src: a.src, at: a.at, file: a.file, line: a.line,
    why: a.why, origem: a.origem, scope: a.scope,
    claim: a.claim,
    verbatim: a.verbatim,
    params: a.params,
    whisperTrecho: trecho,
    whisperJanelaTexto: texto,
    whisperJanela: `${Math.floor(a._t0 / 60)}:${String(a._t0 % 60).padStart(2, '0')} +${ANTES_SEC + DEPOIS_SEC}s`,
    avgLogprob: w?.avgLogprob ?? null,
    numLegenda, numWhisper, paramsAusentes, numNovos, numPerdidos,
    negLegenda, negWhisper,
    cobertura: Number(cobertura.toFixed(2)),
    veredito, motivo,
  });
}

writeFileSync(OUT_JSON, `${JSON.stringify(relatorio, null, 1)}\n`);

const cont = (v) => relatorio.filter((r) => r.veredito === v).length;
console.error(`\n─────────────────────────────────────────────`);
console.error(`  CONFIRMADO automático ..... ${cont('CONFIRMADO')}`);
console.error(`  DIVERGENTE (julgar) ....... ${cont('DIVERGENTE')}`);
console.error(`  SEM_AUDIO ................. ${cont('SEM_AUDIO')}`);
console.error(`\nEvidência crua em research/kb/suspeitos-whisper.json`);
console.error(`O veredito final é humano — ver research/kb/SUSPEITOS-VERIFICADOS.md\n`);
