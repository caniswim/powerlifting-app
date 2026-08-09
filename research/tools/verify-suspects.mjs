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
writeFileSync(jobsPath, JSON.stringify(jobs));

if (!existsSync(resPath) || !SKIP_AUDIO) {
  const r = spawnSync(PY, [join(TOOLS, 'whisper-window.py'), jobsPath, resPath], { stdio: 'inherit' });
  if (r.status !== 0) {
    console.error('\nWhisper falhou. Nada foi escrito na base.');
    process.exit(1);
  }
}
const whisper = new Map(JSON.parse(readFileSync(resPath, 'utf8')).map((r) => [r.id, r]));

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

const NEG = /\b(\w+n[''´]?t|not|never|no|none|nothing|without|neither|nor)\b/gi;
const negacoes = (s) => (norm(s).match(/\b(\w+n t|not|never|no|none|nothing|without|neither|nor)\b/g) ?? []);

/** Sobreposição de palavras entre legenda e Whisper: mede se estamos ouvindo o
 *  MESMO trecho. Sem isso, "os números não batem" pode significar só que a
 *  janela pegou outra frase, e aí a divergência não é sobre o dado. */
function overlap(a, b) {
  const A = new Set(norm(a).split(' ').filter((w) => w.length > 3));
  const B = new Set(norm(b).split(' ').filter((w) => w.length > 3));
  if (A.size === 0) return 0;
  let hit = 0;
  for (const w of A) if (B.has(w)) hit++;
  return hit / A.size;
}

const relatorio = [];
for (const a of alvos) {
  const w = whisper.get(a.id);
  const texto = w?.text ?? '';

  const numLegenda = numerosComExtenso(a.verbatim);
  const numWhisper = numerosComExtenso(texto);
  const numParams = a.params.map((p) => String(p.value).replace(',', '.'));

  // O param sobreviveu ao Whisper? É a pergunta que importa: o `params` é o que
  // a base consome, o `verbatim` é só a evidência dele.
  const paramsAusentes = numParams.filter((n) => !numWhisper.includes(n) && !numWhisper.includes(String(Number(n))));

  const negLegenda = negacoes(a.verbatim);
  const negWhisper = negacoes(texto);
  const cobertura = overlap(a.verbatim, texto);

  // Único veredito automático. Tudo mais é DIVERGENTE e vai para julgamento humano.
  let veredito = 'DIVERGENTE';
  let motivo = [];
  if (!texto) {
    veredito = 'SEM_AUDIO';
    motivo.push('Whisper não produziu texto para a janela');
  } else if (cobertura < 0.35) {
    veredito = 'DIVERGENTE';
    motivo.push(`sobreposição léxica baixa (${(cobertura * 100).toFixed(0)}%) — pode ser janela deslocada`);
  } else if (paramsAusentes.length === 0 && negLegenda.length === negWhisper.length) {
    veredito = 'CONFIRMADO';
  } else {
    if (paramsAusentes.length) motivo.push(`param(s) não encontrado(s) no Whisper: ${paramsAusentes.join(', ')}`);
    if (negLegenda.length !== negWhisper.length) {
      motivo.push(`contagem de negação difere — legenda ${negLegenda.length}, whisper ${negWhisper.length}`);
    }
  }

  relatorio.push({
    id: a.id, src: a.src, at: a.at, file: a.file, line: a.line,
    why: a.why, origem: a.origem, scope: a.scope,
    claim: a.claim,
    verbatim: a.verbatim,
    params: a.params,
    whisper: texto,
    whisperJanela: `${Math.floor(a._t0 / 60)}:${String(a._t0 % 60).padStart(2, '0')} +${ANTES_SEC + DEPOIS_SEC}s`,
    avgLogprob: w?.avgLogprob ?? null,
    numLegenda, numWhisper, paramsAusentes,
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
