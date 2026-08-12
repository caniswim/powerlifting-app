#!/usr/bin/env node
/**
 * O CONTRATO DE ORDENAÇÃO, medido antes de virar trava.
 *
 * A proposta do §28.1 do RECUPERACAO.md: dada a gaveta CERTA do gabarito, os
 * ids esperados têm de cair dentro do teto da seção. É 100 % determinístico e
 * não depende de chave de API — é a parte do caminho que um compilador PODE
 * verificar depois que a escolha da gaveta sai do repositório.
 *
 * Este arquivo NÃO é a trava: é a medida que diz em quantos canários ela
 * reprovaria hoje, e em que POSIÇÃO cada id cai. Escrever a trava sem este
 * número é escrever uma trava que já se sabe verde, que é o modo de falha nº 4
 * desta casa.
 *
 * Para cada canário da porta nova e cada id esperado, força a gaveta em que o
 * id está ETIQUETADO (nunca a gaveta "parecida") e imprime a posição dele
 * dentro da seção.
 *
 *   node research/tools/auditoria-onda2f/contrato-ordenacao.mjs
 *   node research/tools/auditoria-onda2f/contrato-ordenacao.mjs --conjunto E
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarClaims, carregarTopicos } from '../kb.mjs';
import { indexar, carregarVocabulario } from '../busca.mjs';
import { responder, telaDaResposta, perfilarTopicos, termosDaPergunta } from '../roteador.mjs';
import { carregarGlossario, indexarGlossario } from '../glossario.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const doc = JSON.parse(readFileSync(join(ROOT, 'research/kb/CANARIOS.json'), 'utf8'));
const { claims, porId } = carregarClaims(join(ROOT, 'research/extract'));
const TOPICS = carregarTopicos(ROOT);
const INDICE = indexar(claims);
const VOCAB = carregarVocabulario(ROOT).entradas;
const GLOSSARIO = indexarGlossario(carregarGlossario(ROOT), termosDaPergunta);
const PERFIS = perfilarTopicos(claims);

const arg = (f) => {
  const i = process.argv.indexOf(f);
  return i >= 0 ? process.argv[i + 1] : null;
};
const FILTRO = arg('--conjunto');

/**
 * OS DOIS TETOS, e é a comparação inteira. `60` é o que a gaveta forçada
 * entrega hoje (`TETO_DA_SECAO_FORCADA`); `18` é o que o ATLETA vê numa seção
 * roteada (`tela.porSecao` do canário). Uma trava calibrada em 60 é uma trava
 * que mede um caminho que o atleta não percorre.
 */
const TETOS = [18, 60];

const alvos = (doc.canarios ?? []).filter(
  (c) => c.perguntaDoAtleta && (!FILTRO || String(c.id).startsWith(FILTRO)),
);

const linhas = [];
for (const can of alvos) {
  for (const id of can.sustenta ?? []) {
    const claim = porId.get(id);
    if (!claim) continue;
    // A gaveta em que o id está ETIQUETADO, e só ela. A gaveta "parecida"
    // mediria outra coisa.
    for (const topico of claim.topic ?? []) {
      const r = responder(claims, can.pergunta, {
        topicos: TOPICS,
        glossario: GLOSSARIO,
        vocabulario: VOCAB,
        idx: INDICE,
        perfis: PERFIS,
        forcar: [topico],
        tela: { porSecao: 400, secoes: 1, porSecaoForcada: 400 },
      });
      const tela = telaDaResposta(r).filter((x) => x.secao === topico);
      const pos = tela.findIndex((x) => x.id === id);
      linhas.push({
        canario: can.id, id, topico, pos: pos < 0 ? null : pos + 1, tamanho: tela.length,
      });
    }
  }
}

// A MELHOR gaveta por id: a posição mais alta que alguma gaveta etiquetada dá.
const melhorPorId = new Map();
for (const l of linhas) {
  if (l.pos === null) continue;
  const k = `${l.canario}|${l.id}`;
  const atual = melhorPorId.get(k);
  if (!atual || l.pos < atual.pos) melhorPorId.set(k, l);
}

const porConjunto = new Map();
for (const can of alvos) {
  const conj = (can.conjunto ?? '(sem conjunto)').split(' (')[0];
  if (!porConjunto.has(conj)) porConjunto.set(conj, []);
  porConjunto.get(conj).push(can);
}

for (const [conj, cans] of porConjunto) {
  console.log(`\n══ ${conj} — ${cans.length} canário(s)`);
  for (const teto of TETOS) {
    let idsOk = 0; let idsTot = 0; let cansOk = 0;
    for (const can of cans) {
      let todos = true;
      for (const id of can.sustenta ?? []) {
        idsTot += 1;
        const m = melhorPorId.get(`${can.id}|${id}`);
        if (m && m.pos <= teto) idsOk += 1; else todos = false;
      }
      if (todos && (can.sustenta ?? []).length > 0) cansOk += 1;
    }
    console.log(
      `   teto ${String(teto).padStart(3)}:  ${cansOk}/${cans.length} canários com TODOS os ids dentro`
      + `  ·  ${idsOk}/${idsTot} ids`,
    );
  }
  for (const can of cans) {
    const partes = (can.sustenta ?? []).map((id) => {
      const m = melhorPorId.get(`${can.id}|${id}`);
      return m ? `${id} #${m.pos}/${m.tamanho} em \`${m.topico}\`` : `${id} FORA de toda gaveta`;
    });
    const fora18 = (can.sustenta ?? []).filter((id) => {
      const m = melhorPorId.get(`${can.id}|${id}`);
      return !m || m.pos > 18;
    });
    console.log(`   ${can.id} ${fora18.length ? '✗' : '✓'}  ${partes.join(' · ')}`);
  }
}
