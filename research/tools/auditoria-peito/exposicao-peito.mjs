#!/usr/bin/env node
/**
 * AUDITORIA — exposicao real do peitoral no Bloco 1, semana a semana.
 *
 * Le o PROGRAMA GERADO (`src/data/program/vena-block1/generated.ts`), nao o
 * markdown: a pergunta e o que o gerador produz, nao o que o documento diz que
 * produz. Nenhum numero deste script e digitado; tudo sai de `venaBlock1Weeks`
 * e do `muscleMap` do registro de exercicios que o proprio app usa.
 *
 * Uso:
 *   node research/tools/auditoria-peito/exposicao-peito.mjs
 *   node research/tools/auditoria-peito/exposicao-peito.mjs --linhas   (detalhe)
 *   node research/tools/auditoria-peito/exposicao-peito.mjs --json
 */
import '../../../scripts/ts-resolve.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');

await import(join(ROOT, 'src/data/exercises/definitions.ts'));
await import(join(ROOT, 'src/data/exercises/powerbuilding.ts'));
await import(join(ROOT, 'src/data/exercises/vena.ts'));
const { getExerciseMuscleMap } = await import(join(ROOT, 'src/domain/exerciseRegistry.ts'));
const { venaBlock1Weeks, VENA_BLOCK1_MEASURES } = await import(
  join(ROOT, 'src/data/program/vena-block1/generated.ts')
);

const DETALHE = process.argv.includes('--linhas');
const JSON_OUT = process.argv.includes('--json');

/** Peso de peitoral do proprio registro do app. 0 = nao encosta no tecido. */
const peitoDe = (id) => getExerciseMuscleMap(id).peito ?? 0;

const linhas = [];
for (const w of venaBlock1Weeks) {
  for (const d of w.days) {
    for (const b of d.exercises) {
      const peito = peitoDe(b.exerciseId);
      if (peito <= 0) continue;
      linhas.push({
        semana: w.weekNumber,
        dia: d.dayIndex + 1,
        dayType: d.dayType,
        exercicio: b.exerciseId,
        countsAs: b.countsAs,
        papel: b.role,
        series: b.sets,
        reps: b.reps,
        rpe: b.rpe ?? null,
        pct: b.percent1RM ?? null,
        pesoPeito: peito,
        pausaS: b.pauseSec ?? 0,
        barra: /supino|floor_press|close_grip|larsen|spoto|pin_press|feet_up/.test(b.exerciseId),
      });
    }
  }
}

const semanas = [...new Set(linhas.map((l) => l.semana))].sort((a, b) => a - b);
const resumo = semanas.map((s) => {
  const ls = linhas.filter((l) => l.semana === s);
  const soma = (f) => ls.filter(f).reduce((a, l) => a + l.series, 0);
  return {
    semana: s,
    seriesTotais: soma(() => true),
    seriesPonderadas: ls.reduce((a, l) => a + l.series * l.pesoPeito, 0),
    supinoPausado: soma((l) => l.countsAs === 'supino_pausado'),
    floorPress: soma((l) => l.exercicio === 'floor_press'),
    peitoAlongado: soma((l) => l.countsAs === 'peito_alongado'),
    sessoesComPeito: new Set(ls.map((l) => l.dia)).size,
    // Reps totais sobre o peitoral (faixa: usa o piso da faixa quando "8-10").
    repsMin: ls.reduce((a, l) => a + l.series * Number(String(l.reps).split('-')[0]), 0),
  };
});

if (JSON_OUT) {
  console.log(JSON.stringify({ resumo, linhas }, null, 2));
  process.exit(0);
}

console.log('=== SERIES SOBRE O PEITORAL POR SEMANA (muscleMap.peito > 0) ===');
console.log('sem | total | sup.pausado | floor press | peito along. | ponderado | sessoes | reps');
for (const r of resumo) {
  console.log(
    `${String(r.semana).padStart(3)} | ${String(r.seriesTotais).padStart(5)} | `
    + `${String(r.supinoPausado).padStart(11)} | ${String(r.floorPress).padStart(11)} | `
    + `${String(r.peitoAlongado).padStart(12)} | ${String(r.seriesPonderadas.toFixed(1)).padStart(9)} | `
    + `${String(r.sessoesComPeito).padStart(7)} | ${String(r.repsMin).padStart(4)}`,
  );
}

const pico = resumo.reduce((a, r) => (r.seriesTotais > a.seriesTotais ? r : a));
console.log(`\nPICO: S${pico.semana} com ${pico.seriesTotais} series sobre o peitoral `
  + `(${pico.supinoPausado} supino pausado + ${pico.floorPress} floor press + ${pico.peitoAlongado} peito alongado)`);

console.log('\n=== FLOOR PRESS: series por semana e por dia ===');
for (const s of semanas) {
  const fp = linhas.filter((l) => l.semana === s && l.exercicio === 'floor_press');
  if (!fp.length) { console.log(`S${s}: 0`); continue; }
  console.log(`S${s}: ${fp.reduce((a, l) => a + l.series, 0)} series = `
    + fp.map((l) => `D${l.dia} ${l.series}x${l.reps} @RPE ${l.rpe}`).join(' + '));
}

console.log('\n=== TODA LINHA DE PEITORAL, POR DIA (S1 e semana de pico) ===');
for (const s of [1, pico.semana]) {
  console.log(`-- S${s} --`);
  for (const l of linhas.filter((x) => x.semana === s)) {
    console.log(`  D${l.dia} ${l.exercicio.padEnd(28)} ${String(l.series)}x${l.reps}`
      + ` @${l.rpe ?? l.pct ?? '?'} papel=${l.papel} pausa=${l.pausaS}s peso=${l.pesoPeito}`);
  }
}

if (DETALHE) {
  console.log('\n=== TODAS AS LINHAS ===');
  for (const l of linhas) {
    console.log(`S${l.semana} D${l.dia} ${l.exercicio} ${l.series}x${l.reps} @${l.rpe ?? l.pct} `
      + `papel=${l.papel} pausa=${l.pausaS}s countsAs=${l.countsAs}`);
  }
}

console.log('\n=== CONFERE CONTRA VENA_BLOCK1_MEASURES.direct (medicao do gerador) ===');
for (const m of VENA_BLOCK1_MEASURES) {
  const d = m.direct ?? {};
  const r = resumo.find((x) => x.semana === m.weekNumber);
  console.log(`S${String(m.weekNumber).padStart(2)} | supino_pausado=${d.supino_pausado ?? 0} `
    + `supino_acessorio=${d.supino_acessorio ?? 0} peito_alongado=${d.peito_alongado ?? 0} `
    + `=> soma=${(d.supino_pausado ?? 0) + (d.supino_acessorio ?? 0) + (d.peito_alongado ?? 0)} `
    + `| auditoria=${r ? r.seriesTotais : 0}`);
}
