// Filtra claims das gavetas de interesse por modo/scope/topico.
// Uso: node filtra.mjs <topicos separados por virgula> [modo] [scope]
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = new URL('../../extract/', import.meta.url).pathname;
const [topicsArg, modo, scope] = process.argv.slice(2);
const topics = (topicsArg || '').split(',').filter(Boolean);

const all = [];
for (const f of readdirSync(DIR).filter((x) => x.endsWith('.jsonl'))) {
  for (const line of readFileSync(join(DIR, f), 'utf8').split('\n')) {
    if (!line.trim()) continue;
    all.push(JSON.parse(line));
  }
}

const hit = all.filter((c) => {
  const t = c.topic || [];
  if (topics.length && !topics.every((x) => t.includes(x))) return false;
  if (modo && modo !== '*' && c.modo !== modo) return false;
  if (scope && scope !== '*' && c.scope !== scope) return false;
  return true;
});

for (const c of hit) {
  console.log(`${c.id}  ${c.scope}  ${c.modo}  [${(c.topic || []).join(',')}]`);
  console.log(`   ${c.claim}`);
  if (c.conditions?.length) console.log(`   cond: ${c.conditions.join(', ')}`);
  if (c.conflicts?.length) console.log(`   confl: ${c.conflicts.join(', ')}`);
  if (c.params?.length) console.log(`   params: ${c.params.map((p) => `${p.name}=${p.value}${p.unit}`).join(' ')}`);
}
console.log(`\n${hit.length} de ${all.length}`);
