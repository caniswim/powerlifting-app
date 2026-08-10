import { medirCru, porId } from './auditoria-onda2d.mjs';
const ESTREITAS = [
  'o cinto pode ter mais de 13 mm de espessura na IPF',
  'a munhequeira pode ter mais de 1 metro de comprimento na IPF',
  'com quanta antecedência eu tenho que escolher a categoria de peso',
  'quantos minutos tenho para entrar na plataforma depois de chamado',
  'qual a largura maxima da pegada no supino na IPF',
];
const FORA = [
  'qual a melhor receita de lasanha a bolonhesa',
  'como faco para trocar o oleo do carro',
  'quem ganhou a copa do mundo de 1994',
  'qual a capital da mongolia',
];
console.log('== ESTREITAS (resposta unica) ==');
for (const q of ESTREITAS) { const m=medirCru(q,{teto:40}); console.log(String(m.tela.length).padStart(3), '|', m.rotas.join(' ')||'(nenhuma)', '|', q); }
console.log('\n== FORA DE DOMINIO ==');
for (const q of FORA) { const m=medirCru(q,{teto:40}); console.log(String(m.tela.length).padStart(3), '|', m.rotas.join(' ')||'(NAO SEI - nenhuma gaveta)', '|', q); }
console.log('\n== TOPO DA FISGADA (1-14) ==');
const f=medirCru('fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?',{teto:40});
f.tela.slice(0,14).forEach((x,i)=>{const c=porId.get(x.id);console.log(String(i+1).padStart(3),x.id,'['+x.canal+']','topics='+(c.topic||[]).join(','),'::',String(c.claim).slice(0,95));});
