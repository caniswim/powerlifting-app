#!/usr/bin/env node
/**
 * MUTAÇÃO DAS CONSTANTES DA TELA, com ênfase no lado que AFROUXA.
 *
 * Só as seis travas do `check:kb` que de fato importam `roteador.mjs` são
 * rodadas — as outras não podem ficar vermelhas por uma constante deste arquivo,
 * e rodá-las seria vender 72 s de espera como rigor:
 *
 *   roteador.test.mjs · secoes.test.mjs · check-canarios.test.mjs ·
 *   check-glossario.mjs · check-canarios.mjs · check-rotas.mjs
 *
 * (conferido com `grep -l roteador.mjs research/tools/*.mjs`)
 *
 * Uso: node research/tools/auditoria-onda2f/mutacao.mjs [--completo]
 */

import { readFileSync, writeFileSync, copyFileSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const AQUI = dirname(fileURLToPath(import.meta.url));
const ROOT = join(AQUI, '../../..');
const ALVO = join(ROOT, 'research/tools/roteador.mjs');
const BACKUP = join(AQUI, 'roteador.original.mjs');
const COMPLETO = process.argv.includes('--completo');

const TRAVAS = COMPLETO
  ? [['npm', ['run', 'check:kb']]]
  : [
    ['node', ['research/tools/roteador.test.mjs']],
    ['node', ['research/tools/secoes.test.mjs']],
    ['node', ['research/tools/check-canarios.test.mjs']],
    ['node', ['research/tools/check-glossario.mjs']],
    ['node', ['research/tools/check-canarios.mjs']],
    ['node', ['research/tools/check-rotas.mjs']],
  ];

const MUTACOES = [
  ['TETO_DA_SECAO', '18', '19'],
  ['TETO_PARAM', '12', '0'],
  ['MIN_PECAS_DO_PARAM', '2', '6'],
  ['LIGACOES_POR_FOCO', '4', '0'],
  ['FOCO_DA_SECAO', '4', '0'],
  ['AFINS_DA_SECAO', '6', '1'],
  ['PESO_AFIM', '0.6', '0.3'],
  ['MAX_TOPICOS', '5', '4'],
  ['TETO_AFINS', '60', '12'],
  ['TETO_DA_SECAO_FORCADA', '60', '40'],
];

copyFileSync(ALVO, BACKUP);
const ORIGINAL = readFileSync(BACKUP, 'utf8');
const restaurar = () => writeFileSync(ALVO, ORIGINAL);
process.on('exit', restaurar);

const rodar = () => {
  for (const [bin, args] of TRAVAS) {
    try {
      execFileSync(bin, args, { cwd: ROOT, stdio: 'pipe', maxBuffer: 64 * 1024 * 1024 });
    } catch (e) {
      return { verde: false, quem: args[args.length - 1] };
    }
  }
  return { verde: true, quem: null };
};

console.log(`\nMUTAÇÃO — ${COMPLETO ? 'npm run check:kb inteiro' : 'as 6 travas que importam roteador.mjs'}\n`);
const base = rodar();
console.log(`  base: ${base.verde ? 'VERDE' : `VERMELHA em ${base.quem} — pare aqui`}\n`);
if (!base.verde) process.exit(1);

const sobreviventes = [];
for (const [nome, de, para] of MUTACOES) {
  const alvo = `export const ${nome} = ${de};`;
  if (!ORIGINAL.includes(alvo)) {
    console.log(`  ?? ${nome} = ${de}  NÃO ENCONTRADO no arquivo — mutação inválida`);
    continue;
  }
  writeFileSync(ALVO, ORIGINAL.replace(alvo, `export const ${nome} = ${para};`));
  const r = rodar();
  restaurar();
  const marca = r.verde ? 'SOBREVIVE' : `morta em ${r.quem}`;
  console.log(`  ${r.verde ? '✗' : '✓'} ${nome} ${de} → ${para}   ${marca}`);
  if (r.verde) sobreviventes.push(`${nome} ${de}→${para}`);
}

restaurar();
unlinkSync(BACKUP);
console.log(`\n  ${sobreviventes.length} de ${MUTACOES.length} SOBREVIVEM: ${sobreviventes.join(' · ') || '(nenhuma)'}`);
