import { medir } from './auditoria-onda2d.mjs';
const P = 'fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?';
const CINCO = ['V079-34','V001-06','V138-19','V086-21','V027-23'];
for (const teto of [40]) {
  const m = medir(P, { teto });
  console.log('teto', teto, 'tamanhoTela', m.tamanhoTela, 'ordemToda', m.ordemToda.length);
  console.log('rotas', m.rotas.join(' '));
  console.log('vagas', JSON.stringify(m.r.vagas ?? m.r.alocado ?? null));
  for (const id of CINCO) {
    const i = m.telaIds.indexOf(id);
    const j = m.ordemToda.findIndex(x=>x.id===id);
    console.log(' ', id, 'tela', i>=0?i+1:'FORA', 'canal', j>=0?m.ordemToda[j].canal:'-', 'posToda', j>=0?j+1:'-');
  }
  console.log('TELA:', m.tela.map((x,i)=>`${i+1}.${x.id}[${x.canal}]`).join(' '));
}
