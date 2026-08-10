#!/usr/bin/env node
/**
 * VALE A FROTA? — a medição que decide a pergunta do atleta, e não a prosa.
 *
 * A pergunta: vale pagar uma frota de modelo barato para dar a cada uma das
 * 6.912 claims uma linha de "que pergunta esta claim responde"?
 *
 * Uma linha por claim conserta UMA coisa: a ORDEM DENTRO DA GAVETA. Ela não
 * muda quais gavetas abrem nem quantas vagas cada uma leva — isso é
 * `vagasPorGaveta` em roteador.mjs, e é código determinístico.
 *
 * Logo o teste é este, e ele é decidível sem gastar um centavo: para cada
 * pergunta cega, FORCE sozinha a gaveta que contém a resposta e conte.
 *
 *   · o id chega  -> a claim já está bem ordenada dentro da gaveta dela; o que
 *                    faltou foi VAGA. A linha por claim não compra nada.
 *   · o id não chega, com a gaveta certa forçada e sozinha -> a claim está
 *                    soterrada DENTRO da gaveta certa. Aqui, e só aqui, a linha
 *                    por claim é a hipótese.
 *
 * Roda em ~20 s. `node research/tools/auditoria/vale-a-frota.mjs`
 */
import { medir, porId, claims } from './auditoria-onda2d.mjs';
import { CEGOS } from './cegos.mjs';

const tamanho = {};
for (const c of claims) for (const t of (c.topic ?? [])) tamanho[t] = (tamanho[t] ?? 0) + 1;

let idsTotais = 0;
let idsPorVaga = 0;
let completosForcando = 0;
const soterradosDentro = [];

console.log('\nFORÇANDO, UMA DE CADA VEZ, CADA GAVETA QUE ETIQUETA ALGUM ID ESPERADO\n');

for (const c of CEGOS) {
  const gavetas = new Set();
  for (const id of c.espera) for (const t of (porId.get(id)?.topic ?? [])) gavetas.add(t);

  // o melhor resultado que QUALQUER gaveta forçada sozinha alcança
  const alcancado = new Set();
  let melhor = { g: null, n: -1, tela: 0 };
  for (const g of gavetas) {
    const m = medir(c.p, { forcar: [g] });
    const achados = c.espera.filter((id) => m.telaIds.includes(id));
    for (const id of achados) alcancado.add(id);
    if (achados.length > melhor.n) melhor = { g, n: achados.length, tela: m.tamanhoTela };
  }

  idsTotais += c.espera.length;
  idsPorVaga += alcancado.size;
  if (alcancado.size === c.espera.length) completosForcando += 1;

  const faltam = c.espera.filter((id) => !alcancado.has(id));
  for (const id of faltam) soterradosDentro.push({ caso: c.id, id, gavetas: porId.get(id)?.topic ?? [] });

  console.log(
    `${c.id}  ${alcancado.size}/${c.espera.length} alcançáveis   melhor gaveta: ${melhor.g}(${tamanho[melhor.g]})`
      + (faltam.length ? `   SOTERRADOS DENTRO: ${faltam.join(' ')}` : ''),
  );
}

const gavetasDoConserto = new Set();
for (const s of soterradosDentro) for (const t of s.gavetas) gavetasDoConserto.add(t);
const universo = new Set();
for (const c of claims) if ((c.topic ?? []).some((t) => gavetasDoConserto.has(t))) universo.add(c.id);

// a compra mínima: as gavetas mais baratas que cobrem todos os ids soterrados
const cobertura = [];
for (const s of soterradosDentro) {
  const maisBarata = [...s.gavetas].sort((a, b) => (tamanho[a] ?? 0) - (tamanho[b] ?? 0))[0];
  cobertura.push(maisBarata);
}
const compraMinima = new Set(cobertura);
const claimsDaCompra = new Set();
for (const c of claims) if ((c.topic ?? []).some((t) => compraMinima.has(t))) claimsDaCompra.add(c.id);

console.log(`
O NÚMERO QUE DECIDE
  ids esperados pelas 12 perguntas cegas ......................... ${idsTotais}
  ids que chegam HOJE, sem --topic ............................... 3
  ids que chegam FORÇANDO a gaveta certa sozinha ................. ${idsPorVaga}
  perguntas COMPLETAS forçando a gaveta certa sozinha ............ ${completosForcando} de ${CEGOS.length}

  => ${idsPorVaga} de ${idsTotais} ids (${Math.round((idsPorVaga / idsTotais) * 100)} %) estão a uma VAGA de distância. Para esses, a linha
     por claim não compra nada: a claim já está no topo da gaveta dela.

  => ${idsTotais - idsPorVaga} de ${idsTotais} ids (${Math.round(((idsTotais - idsPorVaga) / idsTotais) * 100)} %) estão soterrados DENTRO da gaveta certa. Só
     esses são hipótese para a frota.`);

console.log('\n  os soterrados dentro da gaveta certa:');
for (const s of soterradosDentro) console.log(`    ${s.caso}  ${s.id}  [${s.gavetas.join(' ')}]`);

console.log(`
  TAMANHO DA COMPRA, se ela for feita:
    todas as gavetas que tocam esses ids: ${[...gavetasDoConserto].sort().join(' ')}
      = ${universo.size} claims (${((universo.size / claims.length) * 100).toFixed(1)} % da base)
    compra mínima (a gaveta mais barata que cobre cada id): ${[...compraMinima].sort().join(' ')}
      = ${claimsDaCompra.size} claims (${((claimsDaCompra.size / claims.length) * 100).toFixed(1)} % da base)
    a base inteira = ${claims.length} claims (100 %)
`);
