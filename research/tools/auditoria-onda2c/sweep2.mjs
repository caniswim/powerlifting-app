// Muta a lista `entrada` de CADA um dos 74 topicos para 10 strings sem sentido,
// no arquivo REAL, e roda check-glossario.mjs. Restaura sempre.
import {readFileSync,writeFileSync,copyFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const P='/Users/brunnovert/Documents/Dev/powerlifting-app/research/kb/GLOSSARIO-TOPICOS.json';
const BAK='/tmp/aud/GLOS.bak.json';
copyFileSync(P,BAK);
const orig=readFileSync(BAK,'utf8');
const lixo=['zzqa','zzqb','zzqc','zzqd','zzqe','zzqf','zzqg','zzqh','zzqi','zzqj'];
const verdes=[];
try{
  const base=JSON.parse(orig);
  for(const t of base.topicos){
    const d=JSON.parse(orig);
    const alvo=d.topicos.find(x=>x.topico===t.topico);
    alvo.entrada=[...lixo];
    writeFileSync(P,JSON.stringify(d,null,2)+'\n');
    let verde=true;
    try{ execFileSync('node',['research/tools/check-glossario.mjs'],{cwd:'/Users/brunnovert/Documents/Dev/powerlifting-app',stdio:'pipe'}); }
    catch{ verde=false; }
    if(verde) verdes.push(t.topico);
  }
}finally{ writeFileSync(P,orig); }
console.log('topicos que ficam VERDES com a entrada trocada por lixo:',verdes.length,verdes.join(', ')||'(nenhum)');
console.log('arquivo restaurado byte a byte:', readFileSync(P,'utf8')===orig);
