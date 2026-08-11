import {medir} from '/tmp/aud/tela.mjs';
import fs from 'node:fs';
const cegos=JSON.parse(fs.readFileSync('/tmp/aud/cegos.json','utf8'));
const j=JSON.parse(fs.readFileSync('/Users/brunnovert/Documents/Dev/powerlifting-app/research/kb/CANARIOS.json','utf8'));
const pubs=j.canarios.filter(c=>c.id.startsWith('P')).map(c=>({id:c.id,q:c.pergunta,esp:c.sustenta}));
for(const [lista,nome] of [[pubs,'PUBLICOS'],[cegos.map(c=>({id:c.id,q:c.q,esp:c.esp})),'CEGOS']]){
  let a40=0,aTudo=0,det=0;
  for(const c of lista){const m=medir(c.q);const tudo=[...m.tela,...m.fora];
    if(c.esp.some(i=>m.tela.some(t=>t.id===i)))a40++;
    if(c.esp.some(i=>tudo.some(t=>t.id===i)))aTudo++;
    if(c.esp.some(i=>m.tela.slice(0,8).some(t=>t.id===i)))det++;}
  console.log(`${nome}: dentro do teto 40 = ${a40}/${lista.length} | em TUDO que a tela imprime (68) = ${aTudo}/${lista.length} | no bloco de DETALHE (8 primeiras, texto completo) = ${det}/${lista.length}`);
}
