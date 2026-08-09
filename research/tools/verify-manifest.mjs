#!/usr/bin/env node
/**
 * Trava o manifesto de um corpus contra deslocamento silencioso.
 *
 * O manifesto é derivado da ordem do canal, e a ordem do canal muda toda vez que
 * o autor publica um vídeo. Se alguém regerar sem ajustar o `postRun1` da fonte,
 * todo `[Rxxx]` passa a apontar para o vizinho — e nada quebra, nada avisa, a
 * base inteira fica um vídeo fora de fase. É o tipo de erro que só aparece
 * quando você já treinou seis semanas em cima dele.
 *
 * Então a suposição vira invariante executável, como no parser de notas: seis
 * âncoras semânticas, colhidas do que sobrou da run 1 (`research/recuperado/`),
 * onde o conteúdo do vídeo identifica o número sem ambiguidade.
 *
 * MAS ÂNCORA NÃO É UNIVERSAL. Ela só existe onde já havia citação anterior para
 * amarrar número a assunto. Uma fonte nova (Blevins) não tem `recuperado/`, não
 * tem documento citando `[Gxxx]`, e portanto NÃO TEM COMO ter o alinhamento
 * verificado — inventar uma âncora ali seria eu confirmando meu próprio palpite,
 * e passar em silêncio seria pior ainda: carimbaria de "verificado" o que
 * ninguém verificou. Para essas fontes este arquivo valida o que dá (integridade,
 * unicidade de ref, ordem cronológica) e DIZ, na saída, que a checagem de
 * deslocamento não se aplica.
 *
 * Uso: node research/tools/verify-manifest.mjs [--source blevins]
 *   sem --source, verifica o corpus do Vena.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { resolveSource, paths } from './sources.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SOURCE = resolveSource();
const MANIFEST = paths(SOURCE, ROOT).manifest;

/**
 * Cada âncora casa um número `[Rxxx]` com um padrão que só o título daquele
 * vídeo satisfaz. A procedência é o arquivo recuperado que amarra o número ao
 * assunto — sem ela isto seria eu confirmando meu próprio palpite.
 *
 * `citando` é o documento cujas citações precisam resolver: é dele que sai a
 * prova de unicidade do offset. Fonte sem entrada aqui é fonte ainda não citada.
 */
const ANCORAGEM = {
  vena: {
    citando: 'src/data/program/vena-block1/source/PROGRAMA.md',
    anchors: [
      { r: 1, re: /3 YEARS OF INJURIES/i, why: 'kb-sintese: [R1] é a régua de dor ~2/10 (regra D1)' },
      { r: 4, re: /PROGRAM That Got Me A 400KG SQUAT/i, why: 'kb-sintese: [R4] é a progressão linear declarada' },
      { r: 102, re: /NEVER do DELOADS/i, why: 'kb-sintese: [R102] é o "never deload" da contradição do taper' },
      { r: 113, re: /Squat Exercise TIER LIST/i, why: 'kb-sintese: [R113] é o tier list que rebaixa para tier B' },
      { r: 159, re: /STOP TRYING TO SQUAT UPRIGHT/i, why: 'kb-sintese: [R159] é "o cue-bandeira do canal"' },
      { r: 168, re: /Best Squat Accessory/i, why: 'kb-sintese: [R168] é "o acessório de agacho nº 1 dele"' },
    ],
  },
};

const ancoragem = ANCORAGEM[SOURCE.id] ?? null;

