import { medir, porId } from './auditoria-onda2d.mjs';
import { CEGOS } from './cegos.mjs';

for (const c of CEGOS) {
  const base = medir(c.p);
  const achadosBase = c.espera.filter((id) => base.telaIds.includes(id));
  // gavetas reais onde cada id esperado mora
  const gavetasReais = new Set();
  for (const id of c.espera) for (const t of (porId.get(id)?.topic ?? [])) gavetasReais.add(t);
  // forçar cada gaveta declarada, uma a uma, e todas juntas
  const forcadas = {};
  for (const g of c.gavetas) {
    const m = medir(c.p, { forcar: [g] });
    forcadas[g] = c.espera.filter((id) => m.telaIds.includes(id));
  }
  const todas = medir(c.p, { forcar: c.gavetas });
  const achTodas = c.espera.filter((id) => todas.telaIds.includes(id));
  console.log(`\n${c.id} tela=${base.tamanhoTela} rotas=[${base.rotas.join(' ')}]`);
  console.log(`   espera=${c.espera.join(' ')}  gavetasReais=[${[...gavetasReais].join(' ')}]`);
  console.log(`   SEM forcar: ${achadosBase.join(' ')||'NADA'}`);
  for (const g of c.gavetas) console.log(`   --topic ${g}${base.rotas.includes(g)?' (JA ABRIU)':' (nao abriu)'}: ${forcadas[g].join(' ')||'NADA'}`);
  console.log(`   forcando as ${c.gavetas.length}: ${achTodas.join(' ')||'NADA'}`);
}
