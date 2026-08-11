import fs from 'node:fs';
const ROOT='/Users/brunnovert/Documents/Dev/powerlifting-app';const T=ROOT+'/research/tools/';
const { carregarTopicos, carregarClaims } = await import(T+'kb.mjs');
const { indexar, carregarVocabulario } = await import(T+'busca.mjs');
const { responder, perfilarTopicos, termosDaPergunta } = await import(T+'roteador.mjs');
const { carregarGlossario, indexarGlossario } = await import(T+'glossario.mjs');
const { claims, porId } = carregarClaims(ROOT+'/research/extract');
const TOPICS=carregarTopicos(ROOT), INDICE=indexar(claims), VOCAB=carregarVocabulario(ROOT).entradas;
const GLOSSARIO=indexarGlossario(carregarGlossario(ROOT),termosDaPergunta), PERFIS=perfilarTopicos(claims);
function telaDe(r){const o=[],v=new Set();const p=c=>{if(v.has(c.id))return;v.add(c.id);o.push(c.id);};
 for(const x of r.claims)p(x.c); for(const x of r.params.lista)p(x.c); for(const x of r.vizinhos)p(x.c); return o;}
const cegos=JSON.parse(fs.readFileSync('/tmp/aud/cegos.json','utf8'));
const topicoDaResposta={B01:'dor',B02:'lesao',B03:'dor',B04:'supino',B05:'descanso-entre-series',B06:'sapato',B07:'faixa',B08:'estagnacao',B09:'condicionamento',B10:'genetica',B11:'ordem-exercicio',B12:'sapato'};
const out={};
let abriu=0, comGaveta=0;
cegos.forEach((c,i)=>{
  const id='B'+String(i+1).padStart(2,'0');
  const ids=c.esp;
  const r=responder(claims,c.q,{topicos:TOPICS,glossario:GLOSSARIO,vocabulario:VOCAB,idx:INDICE,perfis:PERFIS,teto:40});
  const rotas=r.rotas.map(x=>x.topico);
  const tela=telaDe(r).slice(0,40);
  const rec=ids.filter(x=>tela.includes(x));
  const tr=topicoDaResposta[id];
  const etiq=ids.filter(x=>(porId.get(x)?.topic??[]).includes(tr));
  const gav=rotas.filter(t=>ids.some(x=>(porId.get(x)?.topic??[]).includes(t))).sort();
  const abriuT=rotas.includes(tr);
  if(abriuT)abriu++; if(gav.length)comGaveta++;
  out[id]={id,q:c.q,ids,topicoDaResposta:tr,etiquetados:etiq,rotas:r.rotas.map(x=>x.topico+' '+x.score.toFixed(2)),
    abriuOTopico:abriuT,gavetasComResposta:gav,recuperados:rec,veredito:rec.length===ids.length&&ids.length>0?'passa':'falha',
    topicosDosIds:Object.fromEntries(ids.map(x=>[x,porId.get(x).topic]))};
});
console.log(JSON.stringify(out,null,1));
console.log('abriuOTopico',abriu,'/12  comGavetaComResposta',comGaveta,'/12');
