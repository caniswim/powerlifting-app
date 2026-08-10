import { medirCru } from './auditoria-onda2d.mjs';
const CASOS = [
  ['P06', ['F001-95','F001-96'], 'minha munhequeira pode ser de qualquer tamanho na competição', 'tem limite de tamanho pra faixa de punho no campeonato'],
  ['P07', ['G021-15','V104-28','V104-29'], 'preciso comprar tênis de agachamento com salto ou meu all star serve', 'vale investir num sapato de salto pra agachar ou o tenis liso resolve'],
  ['P09', ['G013-31','G014-27','G008-25','G008-26'], 'travei no supino, não sobe mais, o que eu faço com a carga', 'meu supino empacou e nao progride mais, mexo no peso como'],
  ['P16', ['V013-04','V013-05','V013-06'], 'levantar peso já conta como exercício pro coração', 'treino de forca serve como condicionamento cardiovascular'],
  ['C02', ['F001-34','F001-35','F001-38','F001-39'], 'Qual é a sequência exata de comandos do supino na IPF, e o que anula a tentativa antes mesmo de eu empurrar?', 'quais sao as ordens que o arbitro da no supino da IPF e o que ja invalida a tentativa antes de eu empurrar'],
  ['C03', ['G001-11','G001-13','G001-24','G001-60'], 'Num bloco de capacidade de trabalho, em que RPE e em que percentual eu deixo o levantamento principal?', 'na fase de acumulo de trabalho, com que RPE e que porcentagem eu deixo o movimento principal'],
  ['C05', ['G004-43','G004-27','G004-29'], 'Estou acumulando fadiga. Que formas de deload existem e como sei que é hora?', 'a fadiga esta se acumulando, que tipos de semana leve existem e como sei que chegou a hora'],
  ['P13', ['V119-20','V119-29','V170-42'], 'meu supino para no meio do caminho e não sobe mais', 'meu supino trava na metade da subida e nao passa dali'],
  ['P08', ['V042-02','V042-04','G040-24','G049-08'], 'minha mão está descascando no terra, uso alguma coisa pra segurar a barra', 'minha palma esta calejando e rasgando no levantamento terra, uso algo pra segurar a barra'],
  ['D08', ['G027-39','G027-41','G029-20'], 'no agacho eu subo com o quadril na frente e o tronco cai pra frente, mexer em onde a barra fica apoiada resolve', 'no agachamento meu quadril dispara pra cima e o peito cai, mudar a posicao da barra nas costas ajuda'],
  ['D05', ['V088-01','V088-16','V088-21'], 'eu puxo de pernas abertas, preciso treinar do jeito tradicional tambem e quanto disso', 'eu levanto terra sumo, tenho que treinar convencional tambem e em que dose'],
  ['FISG', ['V079-34','V001-06','V138-19','V086-21','V027-23'], 'fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?', 'senti uma pontada nivel 3 de 10 no peito na 3a serie do supino com pausa, sigo o treino'],
];
let origAlgum=0, origTodos=0, parAlgum=0, parTodos=0;
for (const [id, ids, orig, par] of CASOS) {
  const a = medirCru(orig,{teto:40}), b = medirCru(par,{teto:40});
  const ao = ids.filter(i=>a.telaIds.includes(i)), ap = ids.filter(i=>b.telaIds.includes(i));
  if(ao.length) origAlgum++; if(ao.length===ids.length) origTodos++;
  if(ap.length) parAlgum++; if(ap.length===ids.length) parTodos++;
  console.log(`${id.padEnd(5)} orig ${ao.length}/${ids.length}  ->  parafrase ${ap.length}/${ids.length}   ${ao.length&&!ap.length?'*** PERDEU TUDO ***':''}`);
  console.log(`      orig: ${ids.map(i=>i+'@'+((a.telaIds.indexOf(i)+1)||'—')).join(' ')}`);
  console.log(`      para: ${ids.map(i=>i+'@'+((b.telaIds.indexOf(i)+1)||'—')).join(' ')}  rotas=[${b.rotas.join(' ')}]`);
}
console.log(`\nORIGINAL   algum ${origAlgum}/${CASOS.length}  todos ${origTodos}/${CASOS.length}`);
console.log(`PARAFRASE  algum ${parAlgum}/${CASOS.length}  todos ${parTodos}/${CASOS.length}`);
