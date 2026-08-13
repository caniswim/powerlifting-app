#!/usr/bin/env node
/**
 * A TRAVA QUE FALTAVA: varre todo endereço `[Rnn @mm:ss]` do `PROGRAMA.md` e
 * reprova o build quando algum aponta para lugar nenhum.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * POR QUE ESTA TRAVA EXISTE
 *
 * `check-claims.mjs` já garante que toda claim é bem-formada, e
 * `check-evidence.mjs` resolve ids `Vnnn-nn` citados por um agente. Faltava a
 * terceira porta, e era justamente a do documento que vira TREINO: o
 * `PROGRAMA.md` cita a base por ENDEREÇO (`[R79 @03:35]`), e ninguém conferia
 * endereço nenhum. Cinco endereços errados do §1.2 — a seção do gate de dor de
 * peitoral, num atleta com histórico de ruptura — sobreviveram a SEIS ondas de
 * auditoria por esse buraco.
 *
 * O modo de falha é silencioso por construção: um endereço errado é
 * indistinguível de um certo numa string, e a prosa em volta dele continua
 * plausível. Só uma trava automática pega isso.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * O QUE ELA REPROVA, E O QUE ELA DELIBERADAMENTE NÃO REPROVA
 *
 * REPROVA:
 *   - `sem-fonte`      — o `Rnnn` não existe na base. Citação fabricada.
 *   - `fora-de-faixa`  — a fonte existe e o endereço caiu num BURACO da grade,
 *                        um trecho de onde nada foi extraído.
 *
 * NÃO REPROVA (e a distinção é o achado de 12/08/2026):
 *   - endereço que resolve para o bloco ERRADO dentro da mesma fonte;
 *   - endereço com o rótulo `[GERAL]`/`[PESSOAL]` trocado;
 *   - endereço cuja claim é `opiniao`/`mecanismo` sustentando uma prescrição.
 *
 * Esses três são defeitos de CONTEÚDO e nenhuma aritmética de timestamp os vê —
 * eles exigem ler a claim. Uma onda anterior tentou reduzi-los a um teste de
 * igualdade de timestamp e produziu 230 falsos positivos em 263 endereços.
 * A trava aqui é estreita de propósito: ela cobre o que é decidível, e o que não
 * é fica declarado no `RUNBOOK.md` §8 como leitura humana, não escondido atrás
 * de um número que parece medição.
 *
 * A regra de resolução e a tolerância medida da grade estão em `enderecos.mjs`.
 *
 * Uso: node research/tools/check-enderecos.mjs [--verbose]
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  ENDERECO_RE_GLOBAL, parsearEndereco, toleranciaDaGrade, resolverEndereco, indexarPorFonte,
} from './enderecos.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const EXTRACT = join(ROOT, 'research/extract');
const VERBOSE = process.argv.includes('--verbose');

/** Os documentos que citam a base por endereço e que viram decisão de treino. */
const ALVOS = [
  'src/data/program/vena-block1/source/PROGRAMA.md',
];

if (!existsSync(EXTRACT)) {
  console.error(`✗ ${EXTRACT} não existe`);
  process.exit(2);
}

const claims = [];
for (const f of readdirSync(EXTRACT).filter((x) => x.endsWith('.jsonl')).sort()) {
  for (const linha of readFileSync(join(EXTRACT, f), 'utf8').split('\n')) {
    if (!linha.trim()) continue;
    try {
      claims.push(JSON.parse(linha));
    } catch {
      /* `check-claims.mjs` é quem reclama de JSON quebrado */
    }
  }
}

const porFonte = indexarPorFonte(claims);
const { passo, tolerancia } = toleranciaDaGrade(claims);

const problemas = [];
let total = 0;
let resolvidos = 0;

for (const alvo of ALVOS) {
  const caminho = join(ROOT, alvo);
  if (!existsSync(caminho)) {
    console.error(`✗ ${alvo} não existe`);
    process.exit(2);
  }
  const linhas = readFileSync(caminho, 'utf8').split('\n');
  linhas.forEach((linha, i) => {
    for (const m of linha.matchAll(ENDERECO_RE_GLOBAL)) {
      total += 1;
      const e = parsearEndereco(m[0]);
      const r = resolverEndereco(e, porFonte.get(e.src), tolerancia);
      if (r.veredito === 'resolve') {
        resolvidos += 1;
        continue;
      }
      problemas.push({
        arquivo: alvo,
        linha: i + 1,
        endereco: m[0],
        veredito: r.veredito,
        proximas: r.proximas,
      });
    }
  });
}

console.log('\nEndereços [Rnn @mm:ss] citados pelo programa');
console.log(`  documentos varridos ....... ${ALVOS.length}`);
console.log(`  endereços encontrados ..... ${total}`);
console.log(`  grade de \`at\` ............. passo mediano ${passo} s → tolerância ±${tolerancia} s`);
console.log(`  resolvem .................. ${resolvidos}`);
console.log(`  não resolvem .............. ${problemas.length}`);

if (VERBOSE && problemas.length === 0) {
  console.log('\n  (--verbose sem nada a listar: todo endereço caiu num bloco extraído)');
}

if (problemas.length > 0) {
  console.log(`\n${problemas.length} ENDEREÇO(S) APONTANDO PARA LUGAR NENHUM:\n`);
  for (const p of problemas) {
    const rotulo = p.veredito === 'sem-fonte'
      ? 'FONTE INEXISTENTE — citação fabricada'
      : `FORA DE FAIXA — nenhuma claim a ±${tolerancia} s (o endereço caiu num buraco da grade)`;
    console.log(`  ✗ ${p.endereco}  ${p.arquivo}:${p.linha}`);
    console.log(`      ${rotulo}`);
    if (p.proximas.length > 0) {
      const perto = p.proximas
        .map((x) => `${x.claim.src}@${x.claim.at} (${x.claim.id}, ${x.distancia}s)`)
        .join(' · ');
      console.log(`      mais próximas: ${perto}`);
    }
    console.log('');
  }
  console.log('Corrija o endereço para a marca da claim que o texto de fato cita, e');
  console.log('confira `scope` e `modo` dela — endereço certo com rótulo errado continua');
  console.log('sendo defeito, e este script NÃO o enxerga.');
  process.exit(1);
}

console.log('\n✓ todo endereço citado pelo programa cai num bloco extraído da base');
process.exit(0);