if (!existsSync(MANIFEST)) {
  console.error(
    `\n${MANIFEST} não existe.\n` +
      `  → node research/tools/build-manifest.mjs --source ${SOURCE.id}\n`,
  );
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const videos = manifest.videos ?? [];
const byRef = new Map(videos.map((v) => [v.rNumber, v]));

const errors = [];
const warnings = [];

// 0. O manifesto tem que declarar de quem ele é. Sem `source`/`refPrefix` não dá
//    para saber se `--source blevins` abriu o arquivo do Blevins ou o do Vena; e
//    sem `builtAt`/`channelItemCount` não dá para responder "o canal andou quanto
//    desde o build?", que é a única defesa de uma fonte sem âncora semântica.
for (const f of ['source', 'refPrefix', 'builtAt', 'channelItemCount']) {
  if (manifest[f] === undefined || manifest[f] === null) {
    errors.push(`manifesto sem \`${f}\` — deslocamento fica indetectável (ver build-manifest.mjs)`);
  }
}
if (manifest.source && manifest.source !== SOURCE.id) {
  errors.push(`manifesto declara source "${manifest.source}" mas foi aberto como "${SOURCE.id}"`);
}
if (manifest.refPrefix && manifest.refPrefix !== SOURCE.refPrefix) {
  errors.push(
    `manifesto declara refPrefix "${manifest.refPrefix}" mas a fonte "${SOURCE.id}" usa "${SOURCE.refPrefix}"`,
  );
}

// 1. INTEGRIDADE — vale para toda fonte, com ou sem âncora. Um ref repetido faria
//    duas citações diferentes resolverem para o mesmo vídeo (ou para o errado, a
//    depender de quem ganhasse o índice), que é deslocamento sob outro nome.
const vistos = new Map();
for (const [i, v] of videos.entries()) {
  const onde = `índice ${i + 1}`;
  if (!v.ref) errors.push(`${onde}: vídeo sem ref`);
  else if (vistos.has(v.ref)) errors.push(`ref ${v.ref} duplicado (${vistos.get(v.ref)} e ${onde})`);
  else vistos.set(v.ref, onde);
  if (v.ref && !v.ref.startsWith(SOURCE.refPrefix)) {
    errors.push(`${onde}: ref ${v.ref} não usa o prefixo "${SOURCE.refPrefix}" da fonte`);
  }
  if (!v.videoId) errors.push(`${v.ref ?? onde}: sem videoId — a citação não reabre no YouTube`);
  // A numeração é posicional por definição; se ela deixar de bater com a posição,
  // alguém editou o manifesto à mão e todo ref abaixo dali é suspeito.
  const esperado = i + 1 - (manifest.postRun1Count ?? 0);
  if (v.rNumber !== esperado) {
    errors.push(`${v.ref ?? onde}: rNumber ${v.rNumber} não bate com a posição (esperado ${esperado})`);
  }
  if (v.postRun1 !== (v.rNumber < 1)) {
    errors.push(`${v.ref ?? onde}: flag postRun1 não bate com rNumber ${v.rNumber}`);
  }
}
if (manifest.videoCount !== videos.length) {
  errors.push(`videoCount ${manifest.videoCount} não bate com ${videos.length} vídeos no arquivo`);
}
const citaveis = videos.filter((v) => !v.postRun1).length;
if (manifest.citableCount !== citaveis) {
  errors.push(`citableCount ${manifest.citableCount} não bate com ${citaveis} vídeos citáveis`);
}

// 2. ORDEM CRONOLÓGICA — a numeração assume canal em ordem decrescente de data.
//    Fica em aviso, e não em erro, porque uma inversão é o canal desmentindo a
//    premissa (republicação, estreia agendada), não defeito do manifesto: o
//    conserto seria renumerar citações, e isso é decisão humana.
const datados = videos.filter((v) => v.date);
const inversoes = datados.filter((v, i) => i > 0 && v.date > datados[i - 1].date);
if (inversoes.length > 0) {
  warnings.push(
    `${inversoes.length} inversão(ões) cronológica(s): ${inversoes
      .slice(0, 5)
      .map((v) => `${v.ref} ${v.date}`)
      .join(', ')}`,
  );
}
if (datados.length < videos.length) {
  warnings.push(`${videos.length - datados.length} vídeo(s) sem data — "o recente vence" não é computável neles`);
}

// 3. ÂNCORAS + UNICIDADE DO OFFSET — só onde existe citação prévia para ancorar.
let pairs = [];
let rival = [];
let cited = new Set();
if (ancoragem) {
  for (const a of ancoragem.anchors) {
    const v = byRef.get(a.r);
    if (!v) {
      errors.push(`${SOURCE.refPrefix}${a.r} não existe no manifesto`);
      continue;
    }
    if (!a.re.test(v.title)) {
      errors.push(
        `${SOURCE.refPrefix}${a.r} deveria casar ${a.re} mas o manifesto traz "${v.title}"\n` +
          `      procedência: ${a.why}\n` +
          `      → o canal provavelmente publicou vídeo novo; ajuste \`postRun1\` da fonte "${SOURCE.id}" em research/tools/sources.mjs`,
      );
    }
  }

  const programa = readFileSync(join(ROOT, ancoragem.citando), 'utf8');
  const CITA = new RegExp(`\\[${SOURCE.refPrefix}(\\d+)(?:\\s|@|,|\\])`, 'g');
  const CITA_AT = new RegExp(`\\[${SOURCE.refPrefix}(\\d+)\\s*@\\s*([\\d:,\\s]+)\\]`, 'g');

  // 3a. Toda citação do documento tem que resolver para um vídeo citável.
  cited = new Set([...programa.matchAll(CITA)].map((m) => Number(m[1])));
  const unresolved = [...cited].filter((r) => !byRef.has(r) || byRef.get(r).postRun1);
  if (unresolved.length > 0) {
    errors.push(`citações sem vídeo correspondente: ${unresolved.sort((a, b) => a - b).join(', ')}`);
  }

  // 3b. Timestamps não podem passar da duração do vídeo.
  for (const m of programa.matchAll(CITA_AT)) {
    const v = byRef.get(Number(m[1]));
    if (!v?.durationSec) continue;
    for (const stamp of m[2].split(',')) {
      const parts = stamp.trim().split(':').map(Number);
      if (parts.some(Number.isNaN)) continue;
      const sec = parts.reduce((acc, p) => acc * 60 + p, 0);
      if (sec > v.durationSec) {
        errors.push(
          `[${SOURCE.refPrefix}${m[1]} @${stamp.trim()}] passa da duração do vídeo (${v.durationSec}s) — "${v.title}"`,
        );
      }
    }
  }

  // 3c. UNICIDADE DO OFFSET — a checagem que transforma "plausível" em "determinado".
  //     As âncoras confirmam o alinhamento; esta prova que nenhum outro alinhamento
  //     serve. Cada timestamp citado é um teste: sob o offset errado, citações de
  //     vídeo longo caem em vídeo curto e estouram a duração. Empate aqui significa
  //     que as âncoras estão medindo menos do que parecem.
  pairs = [...programa.matchAll(CITA_AT)].flatMap((m) =>
    m[2]
      .split(',')
      .map((s) => ({ r: Number(m[1]), sec: s.trim().split(':').map(Number).reduce((a, p) => a * 60 + p, 0) }))
      .filter((x) => !Number.isNaN(x.sec)),
  );
  const violations = (off) =>
    pairs.filter((p) => {
      const v = byRef.get(p.r + off);
      return !v?.durationSec || p.sec > v.durationSec;
    }).length;

  rival = [-2, -1, 1, 2].map((off) => ({ off, bad: violations(off) }));
  const best = rival.filter((c) => c.bad <= violations(0));
  if (best.length > 0) {
    errors.push(
      `offset não é único: ${best.map((c) => `${c.off >= 0 ? '+' : ''}${c.off} (${c.bad} violações)`).join(', ')} ` +
        `empata ou bate o adotado (${violations(0)}). A numeração não está determinada pelos dados.`,
    );
  }
}

console.log(
  `\nManifesto de ${SOURCE.name} (${SOURCE.id}) — ${manifest.videoCount} vídeos, ${manifest.citableCount} citáveis`,
);
console.log(`  build .................... ${manifest.builtAt ?? '?'} · ${manifest.channelItemCount ?? '?'} itens no canal`);
console.log(`  refs únicos e posicionais . ${vistos.size}/${videos.length}`);
console.log(`  com data .................. ${datados.length}/${videos.length}`);
if (ancoragem) {
  console.log(`  âncoras verificadas ....... ${ancoragem.anchors.length}`);
  console.log(
    `  offset determinado ........ ${pairs.length} timestamps · 0 violações vs ${rival.map((c) => c.bad).join('/')} nos vizinhos`,
  );
  console.log(`  ${SOURCE.refPrefix} distintos citados ....... ${cited.size}`);
} else {
  // Dito em voz alta de propósito: silêncio aqui seria lido como "verificado".
  console.log('  âncoras verificadas ....... 0 — NÃO SE APLICA');
  console.log(`  offset determinado ........ NÃO VERIFICADO: "${SOURCE.id}" não tem citação prévia para ancorar.`);
  console.log('                              Só a integridade do manifesto foi checada; se o canal tiver');
  console.log('                              publicado depois do build, compare `channelItemCount` com o de hoje.');
}
console.log(`  duração total ............. ${(manifest.totalDurationSec / 3600).toFixed(1)} h`);

if (warnings.length > 0) {
  console.log(`\n${warnings.length} aviso(s):`);
  for (const x of warnings.slice(0, 10)) console.log(`  ⚠ ${x}`);
}

if (errors.length > 0) {
  console.error(`\n${errors.length} ERRO(S):`);
  for (const e of errors.slice(0, 20)) console.error(`  ✗ ${e}`);
  if (errors.length > 20) console.error(`  … e mais ${errors.length - 20}`);
  console.error('');
  process.exit(1);
}

console.log(
  ancoragem
    ? '\n✓ numeração alinhada com a run 1 e toda citação do programa resolve\n'
    : `\n✓ manifesto íntegro — alinhamento de "${SOURCE.id}" fica sem prova até existir citação\n`,
);
