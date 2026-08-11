import fs from 'node:fs';
const ROOT='/Users/brunnovert/Documents/Dev/powerlifting-app';const T=ROOT+'/research/tools/';
const { carregarTopicos, carregarClaims } = await import(T+'kb.mjs');
const { indexar, carregarVocabulario } = await import(T+'busca.mjs');
const { responder, perfilarTopicos, termosDaPergunta } = await import(T+'roteador.mjs');
const { carregarGlossario, indexarGlossario } = await import(T+'glossario.mjs');
const { claims } = carregarClaims(ROOT+'/research/extract');
const TOPICS=carregarTopicos(ROOT), INDICE=indexar(claims), VOCAB=carregarVocabulario(ROOT).entradas;
const GLOSSARIO=indexarGlossario(carregarGlossario(ROOT),termosDaPergunta), PERFIS=perfilarTopicos(claims);
const cegos=JSON.parse(fs.readFileSync('/tmp/aud/cegos.json','utf8'));
for(const c of cegos){
  const r=responder(claims,c.q,{topicos:TOPICS,glossario:GLOSSARIO,vocabulario:VOCAB,idx:INDICE,perfis:PERFIS,teto:40});
  console.log(c.id, r.rotas.map(x=>`${x.topico} ${x.score.toFixed(2)}`).join(' / '));
}
