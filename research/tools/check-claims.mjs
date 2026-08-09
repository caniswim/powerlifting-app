#!/usr/bin/env node
/**
 * O compilador da base de conhecimento.
 *
 * A run 1 verificou a base com revisão adversarial — agente lendo prosa de
 * agente. Dois defeitos passaram assim mesmo: um fator inventado com cara de
 * citação, e uma conversão de unidade que nunca aconteceu entre dois documentos
 * que usavam o mesmo número com semânticas diferentes.
 *
 * Nenhum dos dois é sutil para uma máquina. O primeiro é uma citação cujo
 * verbatim não existe na transcrição. O segundo é um número atravessando frames
 * sem conversor declarado. Este arquivo recusa os dois, no build.
 *
 * Uso: node research/tools/check-claims.mjs [--verbose]
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MANIFEST = join(ROOT, 'research/corpus/manifest.json');
const EXTRACT = join(ROOT, 'research/extract');
const VERBOSE = process.argv.includes('--verbose');

/** Quanto o `at` da claim pode divergir de onde o verbatim realmente aparece. */
const AT_TOLERANCE_SEC = 45;

const TIERS = new Set(['R', 'E', 'L', 'I', 'U']);
const SCOPES = new Set(['GERAL', 'PESSOAL']);
const CERTAINTY = new Set(['explicit', 'implied']);
const FRAMES = new Set([
  '1RM_treino', '1RM_legal', 'TM', 'pct_TM', 'pct_1RM',
  'RPE', 'RIR', 'kg', 'lb', 'reps', 'series', 'min', 'seg', 'cm', 'pct', 'x_semana', 'anos',
]);

const toSec = (s) => String(s).trim().split(':').map(Number).reduce((a, p) => a * 60 + p, 0);

/** Minúsculo, sem pontuação, espaço colapsado — o denominador comum entre o
 *  verbatim que o agente copiou e o ASR cru do YouTube. */
const norm = (s) =>
  s.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const byRef = new Map(manifest.videos.map((v) => [v.ref, v]));

/**
 * Carrega a transcrição já normalizada, com um mapa de deslocamento → segundo.
 * É o que permite responder "em que instante este trecho é dito" e comparar com
 * o `at` declarado.
 */
const transcriptCache = new Map();
function loadTranscript(ref) {
  if (transcriptCache.has(ref)) return transcriptCache.get(ref);
  const v = byRef.get(ref);
  if (!v?.transcript) return null;
  const path = join(ROOT, v.transcript);
  if (!existsSync(path)) return null;

  const body = readFileSync(path, 'utf8').split(/^---$/m).slice(2).join('---');
  let text = '';
  const offsets = []; // { at: charOffset, sec }
  for (const m of body.matchAll(/^\[([\d:]+)\]\s*(.*)$/gm)) {
    offsets.push({ at: text.length, sec: toSec(m[1]) });
    text += `${norm(m[2])} `;
  }
  const entry = { text, offsets };
  transcriptCache.set(ref, entry);
  return entry;
}

function secAtOffset(t, off) {
  let best = 0;
  for (const o of t.offsets) {
    if (o.at > off) break;
    best = o.sec;
  }
  return best;
}

// `--only R014` deixa o agente extrator rodar o compilador contra o próprio
// arquivo enquanto trabalha, em vez de descobrir os erros num passe de revisão
// depois. Compilador no loop vale mais do que revisor no fim.
const onlyIdx = process.argv.indexOf('--only');
const only = onlyIdx >= 0 ? process.argv[onlyIdx + 1]?.replace(/\.jsonl$/, '') : null;

const files = existsSync(EXTRACT)
  ? readdirSync(EXTRACT)
      .filter((f) => f.endsWith('.jsonl'))
      .filter((f) => !only || f.startsWith(only))
      .sort()
  : [];

if (files.length === 0) {
  console.log('\nNenhum lote em research/extract/ ainda — nada a verificar.\n');
  process.exit(0);
}

const errors = [];
const warnings = [];
const seen = new Map();
const claims = [];

for (const file of files) {
  const lines = readFileSync(join(EXTRACT, file), 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (!line.trim()) return;
    const where = `${file}:${i + 1}`;
    let c;
    try {
      c = JSON.parse(line);
    } catch (err) {
      errors.push(`${where}: JSON inválido — ${err.message}`);
      return;
    }
    c._where = where;
    claims.push(c);

    if (!c.id) return errors.push(`${where}: sem id`);
    if (seen.has(c.id)) return errors.push(`${where}: id ${c.id} duplicado (já em ${seen.get(c.id)})`);
    seen.set(c.id, where);
  });
}

const byId = new Map(claims.map((c) => [c.id, c]));

