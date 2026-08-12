#!/usr/bin/env node
/**
 * O QUE `--topic` PERDEU AO DESLIGAR AS AFINS.
 *
 * `montarSecaoDeGaveta` recebe `afins: 0` quando a gaveta foi forçada. Duas
 * consequências, e nenhuma das duas está medida no `check:kb`:
 *   1. a claim que só chega por AFINIDADE deixa de existir no escape manual;
 *   2. a raridade é recontada DENTRO do conjunto, então tirar as afins reordena
 *      as DECLARADAS — o mesmo id muda de posição sem que nada nele mude.
 *
 * Uso: node research/tools/auditoria-onda2f/afins-forcada.mjs
 */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarTopicos, carregarClaims } from '../kb.mjs';
import { indexar, carregarVocabulario } from '../busca.mjs';
import { perfilarTopicos, conjuntoDoTopico, ordenarNoTopico } from '../roteador.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const ROOT = join(AQUI, '../../..');
const { claims } = carregarClaims(join(ROOT, 'research/extract'));
carregarTopicos(ROOT); carregarVocabulario(ROOT);
const IDX = indexar(claims);
const PERFIS = perfilarTopicos(claims);

const CASOS = [
  ['E05', 'equipamento', 'o que eu tenho que vestir da metade da perna pra baixo pra puxar valendo', 'F001-79'],
  ['E12', 'lesao', 'meu ombro fica moido toda vez que supino pesado, posso fazer o programa inteiro numa versao que nao machuca', 'V127-13'],
  ['E10', 'equipamento', 'posso passar esparadrapo no dedao pra segurar melhor a barra no terra', 'F001-100'],
];
console.log('\nposição do id na fila da gaveta — SEM afins (o que --topic faz hoje) × COM afins (o que ele fazia)\n');
for (const [caso, topico, q, id] of CASOS) {
  const sem = ordenarNoTopico(IDX, conjuntoDoTopico(claims, PERFIS, topico, { afins: 0 }), q, { teto: 5000 });
  const com = ordenarNoTopico(IDX, conjuntoDoTopico(claims, PERFIS, topico, { afins: 60 }), q, { teto: 5000 });
  const p1 = sem.findIndex((x) => x.c.id === id) + 1;
  const p2 = com.findIndex((x) => x.c.id === id) + 1;
  console.log(`  ${caso}  \`${topico}\`  ${id}   sem afins: ${p1 || 'FORA'}   com afins: ${p2 || 'FORA'}   (a seção forçada leva 60)`);
}
