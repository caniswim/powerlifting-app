#!/usr/bin/env node
/**
 * O QUE `--topic` DE FATO EXECUTA, impresso ANTES de qualquer conclusão.
 *
 * Foi um erro de parsing que produziu o achado inteiro que não existia na onda
 * 2D. Aqui a checagem é direta: dois comandos que um leitor esperaria serem
 * diferentes rendem a MESMA saída byte a byte?
 *
 * E o segundo caso é a regressão do escape: `--topic <gaveta certa>` era o
 * caminho de salvação documentado, e ele deixou de entregar em E05 e E12.
 *
 * Uso: node research/tools/auditoria-onda2f/topic-parse.mjs
 */

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarTopicos, carregarClaims } from '../kb.mjs';
import { indexar, carregarVocabulario } from '../busca.mjs';
import {
  perfilarTopicos, termosDaPergunta, conjuntoDoTopico, ordenarNoTopico,
} from '../roteador.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const ROOT = join(AQUI, '../../..');
const CLI = join(ROOT, 'research/tools/check-evidence.mjs');

const rodar = (args) => execFileSync('node', [CLI, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const sha = (s) => createHash('sha1').update(s).digest('hex').slice(0, 12);

const D05 = 'eu puxo de pernas abertas, preciso treinar do jeito tradicional tambem e quanto disso';
const a = rodar(['--pergunta', D05, '--topic', 'convencional']);
const b = rodar(['--pergunta', D05, '--topic', 'convencional', 'sumo', 'terra']);
console.log('\n1. `--topic` lê UM valor — a conferência, não a lembrança\n');
console.log(`  --topic convencional            sha ${sha(a)}  ${(Buffer.byteLength(a) / 1024).toFixed(1)} kB`);
console.log(`  --topic convencional sumo terra sha ${sha(b)}  ${(Buffer.byteLength(b) / 1024).toFixed(1)} kB`);
console.log(`  ${a === b ? 'IDÊNTICOS — `sumo` e `terra` foram descartados em silêncio (a dívida nº 5 segue aberta)' : 'DIFERENTES'}`);
const secoesA = [...a.matchAll(/GAVETA `([a-z0-9-]+)`/g)].map((m) => m[1]);
console.log(`  seções do 1º: ${secoesA.join(', ')}`);

// ── 2. A REGRESSÃO DO ESCAPE ────────────────────────────────────────────────
const { claims } = carregarClaims(join(ROOT, 'research/extract'));
const TOPICOS = carregarTopicos(ROOT);
carregarVocabulario(ROOT);
const IDX = indexar(claims);
const PERFIS = perfilarTopicos(claims);

console.log('\n2. Onde o id esperado cai na ORDENAÇÃO da própria gaveta forçada\n');
const CASOS = [
  ['E05', 'equipamento', 'o que eu tenho que vestir da metade da perna pra baixo pra puxar valendo', 'F001-79'],
  ['E12', 'lesao', 'meu ombro fica moido toda vez que supino pesado, posso fazer o programa inteiro numa versao que nao machuca', 'V127-13'],
  ['E12', 'lesao', 'meu ombro fica moido toda vez que supino pesado, posso fazer o programa inteiro numa versao que nao machuca', 'V127-15'],
  ['D05', 'convencional', D05, 'V088-01'],
];
for (const [caso, topico, q, id] of CASOS) {
  const so = conjuntoDoTopico(claims, PERFIS, topico, { afins: 0 });
  const fila = ordenarNoTopico(IDX, so, q, { teto: 5000 });
  const pos = fila.findIndex((x) => x.c.id === id) + 1;
  const declarado = so.declarado.has(id);
  console.log(`  ${caso}  \`${topico}\` tem ${so.declarado.size} declaradas · ${id} ${declarado ? 'É declarada' : 'NÃO é declarada'}`
    + ` · posição ${pos || '(fora da fila)'} de ${fila.length}  → a seção forçada leva 60`);
}
