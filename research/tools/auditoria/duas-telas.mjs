import { medir } from './auditoria-onda2d.mjs';
import { CEGOS } from './cegos.mjs';
import { readFileSync } from 'node:fs';

function telaBench(r) { // medir-alocacao.mjs
  const o=[],v=new Set(); const p=(c,k)=>{if(v.has(c.id))return;v.add(c.id);o.push({id:c.id,canal:k});};
  for (const x of r.claims) p(x.c,'rota');
  for (const x of r.params.lista) p(x.c,'param');
  for (const x of (r.ligacoes ?? [])) p(x.c,'ligacao');
  for (const x of r.vizinhos) p(x.c, x.canal ?? 'viz');
  return o;
}
const ROOT='/Users/brunnovert/Documents/Dev/powerlifting-app/research/kb/';
const cans=JSON.parse(readFileSync(ROOT+'CANARIOS.json','utf8'));
const rotas=JSON.parse(readFileSync(ROOT+'ROTAS.json','utf8'));
const CASOS=[];
for (const c of rotas.casos) if(c.familia==='mapeia'&&(c.sustenta??[]).length) CASOS.push({id:c.id,p:c.pergunta,ids:c.sustenta,teto:c.tetoDeTela??rotas.tetoDeTela,forcar:c.forcaTopico?[c.forcaTopico]:[]});
for (const c of cans.canarios??[]) if((c.familia==='presente'||c.familia==='presente-escondido')&&(c.sustenta??[]).length&&c.pergunta) CASOS.push({id:c.id,p:c.pergunta,ids:c.sustenta,teto:40,forcar:[]});
for (const c of CEGOS) CASOS.push({id:c.id,p:c.p,ids:c.espera,teto:40,forcar:[]});
CASOS.push({id:'FISG',p:'fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?',ids:['V079-34','V001-06','V138-19','V086-21','V027-23'],teto:40,forcar:[]});
let dif=0, gateIds=0, benchIds=0, tot=0;
const difs=[];
for (const c of CASOS) {
  const m = medir(c.p, {teto:c.teto, ...(c.forcar.length?{forcar:c.forcar}:{})});
  const g = m.ordemToda.slice(0,c.teto).map(x=>x.id);
  const b = telaBench(m.r).slice(0,c.teto).map(x=>x.id);
  const ag = c.ids.filter(i=>g.includes(i)), ab = c.ids.filter(i=>b.includes(i));
  gateIds+=ag.length; benchIds+=ab.length; tot+=c.ids.length;
  if (ag.length!==ab.length || JSON.stringify(g)!==JSON.stringify(b)) { dif++; if(ag.length!==ab.length) difs.push(`${c.id} gate=${ag.length} bench=${ab.length}`); }
}
console.log('casos',CASOS.length,'ordens diferentes',dif);
console.log('ids: gate(check-canarios telaDe)',gateIds,'bench(medir-alocacao telaDe)',benchIds,'de',tot);
console.log('divergem em ids:', difs.join(' | ')||'nenhum');
