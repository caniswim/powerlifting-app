#!/usr/bin/env node
/**
 * Trava o manifesto do corpus contra deslocamento silencioso.
 *
 * O manifesto é derivado da ordem do canal, e a ordem do canal muda toda vez que
 * o Matt Vena publica um vídeo. Se alguém regerar sem ajustar `POST_RUN1`, todo
 * `[Rxxx]` passa a apontar para o vizinho — e nada quebra, nada avisa, a base
 * inteira fica um vídeo fora de fase. É o tipo de erro que só aparece quando
 * você já treinou seis semanas em cima dele.
 *
 * Então a suposição vira invariante executável, como no parser de notas: seis
 * âncoras semânticas, colhidas do que sobrou da run 1 (`research/recuperado/`),
 * onde o conteúdo do vídeo identifica o número sem ambiguidade.
 *
 * Uso: node research/tools/verify-manifest.mjs
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MANIFEST = join(ROOT, 'research/corpus/manifest.json');
const PROGRAMA = join(ROOT, 'src/data/program/vena-block1/source/PROGRAMA.md');

/**
 * Cada âncora casa um número `[Rxxx]` com um padrão que só o título daquele
 * vídeo satisfaz. A procedência é o arquivo recuperado que amarra o número ao
 * assunto — sem ela isto seria eu confirmando meu próprio palpite.
 */
const ANCHORS = [
  { r: 1, re: /3 YEARS OF INJURIES/i, why: 'kb-sintese: [R1] é a régua de dor ~2/10 (regra D1)' },
  { r: 4, re: /PROGRAM That Got Me A 400KG SQUAT/i, why: 'kb-sintese: [R4] é a progressão linear declarada' },
  { r: 102, re: /NEVER do DELOADS/i, why: 'kb-sintese: [R102] é o "never deload" da contradição do taper' },
  { r: 113, re: /Squat Exercise TIER LIST/i, why: 'kb-sintese: [R113] é o tier list que rebaixa para tier B' },
  { r: 159, re: /STOP TRYING TO SQUAT UPRIGHT/i, why: 'kb-sintese: [R159] é "o cue-bandeira do canal"' },
  { r: 168, re: /Best Squat Accessory/i, why: 'kb-sintese: [R168] é "o acessório de agacho nº 1 dele"' },
];

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const byRef = new Map(manifest.videos.map((v) => [v.rNumber, v]));

const errors = [];

// 1. ÂNCORAS — a invariante que justifica o arquivo.
for (const a of ANCHORS) {
  const v = byRef.get(a.r);
  if (!v) {
    errors.push(`R${a.r} não existe no manifesto`);
    continue;
  }
  if (!a.re.test(v.title)) {
    errors.push(
      `R${a.r} deveria casar ${a.re} mas o manifesto traz "${v.title}"\n` +
        `      procedência: ${a.why}\n` +
        `      → o canal provavelmente publicou vídeo novo; ajuste POST_RUN1 em build-manifest.mjs`,
    );
  }
}

// 2. Toda citação do programa tem que resolver para um vídeo citável.
const programa = readFileSync(PROGRAMA, 'utf8');
const cited = new Set(
  [...programa.matchAll(/\[R(\d+)(?:\s|@|,|\])/g)].map((m) => Number(m[1])),
);
const unresolved = [...cited].filter((r) => !byRef.has(r) || byRef.get(r).postRun1);
if (unresolved.length > 0) {
  errors.push(`citações sem vídeo correspondente: ${unresolved.sort((a, b) => a - b).join(', ')}`);
}

// 3. Timestamps não podem passar da duração do vídeo.
for (const m of programa.matchAll(/\[R(\d+)\s*@\s*([\d:,\s]+)\]/g)) {
  const v = byRef.get(Number(m[1]));
  if (!v?.durationSec) continue;
  for (const stamp of m[2].split(',')) {
    const parts = stamp.trim().split(':').map(Number);
    if (parts.some(Number.isNaN)) continue;
    const sec = parts.reduce((acc, p) => acc * 60 + p, 0);
    if (sec > v.durationSec) {
      errors.push(
        `[R${m[1]} @${stamp.trim()}] passa da duração do vídeo (${v.durationSec}s) — "${v.title}"`,
      );
    }
  }
}

// 4. UNICIDADE DO OFFSET — a checagem que transforma "plausível" em "determinado".
//    As âncoras confirmam o alinhamento; esta prova que nenhum outro alinhamento
//    serve. Cada timestamp citado é um teste: sob o offset errado, citações de
//    vídeo longo caem em vídeo curto e estouram a duração. Empate aqui significa
//    que as âncoras estão medindo menos do que parecem.
const pairs = [...programa.matchAll(/\[R(\d+)\s*@\s*([\d:,\s]+)\]/g)].flatMap((m) =>
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

const rival = [-2, -1, 1, 2].map((off) => ({ off, bad: violations(off) }));
const best = rival.filter((c) => c.bad <= violations(0));
if (best.length > 0) {
  errors.push(
    `offset não é único: ${best.map((c) => `${c.off >= 0 ? '+' : ''}${c.off} (${c.bad} violações)`).join(', ')} ` +
      `empata ou bate o adotado (${violations(0)}). A numeração não está determinada pelos dados.`,
  );
}

console.log(`\nManifesto do corpus — ${manifest.videoCount} vídeos, ${manifest.citableCount} citáveis`);
console.log(`  âncoras verificadas ....... ${ANCHORS.length}`);
console.log(
  `  offset determinado ........ ${pairs.length} timestamps · 0 violações vs ${rival.map((c) => c.bad).join('/')} nos vizinhos`,
);
console.log(`  R distintos citados ....... ${cited.size}`);
console.log(`  duração total ............. ${(manifest.totalDurationSec / 3600).toFixed(1)} h`);

if (errors.length > 0) {
  console.error(`\n${errors.length} ERRO(S):`);
  for (const e of errors.slice(0, 20)) console.error(`  ✗ ${e}`);
  if (errors.length > 20) console.error(`  … e mais ${errors.length - 20}`);
  console.error('');
  process.exit(1);
}

console.log('\n✓ numeração alinhada com a run 1 e toda citação do programa resolve\n');
