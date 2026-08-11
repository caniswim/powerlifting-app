import {medir} from '/tmp/aud/tela.mjs';
// pergunta estreita cuja resposta e uma unica claim de regulamento
const casos=[
 ['cinto 13mm','o cinto pode ter mais de 13 mm de espessura na IPF',['F001-83','F001-84']],
 ['comando supino','quais são os três comandos do juiz no supino em competição IPF',[]],
 ['meia','na IPF a meia precisa cobrir a canela no terra',[]],
];
for(const [n,q,esp] of casos){
  const m=medir(q);
  console.log(`${n}: rotas=${m.rotas.length} [${m.rotas.join(',')}] tela=${m.tela.length}`);
  console.log('   primeiras 5:',m.tela.slice(0,5).map(x=>x.id).join(' '));
  if(esp.length) console.log('   esperados na tela:',esp.filter(i=>m.tela.some(t=>t.id===i)).join(',')||'nenhum');
}
