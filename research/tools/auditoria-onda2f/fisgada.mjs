#!/usr/bin/env node
/**
 * A FISGADA, VERIFICADA DUAS VEZES — pela CLI (o que o agente VÊ) e pelo módulo
 * (o que a trava conta). Se as duas discordarem, `telaDaResposta()` não é uma
 * definição só.
 *
 * Uso: node research/tools/auditoria-onda2f/fisgada.mjs
 */

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { carregarTopicos, carregarClaims } from '../kb.mjs';
import { indexar, carregarVocabulario } from '../busca.mjs';
import { responder, perfilarTopicos, termosDaPergunta, telaDaResposta } from '../roteador.mjs';
import { carregarGlossario, indexarGlossario } from '../glossario.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const ROOT = join(AQUI, '../../..');
const CLI = join(ROOT, 'research/tools/check-evidence.mjs');
const { claims } = carregarClaims(join(ROOT, 'research/extract'));
const TOPICOS = carregarTopicos(ROOT);
const VOCAB = carregarVocabulario(ROOT).entradas;
const GLOSSARIO = indexarGlossario(carregarGlossario(ROOT), termosDaPergunta);
const IDX = indexar(claims);
const PERFIS = perfilarTopicos(claims);

const CINCO = ['V079-34', 'V001-06', 'V138-19', 'V086-21', 'V027-23'];
const CASOS = [
  ['COM JARGÃO', 'fisgada de 3/10 no peitoral na terceira série de supino pausado, continuo?'],
  ['SEM JARGÃO', 'senti uma pontada nível 3 de 10 no peito na 3ª série do supino com pausa, sigo o treino'],
];

for (const [nome, q] of CASOS) {
  const r = responder(claims, q, {
    topicos: TOPICOS, glossario: GLOSSARIO, vocabulario: VOCAB, idx: IDX, perfis: PERFIS,
  });
  const linhas = telaDaResposta(r);
  const out = execFileSync('node', [CLI, '--pergunta', q], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const corpo = out.split('\n').filter((l) => !l.trim().startsWith('node ')).join('\n');

  console.log(`\n═══ ${nome} ═══`);
  console.log(`  ${q}`);
  console.log(`  cmd: node research/tools/check-evidence.mjs --pergunta ${JSON.stringify(q)}`);
  console.log(`  gavetas: ${r.rotas.map((x) => `${x.topico}(${x.score.toFixed(2)})`).join(' · ')}`);
  console.log(`  saída da CLI: ${(Buffer.byteLength(out, 'utf8') / 1024).toFixed(1)} kB · ${r.tela.length} linhas em ${r.secoes.length} seções`);
  let naCli = 0;
  let naTela = 0;
  for (const id of CINCO) {
    const x = linhas.find((l) => l.id === id);
    const impressa = new RegExp(`\\b${id}\\b`).test(corpo);
    if (impressa) naCli += 1;
    if (x) naTela += 1;
    const canal = x ? `${x.secao}#${x.posicaoNaSecao} (${x.canal})` : 'FORA DA TELA';
    console.log(`    ${id}  ${canal}${impressa === Boolean(x) ? '' : '   ⚠ CLI e módulo DISCORDAM'}${impressa ? '' : '  [não impressa]'}`);
  }
  console.log(`  na tela do módulo: ${naTela}/5 · impressas pela CLI: ${naCli}/5`);
}
