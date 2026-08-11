import fs from 'node:fs';
import {roda,ids,roteou,naoAbriram} from './run.mjs';
const cs=JSON.parse(fs.readFileSync('/tmp/aud/cegos.json','utf8'));
let algum=0, rot=0, sot=0;
const linhas=[];
for(const c of cs){
  const out=roda(c.q);
  fs.writeFileSync('/tmp/aud/out-'+c.id+'.txt',out);
  const lista=ids(out);
  const achados=lista.filter(x=>c.esp.includes(x.id));
  const tops=roteou(out);
  const abriuCerto=tops.filter(t=>c.top.includes(t));
  const na=naoAbriram(out);
  const ok=achados.length>0;
  if(ok)algum++;
  if(abriuCerto.length>0)rot++;
  if(abriuCerto.length>0&&!ok)sot++;
  console.log(`${c.id}  ${ok?'ACHOU':'-----'}  achados=${achados.map(a=>a.id+'@'+a.pos).join(',')||'nenhum'}`);
  console.log(`     roteou: ${tops.join(', ')}   | certos abertos: ${abriuCerto.join(',')||'NENHUM'}`);
  console.log(`     naoAbriram: ${na.join(' ; ')||'-'}   | total na tela: ${lista.length}`);
}
console.log(`\nCEGOS: ${algum}/12 algum id | roteou certo ${rot}/12 | soterrados ${sot}/12`);
