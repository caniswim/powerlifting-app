import { medirCru } from './auditoria-onda2d.mjs';
import { readFileSync } from 'node:fs';
const R=JSON.parse(readFileSync('/Users/brunnovert/Documents/Dev/powerlifting-app/research/kb/ROTAS.json','utf8'));
const C=JSON.parse(readFileSync('/Users/brunnovert/Documents/Dev/powerlifting-app/research/kb/CANARIOS.json','utf8'));
const t14=R.casos.find(c=>c.id==='T14');
const b11=C.canarios.find(c=>c.id==='B11');
function show(nome,p,ids,opts){
  const m=medirCru(p,opts);
  console.log(`\n${nome}  opts=${JSON.stringify(opts)}`);
  console.log('  pergunta:',p);
  console.log('  tela =',m.tela.length,'| rotas =',m.rotas.join(' '));
  console.log('  vagas =',JSON.stringify(m.r.vagas));
  console.log('  '+ids.map(i=>`${i}@${(m.telaIds.indexOf(i)+1)||'FORA'}`).join('  '));
}
show('CINTO T14 como o ROTAS.json manda (forca cinto, teto 60)', t14.pergunta, t14.sustenta, {forcar:['cinto'], teto:t14.tetoDeTela??R.tetoDeTela});
show('CINTO T14 SEM --topic, teto 60', t14.pergunta, t14.sustenta, {teto:60});
show('CINTO T14 SEM --topic, teto 40', t14.pergunta, t14.sustenta, {teto:40});
show('CINTO C01 (frase do CANARIOS) SEM --topic, teto 40', 'Vou comprar cinto para competir na IPF. Que dimensões o regulamento permite?', ['F001-83','F001-84'], {teto:40});
console.log('\nB11 pergunta:', b11.pergunta, '| sustenta', (b11.sustenta||[]).join(' '));
show('ORDEM B11 SEM --topic, teto 40', b11.pergunta, b11.sustenta, {teto:40});
