import { readFileSync } from 'node:fs';
const ROOT='/Users/brunnovert/Documents/Dev/powerlifting-app';
const T=ROOT+'/research/tools/';
const { carregarTopicos, carregarClaims } = await import(T+'kb.mjs');
const { indexar, carregarVocabulario } = await import(T+'busca.mjs');
const { responder, perfilarTopicos, termosDaPergunta } = await import(T+'roteador.mjs');
const { carregarGlossario, indexarGlossario } = await import(T+'glossario.mjs');
const { claims } = carregarClaims(ROOT+"/research/extract");
const TOPICS = carregarTopicos(ROOT);
const INDICE = indexar(claims);
const VOCAB = carregarVocabulario(ROOT).entradas;
const GLOSSARIO = indexarGlossario(carregarGlossario(ROOT), termosDaPergunta);
const PERFIS = perfilarTopicos(claims);
const teto = 40;
function telaDe(r){const o=[],v=new Set();const p=(c,canal)=>{if(v.has(c.id))return;v.add(c.id);o.push({id:c.id,canal});};
 for(const x of r.claims)p(x.c,'rota'); for(const x of r.params.lista)p(x.c,'param'); for(const x of r.vizinhos)p(x.c,x.canal??'viz'); return o;}
export function medir(pergunta){
  const r=responder(claims,pergunta,{topicos:TOPICS,glossario:GLOSSARIO,vocabulario:VOCAB,idx:INDICE,perfis:PERFIS,teto});
  const full=telaDe(r);
  return {rotas:r.rotas.map(x=>x.topico), tela:full.slice(0,teto), fora:full.slice(teto), candidatos:(r.candidatos||[]).map(c=>[c.topico,+c.score?.toFixed?.(2)])};
}
