#!/usr/bin/env node
/**
 * O QUE O APP FAZ SE O GATE DISPARAR HOJE — percorrido no codigo de producao.
 *
 * Nao simula prosa: chama `buildWeekDoc` (o mesmo que a camada de sync chama) e
 * imprime as bandeiras que saem. Quatro cenarios:
 *
 *   A. A SEMANA DELE: nenhum treino, dor presente em repouso.
 *   B. Ele abre um treino de supino e registra 2/10 no PRE.
 *   C. Segundo evento dentro da janela de 3 sessoes (o degrau que RECUA).
 *   D. O RETORNO: duas semanas limpas medidas so pelo PRE x medidas pelos DOIS.
 *      E o motivo de `npm run check:gate` estar VERMELHO agora.
 *
 * Uso: node research/tools/auditoria-peito/sonda-gate-hoje.mjs
 */
import '../../../scripts/ts-resolve.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const { buildWeekDoc } = await import(join(ROOT, 'src/services/sync/weeklyRollup.ts'));
const { venaBlock1Weeks } = await import(join(ROOT, 'src/data/program/vena-block1/generated.ts'));
const { PAIN_GATE } = await import(join(ROOT, 'src/domain/painGate.ts'));

const isoDay = (d) => `2026-08-${String(d).padStart(2, '0')}`;

/** Sessao no formato que o rollup consome. `fase` decide onde a dor entra. */
function sessao({ weekIndex = 0, i = 0, dia = 1, dor = [], fase = 'pre', peito = true, semLog = false }) {
  const week = venaBlock1Weeks[weekIndex];
  return {
    schemaVersion: 1,
    updatedAt: '2026-08-12T12:00:00.000Z',
    id: `s${weekIndex}-${i}`,
    date: isoDay(dia),
    programId: 'vena-block1',
    weekId: `vena-block1-w${week.weekNumber}`,
    weekNumber: week.weekNumber,
    macrocycle: 1,
    dayIndex: i,
    dayType: week.days[0].dayType,
    blockName: week.blockName,
    blockType: week.blockType,
    completed: true,
    durationMin: 60,
    setsPrescribed: 1,
    setsCompleted: 1,
    tonnage: 0,
    tonnageByLift: {},
    volumeByMuscle: peito ? { peito: 5 } : {},
    exercises: [],
    compliance: {
      sets: 0, judgedSets: 0, reps: 0, judgedReps: 0, validReps: 0, validRepPct: null,
      videos: 0, byLift: {},
      equipment: { belt: 0, straps: 0, kneeSleeves: 0, wristWraps: 0 },
      bars: {}, plates: {},
    },
    pre: semLog ? null : {
      sleepQuality: 7, sleepHours: 8, energyLevel: 7, stressLevel: 3, motivation: 7,
      pain: fase === 'pre' || fase === 'ambos' ? dor : [],
      supplements: { creatine: true, protein: true, preWorkoutMeal: true },
    },
    post: !semLog && (fase === 'post' || fase === 'ambos')
      ? {
        sessionQuality: 7, sessionRPE: 8, strengthPerception: 'normal',
        planAdherence: 'full', newPain: dor,
      }
      : null,
  };
}

const doc = (sessions, weekIndex = 0, prev = null) => buildWeekDoc({
  programId: 'vena-block1',
  programName: 'Vena Bloco 1',
  week: venaBlock1Weeks[weekIndex],
  sessions,
  workouts: [],
  bodyweight: [],
}, prev);

const mostra = (titulo, d) => {
  console.log(`\n--- ${titulo}`);
  console.log(`    gate.readings = ${JSON.stringify(d.gate?.readings ?? [])}`);
  console.log(`    gate.weeks    = ${JSON.stringify(d.gate?.weeks ?? [])}`);
  console.log(`    pain[]        = ${JSON.stringify(d.pain)}`);
  console.log('    flags:');
  for (const f of d.flags) console.log(`      ⚑ ${f}`);
  if (!d.flags.length) console.log('      (nenhuma)');
};

const DOR2 = [{ region: 'left_chest', intensity: PAIN_GATE.limiarMinimo }];

console.log('='.repeat(78));
console.log('A. A SEMANA DELE — nenhum treino, dor presente em repouso no lado da lesao');
console.log('='.repeat(78));
mostra('semana sem sessao nenhuma', doc([]));
console.log('\n    NAO EXISTE caminho para registrar a dor em repouso: `RestPainLog` esta');
console.log('    declarada em src/types/index.ts e nao tem UM produtor nem UM consumidor;');
console.log('    `describeRestPain` em src/domain/painGate.ts nao e chamada em lugar nenhum;');
console.log('    `WeekDoc` nao tem campo `restPain` apesar de ROLLUP_SCHEMA_VERSION=3 citar um.');

console.log('\n' + '='.repeat(78));
console.log('B. Ele abre UM treino de supino e registra 2/10 no PRE');
console.log('='.repeat(78));
mostra('1 sessao de peitoral, dor 2/10 no pre', doc([sessao({ i: 0, dia: 12, dor: DOR2 })]));

console.log('\n' + '='.repeat(78));
console.log('C. SEGUNDO evento dentro da janela de 3 sessoes');
console.log('='.repeat(78));
mostra('evento · sessao limpa · evento', doc([
  sessao({ i: 0, dia: 10, dor: DOR2 }),
  sessao({ i: 1, dia: 11, dor: [] }),
  sessao({ i: 2, dia: 12, dor: DOR2 }),
]));

console.log('\n' + '='.repeat(78));
console.log('D. RETORNO — a linha que AUMENTA carga, e por que o build esta vermelho');
console.log('='.repeat(78));
const teto = PAIN_GATE.retorno.picoMaximo;
const limpa = teto > 0 ? [{ region: 'left_chest', intensity: teto }] : [];
function duasSemanas(fase) {
  let d = null;
  for (let i = 0; i < PAIN_GATE.retorno.semanas; i += 1) {
    d = doc([
      sessao({ weekIndex: i, i: 0, dia: 1 + i * 7, dor: limpa, fase }),
      sessao({ weekIndex: i, i: 1, dia: 2 + i * 7, dor: limpa, fase }),
    ], i, d);
  }
  return d;
}
for (const fase of ['pre', 'ambos']) {
  const d = duasSemanas(fase);
  const liberado = d.flags.some((f) => f.startsWith('RETORNO DO GATE') && !f.includes('bloqueado'));
  mostra(`${PAIN_GATE.retorno.semanas} semanas limpas, log colhido em: ${fase.toUpperCase()}`
    + ` -> RETORNO ${liberado ? 'LIBERADO' : 'BLOQUEADO'}`, d);
}
console.log('\n    scripts/check-pain-gate.test.mjs monta o cenario do RETORNO com');
console.log("    weekWith(spec.pain, 'pre', ...) (linha 330) — so o PRE. `fullyCollectedLog`");
console.log('    (weeklyRollup.ts) exige pre E pos. Logo fullyLoggedSessions = 0, semanaLimpa()');
console.log('    devolve false e o RETORNO nunca sai. O teste nao foi atualizado quando o');
console.log('    campo entrou: `npm run check:gate` reprova 2 de 33 e `npm run build` cai junto.');
