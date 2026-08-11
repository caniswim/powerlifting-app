import fs from 'node:fs';import {execFileSync} from 'node:child_process';
const box='/tmp/mutbox/s3';
const SUB=[['research/tools/roteador.test.mjs'],['research/tools/check-canarios.test.mjs'],
['research/tools/build-glossario.mjs','--check'],['research/tools/check-glossario.mjs'],
['research/tools/check-canarios.mjs'],['research/tools/check-rotas.mjs']];
const lotes=[1,2,3,4,5,6,7,8].map(n=>box+`/research/kb/entrada/lote-${n}.json`);
const orig=lotes.map(f=>fs.readFileSync(f,'utf8'));
const art=box+'/research/kb/GLOSSARIO-TOPICOS.json';const oa=fs.readFileSync(art,'utf8');
const rest=()=>{lotes.forEach((f,i)=>fs.writeFileSync(f,orig[i]));fs.writeFileSync(art,oa);};
function corre(){const r=[];for(const a of SUB){try{execFileSync('node',a,{cwd:box,stdio:'pipe',maxBuffer:1e8});r.push([a[0].split('/').pop(),'ok']);}catch(e){r.push([a[0].split('/').pop(),'FALHOU: '+String(e.stdout||'').split('\n').filter(l=>l.includes('✗')).slice(0,2).join(' / ')]);}}return r;}
function muta(nome,termos){
  for(const f of lotes){const j=JSON.parse(fs.readFileSync(f,'utf8'));const arr=j.topicos||j;
    const list=Array.isArray(arr)?arr:Object.values(arr);const t=list.find(x=>x&&x.topico===nome);
    if(t){console.log(`  ${nome}: ${t.entrada.length} termos -> ${termos.length}`);t.entrada=termos;fs.writeFileSync(f,JSON.stringify(j,null,2));return true;}}
  return false;}
const nome=process.argv[2];const modo=process.argv[3];
const termos = modo==='lixo' ? ['zzqa','zzqb','zzqc','zzqd','zzqe','zzqf','zzqg','zzqh','zzqi','zzqj'] : null;
muta(nome, termos);
try{execFileSync('node',['research/tools/build-glossario.mjs'],{cwd:box,stdio:'pipe'});console.log('  build: ok');}
catch(e){console.log('  build FALHOU:',String(e.stdout||e.stderr).split('\n').filter(l=>l.includes('✗')).join(' / '));rest();process.exit(0);}
for(const [n,s] of corre())console.log('  ',n,s);
rest();
