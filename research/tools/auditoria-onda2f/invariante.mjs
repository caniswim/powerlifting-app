#!/usr/bin/env node
/**
 * ATAQUE À INVARIANTE DE NÃO-DILUIÇÃO — com o MEU teste, não com o dele.
 *
 * `secoes.test.mjs` varia `tela.secoes` de 1 a 6 e compara as seções. Mas
 * `responder()` passa para `rotear()` sempre `max = MAX_TOPICOS`, NUNCA
 * `tela.secoes` — então variar `tela.secoes` só corta um prefixo de uma lista
 * de rotas que é literalmente a mesma nas seis execuções. O teste dele cobra
 * `lista.slice(0,n) ⊂ lista.slice(0,n+1)`, que é verdade sobre qualquer lista.
 *
 * Aqui o experimento HONESTO de "N gavetas contra N+1 gavetas": varia o `max`
 * do ROTEAMENTO, que é a constante que de fato decide quantas gavetas abrem
 * (`MAX_TOPICOS`). É onde o acoplamento pode existir, porque `rotear()` usa
 * `max` DENTRO do passe de aviso (`roteados = ….slice(0, max)`) para decidir
 * quem recebe o bônus de `naoConfundirCom`.
 *
 * Três ataques:
 *   A. `max` do roteamento: rotas(n) é prefixo de rotas(n+1)?
 *   B. `max` do roteamento: a seção da gaveta X tem os mesmos ids em n e n+1?
 *   C. `forcar`: a seção de A muda quando B é forçada junto?
 *
 * Uso: node research/tools/auditoria-onda2f/invariante.mjs
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarTopicos, carregarClaims } from '../kb.mjs';
import { indexar, carregarVocabulario } from '../busca.mjs';
import { responder, perfilarTopicos, termosDaPergunta, telaDaResposta } from '../roteador.mjs';
import { carregarGlossario, indexarGlossario } from '../glossario.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const ROOT = join(AQUI, '../../..');
const { claims } = carregarClaims(join(ROOT, 'research/extract'));
const TOPICOS = carregarTopicos(ROOT);
const VOCAB = carregarVocabulario(ROOT).entradas;
const GLOSSARIO = indexarGlossario(carregarGlossario(ROOT), termosDaPergunta);
const IDX = indexar(claims);
const PERFIS = perfilarTopicos(claims);

const perguntar = (texto, extra = {}) => responder(claims, texto, {
  topicos: TOPICOS, glossario: GLOSSARIO, vocabulario: VOCAB, idx: IDX, perfis: PERFIS, ...extra,
});

const cans = JSON.parse(readFileSync(join(ROOT, 'research/kb/CANARIOS.json'), 'utf8'));
const rotasDoc = JSON.parse(readFileSync(join(ROOT, 'research/kb/ROTAS.json'), 'utf8'));
const cegos = JSON.parse(readFileSync(join(AQUI, 'cegos.json'), 'utf8'));
const PERGUNTAS = [
  ...(cans.canarios ?? []).map((c) => c.pergunta),
  ...(rotasDoc.casos ?? []).map((c) => c.pergunta),
  ...(rotasDoc.calibracao?.dentro ?? []),
  ...cegos.map((c) => c.q),
  'fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?',
].filter((p) => String(p ?? '').trim());

const idsDaSecao = (s) => [
  ...s.principais.map((x) => x.c.id),
  ...s.ligacoes.map((v) => v.c.id),
  ...s.lado.map((v) => v.c.id),
];

console.log(`\n${PERGUNTAS.length} perguntas\n`);

// ── A. o prefixo de rotas sob o `max` do ROTEAMENTO ──────────────────────────
let violaPrefixo = 0;
const exemplosPrefixo = [];
for (const p of PERGUNTAS) {
  const rotas = [];
  for (let n = 1; n <= 6; n += 1) rotas.push(perguntar(p, { max: n }).rotas.map((r) => r.topico));
  for (let n = 0; n < 5; n += 1) {
    const menor = rotas[n];
    const maior = rotas[n + 1];
    const ehPrefixo = menor.every((t, i) => maior[i] === t);
    if (!ehPrefixo) {
      violaPrefixo += 1;
      if (exemplosPrefixo.length < 8) {
        exemplosPrefixo.push(`  max=${n + 1} → [${menor.join(', ')}]\n  max=${n + 2} → [${maior.join(', ')}]\n    ${p}`);
      }
    }
  }
}
console.log(`A. rotas(n) é prefixo de rotas(n+1) variando o max do ROTEAMENTO: ${violaPrefixo} violação(ões)`);
for (const e of exemplosPrefixo) console.log(e);

// ── B. os ids da seção de X sobrevivem a abrir mais uma gaveta ───────────────
let violaSecao = 0;
let comparacoes = 0;
const exemplosSecao = [];
for (const p of PERGUNTAS) {
  const saidas = [];
  for (let n = 1; n <= 6; n += 1) saidas.push(perguntar(p, { max: n }));
  for (let n = 0; n < 5; n += 1) {
    const a = new Map(saidas[n].secoes.map((s) => [s.chave, idsDaSecao(s)]));
    const b = new Map(saidas[n + 1].secoes.map((s) => [s.chave, idsDaSecao(s)]));
    for (const [chave, ids] of a) {
      comparacoes += 1;
      const depois = b.get(chave);
      if (!depois) {
        violaSecao += 1;
        if (exemplosSecao.length < 10) exemplosSecao.push(`  SEÇÃO SUMIU  \`${chave}\`  max ${n + 1}→${n + 2}   ${p}`);
        continue;
      }
      const perdidos = ids.filter((id) => !depois.includes(id));
      if (perdidos.length > 0) {
        violaSecao += 1;
        if (exemplosSecao.length < 10) exemplosSecao.push(`  IDS SUMIRAM  \`${chave}\`  max ${n + 1}→${n + 2}  ${perdidos.join(', ')}   ${p}`);
      }
    }
  }
}
console.log(`\nB. ids por seção sob o max do ROTEAMENTO: ${violaSecao} violação(ões) em ${comparacoes} comparações`);
for (const e of exemplosSecao) console.log(e);

// ── C. `forcar` uma gaveta a mais muda a seção da primeira? ──────────────────
let violaForcar = 0;
let compForcar = 0;
const exemplosForcar = [];
const PARES = [
  ['dor', 'lesao'], ['cinto', 'supino'], ['pegada', 'agacho'], ['equipamento', 'terra'],
  ['sono', 'recuperacao'], ['antropometria', 'agacho'], ['carga-de-treino', 'volume'],
  ['setup', 'supino'], ['strap', 'terra'], ['convencional', 'sumo'],
];
for (const p of PERGUNTAS.slice(0, 40)) {
  for (const [a, b] of PARES) {
    const so = perguntar(p, { forcar: [a] });
    const com = perguntar(p, { forcar: [a, b] });
    const sa = so.secoes.find((s) => s.chave === a);
    const ca = com.secoes.find((s) => s.chave === a);
    if (!sa || !ca) continue;
    compForcar += 1;
    const perdidos = idsDaSecao(sa).filter((id) => !idsDaSecao(ca).includes(id));
    if (perdidos.length > 0) {
      violaForcar += 1;
      if (exemplosForcar.length < 10) exemplosForcar.push(`  \`${a}\` perdeu ${perdidos.join(', ')} ao forçar \`${b}\` junto — ${p}`);
    }
  }
}
console.log(`\nC. forçar uma gaveta a mais: ${violaForcar} violação(ões) em ${compForcar} comparações`);
for (const e of exemplosForcar) console.log(e);

// ── D. a mesma gaveta, ROTEADA contra FORÇADA ───────────────────────────────
//
// Não é a invariante declarada, mas é o que um leitor entende por "a gaveta X".
// `--topic X` desliga as afins E muda o teto — logo a seção `X` roteada e a
// seção `X` forçada são dois conjuntos diferentes, e o segundo pode NÃO conter
// o primeiro.
let assimetria = 0;
const exemplosAssim = [];
for (const c of cegos) {
  const roteada = perguntar(c.q);
  for (const g of c.gaveta) {
    const sr = roteada.secoes.find((s) => s.chave === g);
    if (!sr) continue;
    const forcada = perguntar(c.q, { forcar: [g] });
    const sf = forcada.secoes.find((s) => s.chave === g);
    const perdidos = idsDaSecao(sr).filter((id) => !idsDaSecao(sf).includes(id));
    if (perdidos.length > 0) {
      assimetria += 1;
      exemplosAssim.push(`  ${c.id}  \`${g}\` roteada tem ${perdidos.length} id(s) que a FORÇADA (60 vagas) não tem: ${perdidos.slice(0, 6).join(', ')}`);
    }
  }
}
console.log(`\nD. gaveta roteada ⊄ gaveta forçada: ${assimetria} caso(s)`);
for (const e of exemplosAssim) console.log(e);

// ── E. A FORMULAÇÃO MAIS HONESTA DE "ACRESCENTAR GAVETA" ────────────────────
//
// `FRACAO_DO_MELHOR` é o corte que decide QUANTAS gavetas abrem: baixá-la abre
// MAIS gavetas sem mexer em mais nada. Se a invariante fosse o que o banner da
// CLI diz — "acrescentar gaveta só ACRESCENTA bloco" —, baixar a fração nunca
// poderia tirar um id de uma seção que já existia.
{
  const FRACOES = [0.8, 0.6, 0.4, 0.3, 0.2];
  let viola = 0;
  let comp = 0;
  const exemplos = [];
  for (const p of PERGUNTAS) {
    const saidas = FRACOES.map((f) => perguntar(p, { fracao: f }));
    for (let i = 0; i < FRACOES.length - 1; i += 1) {
      const a = new Map(saidas[i].secoes.map((s) => [s.chave, idsDaSecao(s)]));
      const b = new Map(saidas[i + 1].secoes.map((s) => [s.chave, idsDaSecao(s)]));
      for (const [chave, ids] of a) {
        comp += 1;
        const depois = b.get(chave) ?? [];
        const perdidos = ids.filter((id) => !depois.includes(id));
        if (perdidos.length > 0) {
          viola += 1;
          if (exemplos.length < 10) {
            exemplos.push(`  fracao ${FRACOES[i]}→${FRACOES[i + 1]} (mais gavetas): \`${chave}\` perdeu ${perdidos.length} id(s)`
              + `${b.has(chave) ? '' : ' — A SEÇÃO INTEIRA SUMIU'}: ${perdidos.slice(0, 5).join(', ')}\n      ${p}`);
          }
        }
      }
    }
  }
  console.log(`\nE. baixar FRACAO_DO_MELHOR (abrir MAIS gavetas): ${viola} violação(ões) em ${comp} comparações`);
  for (const e of exemplos) console.log(e);
}
