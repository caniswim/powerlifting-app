import fs from 'node:fs';
import {roda,roteou,naoAbriram} from './run.mjs';
import {secoes} from './parse.mjs';
const cs=JSON.parse(fs.readFileSync('/tmp/aud/cegos.json','utf8'));
let algum=0,todos=0,rot=0,sot=0;
for(const c of cs){
  const out=fs.readFileSync('/tmp/aud/out-'+c.id+'.txt','utf8');
  const s=secoes(out);
  const onde=id=>{
    const r=s.rota.find(x=>x.id===id); if(r)return 'DETALHE '+r.pos+'º';
    if(s.indice.some(x=>x.id===id))return 'indice';
    if(s.param.some(x=>x.id===id))return 'param';
    if(s.lado.some(x=>x.id===id))return 'pagina-ao-lado';
    return null;
  };
  const ach=c.esp.map(id=>[id,onde(id)]).filter(x=>x[1]);
  const tops=roteou(out);
  const certos=tops.filter(t=>c.top.includes(t));
  const ok=ach.length>0;
  if(ok)algum++;
  if(ach.length===c.esp.length)todos++;
  if(certos.length)rot++;
  if(certos.length&&!ok)sot++;
  console.log(`${c.id} ${ok?'ALGUM':'-----'} ${ach.length===c.esp.length?'TODOS':'     '} | ${ach.map(a=>a[0]+'='+a[1]).join(', ')||'nada'}`);
  console.log(`   rota=[${tops.join(',')}] certos=[${certos.join(',')||'NENHUM'}] tela=${s.rota.length}+${s.indice.length}idx+${s.param.length}par+${s.lado.length}lado`);
}
console.log(`\nCEGOS algum=${algum}/12 todos=${todos}/12 roteouCerto=${rot}/12 soterrados=${sot}/12`);
