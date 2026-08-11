import fs from 'node:fs';
const ROOT='/Users/brunnovert/Documents/Dev/powerlifting-app';const T=ROOT+'/research/tools/';
const { carregarTopicos, carregarClaims } = await import(T+'kb.mjs');
const { indexar, carregarVocabulario } = await import(T+'busca.mjs');
const { responder, perfilarTopicos, termosDaPergunta } = await import(T+'roteador.mjs');
const { carregarGlossario, indexarGlossario } = await import(T+'glossario.mjs');
const { claims, porId } = carregarClaims(ROOT+'/research/extract');
const TOPICS=carregarTopicos(ROOT), INDICE=indexar(claims), VOCAB=carregarVocabulario(ROOT).entradas;
const GLOSSARIO=indexarGlossario(carregarGlossario(ROOT),termosDaPergunta), PERFIS=perfilarTopicos(claims);
const cegos=JSON.parse(fs.readFileSync('/tmp/aud/cegos.json','utf8'));
let avisou=0;
for(const c of cegos){
  const r=responder(claims,c.q,{topicos:TOPICS,glossario:GLOSSARIO,vocabulario:VOCAB,idx:INDICE,perfis:PERFIS,teto:40});
  const rot=new Set(r.rotas.map(x=>x.topico));
  const donos=new Set(); for(const i of c.esp) for(const t of (porId.get(i)?.topic||[])) donos.add(t);
  const cand=(r.candidatos||[]).filter(x=>!rot.has(x.topico));
  const nomeadas=cand.map(x=>x.topico);
  const util=nomeadas.filter(t=>donos.has(t));
  const abriuDono=[...rot].filter(t=>donos.has(t));
  if(util.length)avisou++;
  console.log(`${c.id} abriuGavetaDona=[${abriuDono.join(',')||'-'}] avisadas=[${nomeadas.join(',')||'-'}] AVISO-UTIL=[${util.join(',')||'NAO'}]`);
}
console.log(`\nO painel nomeia uma gaveta que contem a resposta em ${avisou}/12`);
