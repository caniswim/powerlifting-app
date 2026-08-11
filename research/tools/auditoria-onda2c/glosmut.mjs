import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const box='/tmp/mutbox/s0';
const SUB=[['research/tools/roteador.test.mjs'],['research/tools/check-canarios.test.mjs'],
['research/tools/build-glossario.mjs','--check'],['research/tools/check-glossario.mjs'],
['research/tools/check-canarios.mjs'],['research/tools/check-rotas.mjs']];
function verde(){for(const a of SUB){try{execFileSync('node',a,{cwd:box,stdio:'pipe',maxBuffer:1e8});}catch(e){return a[0].split('/').pop();}}return null;}
const lotes=[1,2,3,4,5,6,7,8].map(n=>box+`/research/kb/entrada/lote-${n}.json`);
const orig=lotes.map(f=>fs.readFileSync(f,'utf8'));
const art=box+'/research/kb/GLOSSARIO-TOPICOS.json';
const origArt=fs.readFileSync(art,'utf8');
function restaura(){lotes.forEach((f,i)=>fs.writeFileSync(f,orig[i]));fs.writeFileSync(art,origArt);}
function rebuild(){try{execFileSync('node',['research/tools/build-glossario.mjs'],{cwd:box,stdio:'pipe'});return true;}catch(e){return false;}}

function acha(nome){
  for(const f of lotes){const j=JSON.parse(fs.readFileSync(f,'utf8'));
    const arr=j.topicos||j;
    const t=(Array.isArray(arr)?arr:Object.values(arr)).find(x=>x&&x.topico===nome);
    if(t)return {f,j,t};}
  return null;
}
// 1. esvaziar o artefato inteiro
fs.writeFileSync(art,JSON.stringify({_leia:[],topicos:[],desempates:[]},null,2));
console.log('1. artefato inteiro esvaziado (sem rebuild):', verde()||'VERDE');
restaura();

// 2. um topico: entrada -> 10 termos (o minimo da trava)
let a=acha('descanso-entre-series');
console.log('   descanso-entre-series tinha', a.t.entrada.length,'termos');
a.t.entrada=a.t.entrada.slice(0,10);
fs.writeFileSync(a.f,JSON.stringify(a.j,null,2));
console.log('2. entrada de descanso-entre-series cortada para 10 (+rebuild):', rebuild()? (verde()||'>>> VERDE') : 'build falhou');
restaura();

// 3. um topico: 10 termos de lixo
a=acha('descanso-entre-series');
a.t.entrada=['zzqa','zzqb','zzqc','zzqd','zzqe','zzqf','zzqg','zzqh','zzqi','zzqj'];
fs.writeFileSync(a.f,JSON.stringify(a.j,null,2));
console.log('3. entrada de descanso-entre-series virou 10 termos de LIXO (+rebuild):', rebuild()? (verde()||'>>> VERDE') : 'build falhou');
restaura();

// 4. TODOS os topicos cortados para 10 termos
for(const f of lotes){const j=JSON.parse(fs.readFileSync(f,'utf8'));
  const arr=j.topicos||j; for(const t of (Array.isArray(arr)?arr:Object.values(arr))) if(t&&t.entrada) t.entrada=t.entrada.slice(0,10);
  fs.writeFileSync(f,JSON.stringify(j,null,2));}
console.log('4. TODOS os 74 topicos cortados para 10 termos (+rebuild):', rebuild()? (verde()||'>>> VERDE') : 'build falhou');
restaura();

// 5. esvaziar naoConfundirCom de todos
for(const f of lotes){const j=JSON.parse(fs.readFileSync(f,'utf8'));
  const arr=j.topicos||j; for(const t of (Array.isArray(arr)?arr:Object.values(arr))) if(t&&t.naoConfundirCom) t.naoConfundirCom=[];
  fs.writeFileSync(f,JSON.stringify(j,null,2));}
console.log('5. naoConfundirCom zerado em TODOS os topicos (+rebuild):', rebuild()? (verde()||'>>> VERDE') : 'build falhou');
restaura();
console.log('restaurado. baseline:', verde()||'VERDE');