for (const c of claims) {
  const w = `${c._where} ${c.id ?? ''}`;

  // Enumerados fechados. Valor fora da lista é erro, não interpretação livre.
  if (!TIERS.has(c.tier)) errors.push(`${w}: tier "${c.tier}" fora do enumerado`);
  if (c.scope && !SCOPES.has(c.scope)) errors.push(`${w}: scope "${c.scope}" fora do enumerado`);
  if (c.certainty && !CERTAINTY.has(c.certainty)) {
    errors.push(`${w}: certainty "${c.certainty}" fora do enumerado`);
  }
  if (!c.claim?.trim()) errors.push(`${w}: claim vazia`);

  // Procedência exigida por tier — a trava contra interpretação virar citação.
  if (c.tier === 'R') {
    if (!c.src || !c.at || !c.verbatim) {
      errors.push(`${w}: tier R exige src, at e verbatim`);
    }
    if (!c.scope) errors.push(`${w}: tier R exige scope (GERAL prescreve, PESSOAL descreve)`);
  }
  if (c.tier === 'I' && !(Array.isArray(c.basis) && c.basis.length > 0)) {
    errors.push(`${w}: tier I é interpretação e exige basis com os ids que a sustentam`);
  }
  if (c.tier === 'L' && !/\b(PMID:\s*\d{6,9}|10\.\d{4,9}\/\S+)/i.test(JSON.stringify(c.source ?? ''))) {
    errors.push(`${w}: tier L exige source com PMID ou DOI`);
  }
  for (const b of c.basis ?? []) {
    if (!byId.has(b)) errors.push(`${w}: basis aponta para ${b}, que não existe`);
  }
  for (const x of c.conflicts ?? []) {
    if (!byId.has(x)) errors.push(`${w}: conflicts aponta para ${x}, que não existe`);
  }

  // Números: unidade e frame obrigatórios, enumerado fechado.
  for (const p of c.params ?? []) {
    if (!p.name) errors.push(`${w}: param sem name`);
    if (p.value === undefined || p.value === null) errors.push(`${w}: param ${p.name} sem value`);
    if (!p.frame) errors.push(`${w}: param ${p.name} sem frame — foi assim que 215 kg virou training max`);
    else if (!FRAMES.has(p.frame)) errors.push(`${w}: param ${p.name} com frame "${p.frame}" fora do enumerado`);
  }

  // Todo número na prosa precisa ter param correspondente. Número solto na
  // claim é número sem procedência, e é assim que um fator inventado entra.
  const declared = new Set((c.params ?? []).map((p) => String(p.value).replace(',', '.')));
  const stripped = (c.claim ?? '')
    .replace(/\[?R\d+[^\]]*\]?/g, ' ')   // refs de vídeo
    .replace(/\b1RM\b/gi, ' ')
    .replace(/\bV\d{3}-\d+\b/g, ' ');     // ids de claim
  for (const m of stripped.matchAll(/\d+(?:[.,]\d+)?/g)) {
    const n = m[0].replace(',', '.');
    if (!declared.has(n) && !declared.has(String(Number(n)))) {
      errors.push(`${w}: número ${m[0]} aparece na claim mas não tem param — número sem procedência`);
    }
  }

  if (c.tier !== 'R') continue;

  // Citação resolve para vídeo citável.
  const v = byRef.get(c.src);
  if (!v) {
    errors.push(`${w}: src ${c.src} não existe no manifesto`);
    continue;
  }
  if (v.postRun1) {
    errors.push(`${w}: src ${c.src} é vídeo pós-run-1 e está fora da numeração citável`);
    continue;
  }

  const at = toSec(c.at);
  if (v.durationSec && at > v.durationSec) {
    errors.push(`${w}: at ${c.at} passa da duração de ${c.src} (${v.durationSec}s)`);
    continue;
  }

  // A CHECAGEM CENTRAL: o verbatim existe mesmo, e no lugar declarado.
  const t = loadTranscript(c.src);
  if (!t) {
    warnings.push(`${w}: transcrição de ${c.src} ainda não baixada — verbatim não verificado`);
    continue;
  }
  const needle = norm(c.verbatim ?? '');
  if (needle.length < 12) {
    errors.push(`${w}: verbatim curto demais (${needle.length} chars) para ser evidência`);
    continue;
  }
  const found = t.text.indexOf(needle);
  if (found < 0) {
    errors.push(
      `${w}: verbatim NÃO aparece na transcrição de ${c.src}\n` +
        `        procurado: "${needle.slice(0, 90)}…"`,
    );
    continue;
  }
  const realSec = secAtOffset(t, found);
  if (Math.abs(realSec - at) > AT_TOLERANCE_SEC) {
    errors.push(
      `${w}: verbatim existe em ${c.src} mas em ~${Math.floor(realSec / 60)}:${String(realSec % 60).padStart(2, '0')}, ` +
        `não em ${c.at} (tolerância ${AT_TOLERANCE_SEC}s)`,
    );
  }
}

const tierCount = new Map();
const topicCount = new Map();
for (const c of claims) {
  tierCount.set(c.tier, (tierCount.get(c.tier) ?? 0) + 1);
  for (const t of c.topic ?? []) topicCount.set(t, (topicCount.get(t) ?? 0) + 1);
}

console.log(`\nBase de conhecimento — ${claims.length} claims em ${files.length} lote(s)`);
console.log(`  tiers ..................... ${[...tierCount].sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t}:${n}`).join('  ')}`);
console.log(`  tópicos distintos ......... ${topicCount.size}`);
console.log(`  vídeos com claim .......... ${new Set(claims.filter((c) => c.src).map((c) => c.src)).size}`);
console.log(`  contradições registradas .. ${claims.filter((c) => c.conflicts?.length).length}`);

if (VERBOSE) {
  console.log('\n  tópicos mais densos:');
  for (const [t, n] of [...topicCount].sort((a, b) => b[1] - a[1]).slice(0, 20)) {
    console.log(`    ${String(n).padStart(4)}  ${t}`);
  }
}

if (warnings.length > 0) {
  console.log(`\n${warnings.length} aviso(s):`);
  for (const x of warnings.slice(0, 15)) console.log(`  ⚠ ${x}`);
  if (warnings.length > 15) console.log(`  … e mais ${warnings.length - 15}`);
}

if (errors.length > 0) {
  console.error(`\n${errors.length} ERRO(S):`);
  for (const e of errors.slice(0, 30)) console.error(`  ✗ ${e}`);
  if (errors.length > 30) console.error(`  … e mais ${errors.length - 30}`);
  console.error('');
  process.exit(1);
}

console.log('\n✓ toda claim resolve, todo verbatim existe, todo número tem frame\n');
