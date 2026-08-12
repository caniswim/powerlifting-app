#!/usr/bin/env node
/**
 * OS 61 CANÁRIOS PÚBLICOS pela MESMA régua dos 12 cegos: a CLI, sem `--topic`,
 * a pergunta como está no JSON, e o id conta quando aparece IMPRESSO.
 *
 * Existe para medir a distância entre o visível e o cego. Se o público sobe e o
 * cego não, otimizou-se o que se enxergava.
 *
 * Uso: node research/tools/auditoria-onda2f/publicos.mjs
 */

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const AQUI = dirname(fileURLToPath(import.meta.url));
const ROOT = join(AQUI, '../../..');
const CLI = join(ROOT, 'research/tools/check-evidence.mjs');
const cans = JSON.parse(readFileSync(join(ROOT, 'research/kb/CANARIOS.json'), 'utf8')).canarios ?? [];

const familia = (id) => id[0];
const acc = new Map();
const bytes = [];
const acima34 = [];

for (const c of cans) {
  const esperados = c.sustenta ?? [];
  if (esperados.length === 0) continue;
  const out = execFileSync('node', [CLI, '--pergunta', c.pergunta], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const kb = Buffer.byteLength(out, 'utf8') / 1024;
  bytes.push({ id: c.id, kb });
  if (kb > 34) acima34.push(`${c.id} ${kb.toFixed(1)} kB`);
  const corpo = out.split('\n').filter((l) => !l.trim().startsWith('node ')).join('\n');
  const saiu = esperados.filter((id) => new RegExp(`\\b${id}\\b`).test(corpo));
  const f = familia(c.id);
  if (!acc.has(f)) acc.set(f, { n: 0, algum: 0, todos: 0, falhas: [] });
  const a = acc.get(f);
  a.n += 1;
  if (saiu.length > 0) a.algum += 1;
  if (saiu.length === esperados.length) a.todos += 1;
  else a.falhas.push(`${c.id}(${saiu.length}/${esperados.length})`);
}

console.log('\nOS PÚBLICOS, pela régua da CLI sem --topic\n');
let n = 0;
let algum = 0;
let todos = 0;
for (const [f, a] of [...acc].sort()) {
  console.log(`  ${f}##  algum ${a.algum}/${a.n}   todos ${a.todos}/${a.n}`);
  console.log(`       incompletos: ${a.falhas.join(' ') || '—'}`);
  n += a.n; algum += a.algum; todos += a.todos;
}
console.log(`\n  TODOS OS ${n}:  algum ${algum}   todos ${todos}`);

const so42 = [...acc].filter(([f]) => f !== 'C').reduce((s, [, a]) => ({
  n: s.n + a.n, algum: s.algum + a.algum, todos: s.todos + a.todos,
}), { n: 0, algum: 0, todos: 0 });
console.log(`  OS 42 (P/B/D):  algum ${so42.algum}/${so42.n}   todos ${so42.todos}/${so42.n}`);

bytes.sort((a, b) => b.kb - a.kb);
const med = bytes[Math.floor(bytes.length / 2)];
console.log(`\nCUSTO: maior ${bytes[0].kb.toFixed(1)} kB (${bytes[0].id}) · mediana ${med.kb.toFixed(1)} kB · menor ${bytes[bytes.length - 1].kb.toFixed(1)} kB`);
console.log(`  acima do teto de 34 kB que o secoes.test.mjs declara: ${acima34.length} de ${bytes.length}`);
console.log(`  ${acima34.join(' · ')}`);
