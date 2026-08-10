import { medirCru } from './auditoria-onda2d.mjs';
import { CEGOS } from './cegos.mjs';
const LEG = { vagas: { estrategia: 'global' }, canais: { rota: 40, param: 12, ligacao: 0, lado: 8 } };
for (const nome of ['LEGADO(11/08)', 'ATUAL(12/08)']) {
  let algum=0, todos=0, ids=0, tot=0; const linhas=[];
  for (const c of CEGOS) {
    const m = medirCru(c.p, nome.startsWith('LEG') ? LEG : {});
    const a = c.espera.filter(i=>m.telaIds.includes(i));
    ids+=a.length; tot+=c.espera.length;
    if(a.length) algum++; if(a.length===c.espera.length) todos++;
    linhas.push(`${c.id}:${a.length}/${c.espera.length}${a.length?'('+a.join(',')+')':''}`);
  }
  console.log(`${nome}  algum=${algum}/12 todos=${todos}/12 ids=${ids}/${tot}`);
  console.log('   ', linhas.join('  '));
}
