#!/usr/bin/env node
/**
 * ATAQUE AS CONTAS DOS DOIS PARECERES — reproduz contra o GERADOR, nao contra a
 * prosa. Nenhum numero e digitado aqui: tudo sai de `venaBlock1Weeks`.
 *
 * Tres afirmacoes sob teste:
 *
 *  A. "sao 9 series semanais de floor press sobre o tecido lesionado"
 *     (PROGRAMA.md §1.2, repetida sem reproducao pelo parecer 1)
 *
 *  B. "supino >= 22 series/semana" (restricao R3)
 *
 *  C. o bloco de 2,0 s: quantas series, a que %, em que semanas
 *
 * E o corolario que nenhum dos dois pareceres escreveu:
 *
 *  D. FP-SETS = 7 - SUP-V1 e FP4-SETS = 5 - SUP-V4 tornam a contagem de series
 *     de barra sobre o peitoral INVARIANTE a SUP-V1 e SUP-V4. Recuar um degrau
 *     desses dois eixos — 4 dos 6 que o §1.2 nomeia — nao reduz UMA SERIE de
 *     volume. A prova e a propria grade: SUP-V1 sobe 2 e SUP-V4 sobe 2 ao longo
 *     do bloco, e o total nao se mexe.
 *
 * Uso: node research/tools/auditoria-peito/conta-peito.mjs
 */
import '../../../scripts/ts-resolve.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const { venaBlock1Weeks } = await import(join(ROOT, 'src/data/program/vena-block1/generated.ts'));

const BARRA_PEITO = /^(supino_pausado_competicao|floor_press)$/;

console.log('sem | floor | supinoPausado | barraPeitoTotal | pausa>=2s');
const linhas = [];
for (const w of venaBlock1Weeks) {
  let floor = 0;
  let pausado = 0;
  const longas = [];
  for (const d of w.days ?? []) {
    for (const e of d.exercises ?? []) {
      const id = e.exerciseId ?? '';
      if (!BARRA_PEITO.test(id)) continue;
      if (id === 'floor_press') floor += e.sets ?? 0;
      else pausado += e.sets ?? 0;
      if ((e.pauseSec ?? 0) >= 2) longas.push(`${e.sets}x${e.reps} @${e.percent1RM ?? '?'}`);
    }
  }
  const total = floor + pausado;
  linhas.push({ semana: w.weekNumber, floor, pausado, total });
  console.log(
    String(w.weekNumber).padStart(3),
    '|', String(floor).padStart(5),
    '|', String(pausado).padStart(13),
    '|', String(total).padStart(15),
    '|', longas.join(' , ') || '-',
  );
}

const bloco = linhas.filter((l) => l.semana <= 16);
const floors = [...new Set(bloco.map((l) => l.floor))].sort((a, b) => a - b);
const totais = [...new Set(bloco.map((l) => l.total))];

console.log();
console.log('A. "9 series semanais de floor press":');
console.log(`   floor press por semana (S1-S16): ${floors.join(', ')}`);
console.log(`   semanas em que sao de fato 9: ${bloco.filter((l) => l.floor === 9).map((l) => 'S' + l.semana).join(', ') || 'nenhuma'}`);
console.log(`   -> a frase reproduz em ${bloco.filter((l) => l.floor === 9).length} de ${bloco.length} semanas`);

console.log();
console.log('D. invariancia do total de barra sobre o peitoral:');
console.log(`   totais distintos em S1-S16: ${totais.join(', ')}`);
console.log(`   SUP-V1 (series pausadas D1) varia: ${[...new Set(bloco.map((l) => l.pausado))].join(', ')}`);
console.log(totais.length === 1
  ? '   -> INVARIANTE. Recuar SUP-V1/SUP-V4 troca pausado por floor 1:1 e nao remove serie nenhuma.'
  : '   -> NAO invariante; a afirmacao D cai.');
