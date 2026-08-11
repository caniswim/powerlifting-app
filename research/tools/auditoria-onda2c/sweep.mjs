import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const box=process.argv[2], topicos=JSON.parse(process.argv[3]);
const SUB=[['research/tools/roteador.test.mjs'],['research/tools/check-canarios.test.mjs'],
['research/tools/build-glossario.mjs','--check'],['research/tools/check-glossario.mjs'],
['research/tools/check-canarios.mjs'],['research/tools/check-rotas.mjs']];
function verde(){for(const a of SUB){try{execFileSync('node',a,{cwd:box,stdio:'pipe',maxBuffer:1e8});}catch(e){return a[0].split('/').pop();}}return null;}
const lotes=[1,2,3,4,5,6,7,8].map(n=>box+`/research/kb/entrada/lote-${n}.json`);
const orig=lotes.map(f=>fs.readFileSync(f,'utf8'));
const art=box+'/research/kb/GLOSSARIO-TOPICOS.json';const origArt=fs.readFileSync(art,'utf8');
const rest=()=>{lotes.forEach((f,i)=>fs.writeFileSync(f,orig[i]));fs.writeFileSync(art,origArt);};
for(const nome of topicos){
  let alvo=null;
  for(const f of lotes){const j=JSON.parse(fs.readFileSync(f,'utf8'));const arr=j.topicos||j;
    const list=Array.isArray(arr)?arr:Object.values(arr);
    const t=list.find(x=>x&&x.topico===nome);
    if(t){t.entrada=['zzqa','zzqb','zzqc','zzqd','zzqe','zzqf','zzqg','zzqh','zzqi','zzqj'];fs.writeFileSync(f,JSON.stringify(j,null,2));alvo=f;break;}}
  if(!alvo){console.log('SKIP '+nome);continue;}
  let saida;
  try{execFileSync('node',['research/tools/build-glossario.mjs'],{cwd:box,stdio:'pipe'});saida=verde()||'>>> VERDE';}
  catch(e){saida='build-glossario (tabela CORRECOES/DESEMPATES)';}
  console.log(`${saida.startsWith('>>>')?'VERDE   ':'vermelha'}\t${nome}\t${saida}`);
  rest();
}
