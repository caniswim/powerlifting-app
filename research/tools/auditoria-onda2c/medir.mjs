import {medir} from '/tmp/aud/tela.mjs';
import fs from 'node:fs';
const cegos=JSON.parse(fs.readFileSync('/tmp/aud/cegos.json','utf8'));
const j=JSON.parse(fs.readFileSync('/Users/brunnovert/Documents/Dev/powerlifting-app/research/kb/CANARIOS.json','utf8'));
const pubs=j.canarios.filter(c=>c.id.startsWith('P')).map(c=>({id:c.id,q:c.pergunta,esp:c.sustenta}));
function roda(lista,nome){
  let algum=0,todos=0;
  for(const c of lista){
    const m=medir(c.q);
    const ach=c.esp.filter(i=>m.tela.some(t=>t.id===i));
    const fora=c.esp.filter(i=>m.fora.some(t=>t.id===i));
    if(ach.length)algum++; if(ach.length===c.esp.length)todos++;
    console.log(`${c.id} tela=[${ach.map(i=>i+'@'+(m.tela.findIndex(t=>t.id===i)+1)+':'+m.tela.find(t=>t.id===i).canal).join(',')||'-'}] alem-do-teto=[${fora.join(',')||'-'}]`);
  }
  console.log(`${nome}: algum=${algum}/${lista.length} todos=${todos}/${lista.length}\n`);
}
roda(pubs,'PUBLICOS (definicao do proprio check-canarios)');
roda(cegos,'CEGOS (definicao do proprio check-canarios)');
const f=medir('fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?');
console.log('FISGADA rotas:',f.rotas.join(','));
for(const i of ['V079-34','V001-06','V138-19','V086-21','V027-23']){
  const t=f.tela.findIndex(x=>x.id===i); const o=f.fora.findIndex(x=>x.id===i);
  console.log('  ',i, t>=0?('TELA '+(t+1)+'º ('+f.tela[t].canal+')'):(o>=0?('ALEM DO TETO, pos '+(40+o+1)+' ('+f.fora[o].canal+')'):'NAO RECUPERADA'));
}
