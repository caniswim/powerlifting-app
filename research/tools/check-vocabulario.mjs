#!/usr/bin/env node
/**
 * Recusa índice de vocabulário morto.
 *
 * `research/kb/VOCABULARIO.md` promete duas coisas por tópico, e as duas são
 * verificáveis contra as 6.909 claims:
 *
 *   `usa:`      — o canal fala assim. Cada termo tem de casar ao menos UMA claim
 *                 daquele tópico.
 *   `não usa:`  — o canal NÃO fala assim, e por isso a busca ingênua falhou.
 *                 Cada termo tem de casar ZERO na base inteira.
 *
 * Sem esta trava o índice seria a coisa mais perigosa do repositório: um arquivo
 * com cara de autoridade dizendo ao próximo agente qual palavra buscar, e
 * envelhecendo em silêncio a cada ingestão. Termo morto em `usa:` manda buscar
 * palavra que não existe — e confirma, com a autoridade do índice, a lacuna que
 * não existe. Termo que ressuscitou em `não usa:` transforma a nota que explica
 * a falha numa afirmação falsa sobre a base.
 *
 * Note o que esta trava NÃO é: ela não compara o índice com uma versão derivada
 * do próprio índice. Os termos são escritos à mão e conferidos contra o corpus.
 * É a diferença entre isto e a trava que se testa a si mesma — o modo de falha
 * nº 4 desta casa, que aconteceu três vezes num dia só.
 *
 * Uso:
 *   node research/tools/check-vocabulario.mjs [--extract <dir>]
 */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarClaims, carregarTopicos } from './kb.mjs';
import { carregarVocabulario, validarVocabulario } from './busca.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (f) => {
  const i = process.argv.indexOf(f);
  return i >= 0 ? process.argv[i + 1] : null;
};
const EXTRACT = arg('--extract') ?? join(ROOT, 'research/extract');

const { claims } = carregarClaims(EXTRACT);
if (claims.length === 0) {
  console.error(`✗ nenhuma claim em ${EXTRACT} — sem corpus não dá para saber se um termo está vivo`);
  process.exit(2);
}

const { arquivo, entradas } = carregarVocabulario(ROOT);
if (entradas.length === 0) {
  console.error(`✗ ${arquivo} não tem nenhuma seção "## <topico>" — o índice está vazio ou o formato mudou`);
  process.exit(2);
}

const erros = validarVocabulario(entradas, claims, carregarTopicos(ROOT));

const nUsa = entradas.reduce((a, e) => a + e.usa.length, 0);
const nNao = entradas.reduce((a, e) => a + e.naoUsa.length, 0);
console.log(
  `\nVocabulário — ${entradas.length} tópico(s) em ${arquivo.replace(`${ROOT}/`, '')}, `
  + `${nUsa} termo(s) vivos e ${nNao} termo(s) mortos declarados, recontados contra ${claims.length} claims`,
);

if (erros.length > 0) {
  console.error(`\n${erros.length} PROBLEMA(S) NO ÍNDICE:`);
  for (const e of erros) console.error(`  ✗ ${e}`);
  console.error('');
  process.exit(1);
}

console.log('\n✓ todo termo de "usa" ainda acha, e todo termo de "não usa" ainda não acha\n');
