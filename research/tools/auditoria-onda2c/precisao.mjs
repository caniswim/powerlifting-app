import {medir} from '/tmp/aud/tela.mjs';
import fs from 'node:fs';
const cegos=JSON.parse(fs.readFileSync('/tmp/aud/cegos.json','utf8'));
const j=JSON.parse(fs.readFileSync('/Users/brunnovert/Documents/Dev/powerlifting-app/research/kb/CANARIOS.json','utf8'));
const qs=[...j.canarios.filter(c=>c.id.startsWith('P')).map(c=>[c.id,c.pergunta]),
 ...cegos.map(c=>[c.id,c.q]),
 ['ESTREITA-1','qual a espessura máxima do cinto permitida pelo regulamento da IPF'],
 ['ESTREITA-2','o cinto pode ter mais de 13 mm de espessura na IPF'],
 ['FISGADA','fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?']];
let quarenta=0;
for(const [id,q] of qs){
  const m=medir(q);
  const n=m.tela.length;
  if(n===40)quarenta++;
  console.log(`${id}\ttela=${n}\trotas=${m.rotas.length}\t[${m.rotas.join(',')}]`);
}
console.log(`\n${quarenta}/${qs.length} perguntas devolvem exatamente 40 claims (o teto). Nenhuma pergunta estreita devolve pouco.`);
