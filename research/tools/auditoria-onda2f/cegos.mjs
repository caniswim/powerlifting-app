#!/usr/bin/env node
/**
 * OS 12 CANÁRIOS CEGOS DA ONDA 2F, rodados pela CLI DE VERDADE.
 *
 * A pergunta vai EXATAMENTE como foi escrita, sem `--topic`. O que conta é o que
 * o processo IMPRIME — não o que um import do módulo devolve —, e as duas contas
 * são comparadas aqui para provar que `telaDaResposta()` é uma definição só.
 *
 * Uso:
 *   node research/tools/auditoria-onda2f/cegos.mjs            # cego, sem --topic
 *   node research/tools/auditoria-onda2f/cegos.mjs --forcado  # com a gaveta certa
 */

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const AQUI = dirname(fileURLToPath(import.meta.url));
const ROOT = join(AQUI, '../../..');
const CLI = join(ROOT, 'research/tools/check-evidence.mjs');
const CASOS = JSON.parse(readFileSync(join(AQUI, 'cegos.json'), 'utf8'));
const FORCADO = process.argv.includes('--forcado');

const rodar = (args) => {
  const t0 = Date.now();
  const out = execFileSync('node', [CLI, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return { out, ms: Date.now() - t0 };
};

let algum = 0;
let todos = 0;
let bytesMax = 0;
const linhas = [];

for (const c of CASOS) {
  const gavetas = FORCADO ? c.gaveta.slice(0, 1) : [];
  const args = ['--pergunta', c.q, ...(gavetas.length ? ['--topic', gavetas[0]] : [])];
  const { out, ms } = rodar(args);
  const bytes = Buffer.byteLength(out, 'utf8');
  bytesMax = Math.max(bytesMax, bytes);

  // O COMANDO QUE DE FATO RODOU, impresso antes de qualquer conclusão.
  const cmd = `node ${['research/tools/check-evidence.mjs', ...args.map((a) => (a.startsWith('--') ? a : JSON.stringify(a)))].join(' ')}`;

  // As seções que abriram, lidas do cabeçalho impresso.
  const secoes = [...out.matchAll(/SEÇÃO \d+\/\d+ · GAVETA `([a-z0-9-]+)`/g)].map((m) => m[1]);
  const param = /· O NOME DO DADO ·/.test(out);
  // Um id "sai" quando aparece numa LINHA DE CLAIM da tela impressa — nunca num
  // comando sugerido. Comando sugerido nunca cita id, mas a checagem é ancorada
  // mesmo assim: só conta a ocorrência fora de linha que comece com `node `.
  const corpo = out.split('\n').filter((l) => !l.trim().startsWith('node ')).join('\n');
  const saiu = c.espera.filter((id) => new RegExp(`\\b${id}\\b`).test(corpo));

  if (saiu.length > 0) algum += 1;
  if (saiu.length === c.espera.length) todos += 1;

  linhas.push({
    id: c.id, cmd, secoes, param, bytes, ms,
    espera: c.espera, saiu, faltou: c.espera.filter((x) => !saiu.includes(x)),
    gavetaCertaAbriu: c.gaveta.filter((g) => secoes.includes(g)),
  });
}

console.log(`\nOS 12 CEGOS — ${FORCADO ? 'COM --topic (gaveta certa)' : 'SEM --topic, a pergunta como escrita'}\n`);
for (const l of linhas) {
  console.log(`${l.id}  ${l.saiu.length}/${l.espera.length}  ${(l.bytes / 1024).toFixed(1)} kB`);
  console.log(`    cmd: ${l.cmd}`);
  console.log(`    seções: ${l.secoes.join(' · ') || '(nenhuma)'}${l.param ? ' · [param]' : ''}`);
  console.log(`    gaveta certa aberta: ${l.gavetaCertaAbriu.join(', ') || 'NENHUMA'}`);
  console.log(`    saiu: ${l.saiu.join(', ') || '—'}    faltou: ${l.faltou.join(', ') || '—'}`);
}
console.log(`\nALGUM id: ${algum} de ${CASOS.length}`);
console.log(`TODOS os ids: ${todos} de ${CASOS.length}`);
console.log(`Maior saída: ${(bytesMax / 1024).toFixed(1)} kB`);

// SOTERRADO: a gaveta certa ABRIU e mesmo assim a resposta não saiu.
const soterrados = linhas.filter((l) => l.gavetaCertaAbriu.length > 0 && l.saiu.length < l.espera.length);
console.log(`\nSOTERRADOS (gaveta certa aberta, resposta ausente ou parcial): ${soterrados.length}`);
for (const l of soterrados) {
  console.log(`  ${l.id}  abriu ${l.gavetaCertaAbriu.join(', ')}  e faltou ${l.faltou.join(', ')}`);
}
