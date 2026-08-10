import { medirCru } from './auditoria-onda2d.mjs';
const Q = [
 'o cinto pode ter mais de 13 mm de espessura na IPF',
 'a munhequeira pode ter mais de 1 metro de comprimento na IPF',
 'com quanta antecedência eu tenho que escolher a categoria de peso',
 'qual a largura maxima da pegada no supino na IPF',
 'quantos arbitros julgam cada tentativa na IPF',
 'quantas tentativas eu tenho em cada movimento',
 'qual a altura maxima do salto do sapato de agacho na IPF',
 'o macacao de competicao pode ter costura reforcada',
 'quanto tempo de descanso entre as series de agacho pesado',
 'quantos gramas de proteina por quilo por dia',
];
let poucas=0;
for (const q of Q) { const m=medirCru(q,{teto:40}); if(m.tela.length<35) poucas++; console.log(String(m.tela.length).padStart(3),'|',q,'|',m.rotas.join(' ')||'(NAO SEI)'); }
console.log(`\n${poucas}/${Q.length} devolvem menos de 35 linhas`);
