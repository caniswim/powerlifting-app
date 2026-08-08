#!/usr/bin/env node
/**
 * Verifica o parser de notas de prescrição contra os blocos reais.
 *
 * A UI hierarquiza a nota lendo a gramática que o PROGRAMA.md usa: cabeçalho em
 * caixa alta, citação entre colchetes, `⚠️` de ressalva, aspas de verbatim. Essa
 * é uma suposição sobre o texto, e suposição sobre texto apodrece: basta alguém
 * editar o markdown de um jeito levemente diferente para o renderizador começar
 * a esconder instrução sem avisar ninguém.
 *
 * Então a suposição vira invariante executável. A checagem central é de
 * CONSERVAÇÃO: todo caractere significativo da nota crua tem que reaparecer no
 * resultado do parser. Um cabeçalho mal reconhecido move texto de lugar; um
 * cabeçalho que engole o corpo faz texto sumir — e as duas coisas quebram aqui,
 * no build, e não na academia com a barra nas costas.
 *
 * Uso: node scripts/check-notes-parser.mjs [--verbose]
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const GENERATED = join(ROOT, 'src/data/program/vena-block1/generated.ts');

const { parsePrescriptionNotes, noteHighlights } = await import(
  join(ROOT, 'src/domain/prescriptionNotes.ts')
);

const VERBOSE = process.argv.includes('--verbose');

/** Extrai `venaBlock1Weeks` do arquivo gerado sem transpilar o módulo inteiro. */
function loadWeeks() {
  const src = readFileSync(GENERATED, 'utf8');
  const decl = 'export const venaBlock1Weeks: PrescribedWeek[] = ';
  const start = src.indexOf(decl);
  if (start < 0) throw new Error(`declaração não encontrada em ${GENERATED}`);
  const open = src.indexOf('[', start + decl.length);
  const end = src.indexOf('\n];', open);
  if (open < 0 || end < 0) throw new Error('array de semanas malformado');
  return JSON.parse(src.slice(open, end + 2));
}

/**
 * Normaliza para comparação de conservação.
 *
 * Some tudo que é marcação (colchete, aspa, crase, `⚠️`) e tudo que é
 * pontuação de delimitação (`:`, `—`) — são justamente os caracteres que o
 * parser consome ao virar estrutura. Sobra a substância: letras e dígitos.
 */
function substance(s) {
  return s
    .normalize('NFC')
    .replace(/[^\p{L}\p{N}]/gu, '')
    .toUpperCase();
}

/** Reconstrói o texto a partir da estrutura devolvida pelo parser. */
function rebuild(parsed) {
  const parts = [];
  for (const seg of parsed.segments) {
    if (seg.heading) parts.push(seg.heading);
    for (const span of seg.spans) parts.push(span.value);
  }
  if (parsed.target) parts.push(`Alvo ${parsed.target.kg} kg TM ${parsed.target.trainingMax}`);
  return parts.join(' ');
}

const weeks = loadWeeks();
const blocks = [];
for (const week of weeks) {
  for (const day of week.days) {
    for (const ex of day.exercises) {
      if (ex.notes) blocks.push({ id: `w${week.weekNumber}`, name: ex.exerciseName, notes: ex.notes });
    }
  }
}

const errors = [];
const warnings = [];
const headingCount = new Map();
const toneCount = new Map();
const unique = new Map();

let noHeading = 0;
let noHighlight = 0;
let withTarget = 0;
let totalCitations = 0;

