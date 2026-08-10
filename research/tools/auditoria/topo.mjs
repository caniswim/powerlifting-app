import { medirCru } from './auditoria-onda2d.mjs';
import { CEGOS } from './cegos.mjs';
import { readFileSync } from 'node:fs';
const LEG={vagas:{estrategia:'global'},canais:{rota:40,param:12,ligacao:0,lado:8}};
const C=JSON.parse(readFileSync('/Users/brunnovert/Documents/Dev/powerlifting-app/research/kb/CANARIOS.json','utf8'));
const R=JSON.parse(readFileSync('/Users/brunnovert/Documents/Dev/powerlifting-app/research/kb/ROTAS.json','utf8'));
const CASOS=[];
for (const c of R.casos) if(c.familia==='mapeia'&&(c.sustenta??[]).length) CASOS.push({id:c.id,p:c.pergunta,ids:c.sustenta,teto:c.tetoDeTela??R.tetoDeTela,forcar:c.forcaTopico?[c.forcaTopico]:undefined});
for (const c of C.canarios??[]) if((c.familia==='presente'||c.familia==='presente-escondido')&&(c.sustenta??[]).length&&c.pergunta) CASOS.push({id:c.id,p:c.pergunta,ids:c.sustenta,teto:40});
CASOS.push({id:'FISG',p:'fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?',ids:['V079-34','V001-06','V138-19','V086-21','V027-23'],teto:40});
let subiu=0,desceu=0,igual=0,novos=0,perdidos=0; const somaL=[],somaA=[];
for (const c of CASOS) {
  const a=medirCru(c.p,{teto:c.teto,...(c.forcar?{forcar:c.forcar}:{})});
  const l=medirCru(c.p,{teto:c.teto,...(c.forcar?{forcar:c.forcar}:{}),...LEG});
  for (const id of c.ids) {
    const pa=a.telaIds.indexOf(id)+1, pl=l.telaIds.indexOf(id)+1;
    if(pa&&!pl) novos++; else if(!pa&&pl) perdidos++;
    else if(pa&&pl){ somaL.push(pl); somaA.push(pa); if(pa<pl)subiu++; else if(pa>pl)desceu++; else igual++; }
  }
}
const med=a=>{const s=[...a].sort((x,y)=>x-y);return s[Math.floor(s.length/2)];};
console.log(`ids que estavam nas DUAS telas: ${somaA.length}  (subiram ${subiu}, desceram ${desceu}, iguais ${igual})`);
console.log(`posicao MEDIANA legado ${med(somaL)}  ->  atual ${med(somaA)}`);
console.log(`ganhos novos: ${novos}   perdidos: ${perdidos}`);
