import { medirCru } from './auditoria-onda2d.mjs';
const F='fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?';
const CINCO=['V079-34','V001-06','V138-19','V086-21','V027-23'];
for (const piso of [1,2,3,4]) {
  const m=medirCru(F,{teto:40,vagas:{piso,expoente:3,cotaAfim:0}});
  const vagas=[...(m.r.vagas??new Map()).entries()].map(([k,v])=>`${k}:${v}`).join(' ');
  console.log(`piso=${piso} tela=${m.tela.length} vagas=[${vagas}] `+CINCO.map(i=>`${i}@${(m.telaIds.indexOf(i)+1)||'FORA'}`).join(' '));
}