for (const block of blocks) {
  const parsed = parsePrescriptionNotes(block.notes);
  const where = `${block.id} · ${block.name}`;

  if (!parsed) {
    errors.push(`${where}: nota não vazia devolveu null`);
    continue;
  }

  // 1. CONSERVAÇÃO — a invariante que justifica o arquivo inteiro.
  const before = substance(block.notes);
  const after = substance(rebuild(parsed));
  if (before !== after) {
    // Localiza o primeiro ponto de divergência para o erro ser acionável.
    let i = 0;
    while (i < before.length && i < after.length && before[i] === after[i]) i += 1;
    errors.push(
      `${where}: parser perdeu ou duplicou texto (${before.length} → ${after.length} chars)\n` +
        `    diverge em ${i}: esperado …${before.slice(Math.max(0, i - 40), i + 40)}…\n` +
        `                   obtido   …${after.slice(Math.max(0, i - 40), i + 40)}…`,
    );
  }

  // 2. O sufixo gerado por máquina não pode vazar para dentro da prosa.
  for (const seg of parsed.segments) {
    if (/Alvo\s*≈/.test(seg.plain)) {
      errors.push(`${where}: sufixo "Alvo ≈" vazou para o segmento "${seg.heading ?? '(prosa)'}"`);
    }
  }

  // 3. Placeholder do template nunca deve sobreviver até a UI.
  if (/\{[A-Z0-9-]+\}/.test(block.notes)) {
    errors.push(`${where}: placeholder {VAR} não substituído chegou até a nota`);
  }

  // 4. Cabeçalho não pode ser desproporcional — sinal de match errado engolindo frase.
  for (const seg of parsed.segments) {
    if (seg.heading && seg.heading.length > 90) {
      warnings.push(`${where}: cabeçalho suspeito de ${seg.heading.length} chars — "${seg.heading}"`);
    }
    // Cabeçalho sem corpo é forma legítima — `PAPEL PRÁTICA (40–70%)` é rótulo,
    // não seção — e o renderizador trata como chip. Não é aviso.
  }

  // 5. Toda nota precisa render pelo menos uma linha de destaque, senão a UI
  //    mostra um card vazio no lugar da instrução.
  const highlights = noteHighlights(parsed);
  if (highlights.length === 0 || highlights.every((h) => !h.plain)) {
    noHighlight += 1;
    warnings.push(`${where}: nenhum destaque extraível`);
  }

  if (parsed.segments.every((s) => !s.heading)) noHeading += 1;
  if (parsed.target) withTarget += 1;
  totalCitations += parsed.citationCount;

  for (const seg of parsed.segments) {
    if (seg.heading) headingCount.set(seg.heading, (headingCount.get(seg.heading) ?? 0) + 1);
    toneCount.set(seg.tone, (toneCount.get(seg.tone) ?? 0) + 1);
  }

  unique.set(block.notes, parsed);
}

const pct = (n) => `${((n / blocks.length) * 100).toFixed(1)}%`;

console.log(`\nParser de notas — ${blocks.length} blocos, ${unique.size} textos únicos`);
console.log(`  cabeçalhos distintos ...... ${headingCount.size}`);
console.log(`  blocos sem cabeçalho ...... ${noHeading} (${pct(noHeading)})`);
console.log(`  blocos com alvo numérico .. ${withTarget} (${pct(withTarget)})`);
console.log(`  citações extraídas ........ ${totalCitations}`);
console.log(`  sem destaque .............. ${noHighlight}`);
console.log(
  `  tons ...................... ${[...toneCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([t, n]) => `${t}:${n}`)
    .join('  ')}`,
);

if (VERBOSE) {
  console.log('\n  cabeçalhos mais frequentes:');
  for (const [h, n] of [...headingCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30)) {
    console.log(`    ${String(n).padStart(4)}  ${h}`);
  }
}

if (warnings.length > 0) {
  console.log(`\n${warnings.length} aviso(s):`);
  for (const w of warnings.slice(0, 25)) console.log(`  ⚠ ${w}`);
  if (warnings.length > 25) console.log(`  … e mais ${warnings.length - 25}`);
}

if (errors.length > 0) {
  console.error(`\n${errors.length} ERRO(S):`);
  for (const e of errors.slice(0, 15)) console.error(`  ✗ ${e}`);
  if (errors.length > 15) console.error(`  … e mais ${errors.length - 15}`);
  console.error('');
  process.exit(1);
}

console.log('\n✓ parser conserva o texto de todos os blocos\n');
