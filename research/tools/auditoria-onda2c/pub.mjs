import fs from 'node:fs';
import {roda,roteou} from './run.mjs';
import {secoes} from './parse.mjs';
const j=JSON.parse(fs.readFileSync('/Users/brunnovert/Documents/Dev/powerlifting-app/research/kb/CANARIOS.json','utf8'));
let algum=0,todos=0,rot=0;
for(const c of j.canarios){
  if(!c.id.startsWith('P'))continue;
  const out=roda(c.pergunta);
  fs.writeFileSync('/tmp/aud/out-'+c.id+'.txt',out);
  const s=secoes(out);
  const onde=id=>{const r=s.rota.find(x=>x.id===id);if(r)return 'DET'+r.pos;
    if(s.indice.some(x=>x.id===id))return 'idx'; if(s.param.some(x=>x.id===id))return 'par';
    if(s.lado.some(x=>x.id===id))return 'lado'; return null;};
  const ach=c.sustenta.map(i=>[i,onde(i)]).filter(x=>x[1]);
  const tops=roteou(out);
  const tCerto=tops.includes(c.perguntaDoAtleta.topicoDaResposta);
  if(ach.length)algum++;
  if(ach.length===c.sustenta.length)todos++;
  if(tCerto)rot++;
  console.log(`${c.id} ${ach.length?'ALGUM':'-----'} ${ach.length===c.sustenta.length?'TODOS':'     '} | ${ach.map(a=>a.join('=')).join(', ')||'nada'}  [alvo:${c.perguntaDoAtleta.topicoDaResposta} ${tCerto?'ABRIU':'FECHADA'}]`);
}
console.log(`\nPUBLICOS algum=${algum}/18 todos=${todos}/18 abriuTopicoDaResposta=${rot}/18`);
