import { medir } from './auditoria-onda2d.mjs';
import { readFileSync } from 'node:fs';
const d = JSON.parse(readFileSync('/Users/brunnovert/Documents/Dev/powerlifting-app/research/kb/CANARIOS.json','utf8'));
const alvo = d.canarios.filter(c => /^P\d\d$/.test(c.id) || /^C(0[1-9]|1[0-2])$/.test(c.id));
let algum=0, todos=0, comIds=0, semIds=0;
for (const c of alvo) {
  const ids = c.sustenta ?? [];
  if (!ids.length) { semIds++; console.log(`${c.id} [${c.familia}] SEM ids esperados — nao mede recuperacao`); continue; }
  comIds++;
  const m = medir(c.pergunta, { teto: d.tetoDeTela });
  const a = ids.filter(i => m.telaIds.includes(i));
  if (a.length) algum++;
  if (a.length === ids.length) todos++;
  console.log(`${c.id} [${c.familia}] tela=${m.tela.length} ${a.length}/${ids.length} ${ids.map(i=>i+'@'+((m.telaIds.indexOf(i)+1)||'—')).join(' ')}`);
}
console.log(`\nP01-P18 + C01-C12: ${alvo.length} canarios, ${comIds} com ids, ${semIds} sem ids (impossivel/armadilha)`);
console.log(`ALGUM id: ${algum}/${comIds}   TODOS os ids: ${todos}/${comIds}`);
