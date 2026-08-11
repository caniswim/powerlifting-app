import fs from 'node:fs';
const ROOT='/Users/brunnovert/Documents/Dev/powerlifting-app';
const {carregarClaims}=await import(ROOT+'/research/tools/kb.mjs');
const {claims}=carregarClaims(ROOT+'/research/extract');
const g=JSON.parse(fs.readFileSync(ROOT+'/research/kb/GLOSSARIO-TOPICOS.json','utf8'));
const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const porTopico={};
for(const c of claims) for(const t of (c.topic||[])){(porTopico[t] ||= []).push(norm(`${c.claim||''} ${c.verbatim||''}`));}
const tops=g.topicos||g.gavetas||[];
console.log('chaves glossario:',Object.keys(g));
const linhas=[];
for(const t of tops){
  const corpus=new Set();
  for(const txt of (porTopico[t.topico]||[])) for(const w of txt.split(/[^a-z0-9]+/)) if(w.length>=4) corpus.add(w.slice(0,5));
  let ancorados=0;
  for(const e of t.entrada){
    const ws=norm(e).split(/[^a-z0-9]+/).filter(w=>w.length>=4);
    if(ws.some(w=>corpus.has(w.slice(0,5)))) ancorados++;
  }
  linhas.push([t.topico,ancorados,t.entrada.length,(ancorados/t.entrada.length)]);
}
linhas.sort((a,b)=>a[3]-b[3]);
for(const l of linhas.slice(0,20)) console.log(l[0].padEnd(28), l[1]+'/'+l[2], (l[3]*100).toFixed(0)+'%');
console.log('...');
console.log('mediana', (linhas[Math.floor(linhas.length/2)][3]*100).toFixed(0)+'%', 'n=',linhas.length);
