import fs from 'node:fs';
const ROOT='/Users/brunnovert/Documents/Dev/powerlifting-app';const T=ROOT+'/research/tools/';
const { carregarTopicos, carregarClaims } = await import(T+'kb.mjs');
const { indexar, carregarVocabulario } = await import(T+'busca.mjs');
const { responder, perfilarTopicos, termosDaPergunta } = await import(T+'roteador.mjs');
const { carregarGlossario, indexarGlossario } = await import(T+'glossario.mjs');
const { claims, porId } = carregarClaims(ROOT+'/research/extract');
const TOPICS=carregarTopicos(ROOT), INDICE=indexar(claims), VOCAB=carregarVocabulario(ROOT).entradas;
const GLOSSARIO=indexarGlossario(carregarGlossario(ROOT),termosDaPergunta), PERFIS=perfilarTopicos(claims);
const tam={}; for(const c of claims) for(const t of (c.topic||[])) tam[t]=(tam[t]||0)+1;
const cegos=JSON.parse(fs.readFileSync('/tmp/aud/cegos.json','utf8'));
const casos=[...cegos.map(c=>[c.id,c.q,c.esp]),['FISGADA','fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?',['V079-34','V001-06','V138-19','V086-21','V027-23']]];
for(const [id,q,esp] of casos){
  const r=responder(claims,q,{topicos:TOPICS,glossario:GLOSSARIO,vocabulario:VOCAB,idx:INDICE,perfis:PERFIS,teto:40});
  const conta={}; for(const x of r.claims){ for(const t of r.rotas.map(y=>y.topico)) if((x.c.topic||[]).includes(t)) {conta[t]=(conta[t]||0)+1;} }
  const rot=r.rotas.map(y=>y.topico);
  // qual gaveta certa abriu, e quantas vagas ela levou vs a maior
  const linha=rot.map(t=>`${t}(${tam[t]}):${conta[t]||0}`).join('  ');
  console.log(`${id}  ${linha}`);
}
