import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const R='/Users/brunnovert/Documents/Dev/powerlifting-app';
const dir=R+'/research/kb/entrada';
const arquivos=readdirSync(dir).filter(f=>f.endsWith('.json'));
let alvo=null;
for(const f of arquivos){ const d=JSON.parse(readFileSync(dir+'/'+f,'utf8'));
  const lista=d.topicos??d; const t=(Array.isArray(lista)?lista:lista.topicos).find(x=>x.topico==='descanso-entre-series');
  if(t){alvo={f,d,t};break;} }
if(!alvo) throw new Error('nao achei descanso-entre-series nos lotes');
const origLote=readFileSync(dir+'/'+alvo.f,'utf8');
const origGlos=readFileSync(R+'/research/kb/GLOSSARIO-TOPICOS.json','utf8');
console.log('lote:',alvo.f,'termos originais:',alvo.t.entrada.length);
try{
  alvo.t.entrada=['zzqa','zzqb','zzqc','zzqd','zzqe','zzqf','zzqg','zzqh','zzqi','zzqj'];
  writeFileSync(dir+'/'+alvo.f,JSON.stringify(alvo.d,null,2)+'\n');
  execFileSync('node',['research/tools/build-glossario.mjs'],{cwd:R,stdio:'pipe'});
  let code=0;
  try{ execFileSync('npm',['run','check:kb'],{cwd:R,stdio:'pipe'}); }catch(e){ code=e.status; }
  console.log('npm run check:kb com descanso-entre-series virado lixo → exit',code, code===0?'VERDE (BURACO ABERTO)':'VERMELHO (buraco fechado)');
}finally{
  writeFileSync(dir+'/'+alvo.f,origLote);
  writeFileSync(R+'/research/kb/GLOSSARIO-TOPICOS.json',origGlos);
}
console.log('restaurado byte a byte:', readFileSync(dir+'/'+alvo.f,'utf8')===origLote && readFileSync(R+'/research/kb/GLOSSARIO-TOPICOS.json','utf8')===origGlos);
