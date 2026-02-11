import type { PrescribedWeek, PrescribedDay } from '../../types';
import { ex, day, week } from './builders';
import { rpeProgression4, volScale4 } from './progression';

// ---------------------------------------------------------------------------
// Day Factories
// ---------------------------------------------------------------------------

// --- ACCUMULATION template (Macrocycle 1A / 1B style) ---

export function accSquatDay(weekIdx: number, opts?: {
  mainSets?: number; mainReps?: string; mainRpe?: string;
  gmId?: string; gmSets?: number; gmReps?: string;
  quadCompound?: string; quadCompoundReps?: string;
  legExtSets?: number;
}): PrescribedDay {
  const o = opts ?? {};
  const mainSets = o.mainSets ?? volScale4(3, weekIdx);
  const mainReps = o.mainReps ?? '6-8';
  const mainRpe = o.mainRpe ?? rpeProgression4(weekIdx);
  const gmId = o.gmId ?? 'good_morning';
  const gmSets = o.gmSets ?? volScale4(3, weekIdx);
  const gmReps = o.gmReps ?? '8-10';
  const quadComp = o.quadCompound ?? 'hack_squat';
  const quadCompReps = o.quadCompoundReps ?? '10-12';
  const legExtSets = o.legExtSets ?? volScale4(3, weekIdx);

  return day('squat_emphasis', 'Lower: Squat Emphasis', [
    ex('agachamento_low_bar', mainSets, mainReps, mainRpe),
    ex(gmId, gmSets, gmReps, '7-8'),
    ex(quadComp, volScale4(3, weekIdx), quadCompReps, '8-9'),
    ex('leg_extension', legExtSets, '12-15', '8-9'),
    ex('back_extension', 3, '12-15', '7'),
  ]);
}

export function accBenchDay(weekIdx: number, opts?: {
  mainSets?: number; mainReps?: string; mainRpe?: string;
  variationId?: string; variationSets?: number; variationReps?: string;
  rowSets?: number;
  facePullSets?: number; facePullRpe?: string;
  lateralId?: string; lateralSets?: number; lateralReps?: string; lateralRpe?: string;
  roscaId?: string; roscaSets?: number; roscaReps?: string; roscaRpe?: string;
  tricepsId?: string; tricepsSets?: number; tricepsReps?: string; tricepsRpe?: string;
}): PrescribedDay {
  const o = opts ?? {};
  const mainSets = o.mainSets ?? volScale4(3, weekIdx);
  const mainReps = o.mainReps ?? '6-8';
  const mainRpe = o.mainRpe ?? rpeProgression4(weekIdx);
  const varId = o.variationId ?? 'spoto_press';
  const varSets = o.variationSets ?? 3;
  const varReps = o.variationReps ?? '6-8';
  const rowSets = o.rowSets ?? volScale4(3, weekIdx);

  return day('bench_emphasis', 'Upper: Bench Emphasis', [
    ex('supino_wide_grip', mainSets, mainReps, mainRpe),
    ex(varId, varSets, varReps, '7-8'),
    ex('remada_barra', rowSets, '8-10', '7-8'),
    ex('db_press_inclinado', 3, '10-12', '8'),
    ex('face_pull', o.facePullSets ?? volScale4(3, weekIdx), '15-20', o.facePullRpe ?? '8'),
    ex(o.lateralId ?? 'elevacao_lateral', o.lateralSets ?? volScale4(3, weekIdx), o.lateralReps ?? '12-15', o.lateralRpe ?? '8'),
    ex(o.roscaId ?? 'rosca', o.roscaSets ?? volScale4(3, weekIdx), o.roscaReps ?? '10-15', o.roscaRpe ?? '8'),
    ex(o.tricepsId ?? 'triceps_testa', o.tricepsSets ?? volScale4(3, weekIdx), o.tricepsReps ?? '10-15', o.tricepsRpe ?? '8'),
  ]);
}

export function accDeadliftDay(weekIdx: number, opts?: {
  mainSets?: number; mainReps?: string; mainRpe?: string;
  secondaryId?: string; secondarySets?: number; secondaryReps?: string;
  legPressId?: string; legPressSets?: number; legPressReps?: string;
  gmId?: string;
}): PrescribedDay {
  const o = opts ?? {};
  const mainSets = o.mainSets ?? volScale4(3, weekIdx);
  const mainReps = o.mainReps ?? '4-6';
  const mainRpe = o.mainRpe ?? rpeProgression4(weekIdx);
  const secId = o.secondaryId ?? 'pause_squat';
  const secSets = o.secondarySets ?? 3;
  const secReps = o.secondaryReps ?? '5-8';
  const lpId = o.legPressId ?? 'leg_press';
  const lpSets = o.legPressSets ?? volScale4(3, weekIdx);
  const lpReps = o.legPressReps ?? '10-15';
  const gmId = o.gmId ?? 'good_morning';

  return day('deadlift_emphasis', 'Lower: Deadlift Emphasis', [
    ex('deadlift_sumo', mainSets, mainReps, mainRpe),
    ex(secId, secSets, secReps, '7'),
    ex(lpId, lpSets, lpReps, '8-9'),
    ex('leg_extension', 3, '12-15', '8-9'),
    ex(gmId, 3, '10-12', '7', 'Light'),
  ]);
}

export function accBenchVolDay(weekIdx: number, opts?: {
  variationId?: string; variationSets?: number; variationReps?: string; variationRpe?: string;
  dbPressId?: string;
  rowId?: string; rowSets?: number;
  tricepsId?: string; tricepsSets?: number; tricepsReps?: string; tricepsRpe?: string;
  roscaId?: string; roscaSets?: number; roscaReps?: string; roscaRpe?: string;
  lateralSets?: number; lateralReps?: string; lateralRpe?: string;
}): PrescribedDay {
  const o = opts ?? {};
  const varId = o.variationId ?? 'close_grip_bench';
  const varSets = o.variationSets ?? volScale4(3, weekIdx);
  const varReps = o.variationReps ?? '6-8';
  const varRpe = o.variationRpe ?? '7-8';
  const dbId = o.dbPressId ?? 'db_press_flat';
  const rowId = o.rowId ?? 'remada_apoio_peito';
  const rowSets = o.rowSets ?? volScale4(3, weekIdx);
  const triId = o.tricepsId ?? 'triceps_frances';
  const roscaId = o.roscaId ?? 'rosca_martelo';

  return day('bench_volume', 'Upper: Bench Volume', [
    ex(varId, varSets, varReps, varRpe),
    ex(dbId, 3, '8-12', '8'),
    ex(rowId, rowSets, '10-12', '8'),
    ex('elevacao_lateral', o.lateralSets ?? volScale4(3, weekIdx), o.lateralReps ?? '12-15', o.lateralRpe ?? '8'),
    ex(triId, o.tricepsSets ?? volScale4(3, weekIdx), o.tricepsReps ?? '10-15', o.tricepsRpe ?? '8'),
    ex(roscaId, o.roscaSets ?? volScale4(3, weekIdx), o.roscaReps ?? '10-15', o.roscaRpe ?? '8'),
  ]);
}

// --- DELOAD day factories ---

export function deloadSquatDay(): PrescribedDay {
  return day('squat_emphasis', 'Lower: Squat Emphasis (Deload)', [
    ex('agachamento_low_bar', 2, '5', '5-6'),
    ex('good_morning', 2, '8', '5-6'),
    ex('hack_squat', 2, '10', '5-6'),
    ex('leg_extension', 2, '12', '5-6'),
  ]);
}

export function deloadBenchDay(): PrescribedDay {
  return day('bench_emphasis', 'Upper: Bench Emphasis (Deload)', [
    ex('supino_wide_grip', 2, '5', '5-6'),
    ex('spoto_press', 2, '6', '5-6'),
    ex('remada_barra', 2, '8', '5-6'),
    ex('face_pull', 2, '12', '5-6'),
  ]);
}

export function deloadDeadliftDay(): PrescribedDay {
  return day('deadlift_emphasis', 'Lower: Deadlift Emphasis (Deload)', [
    ex('deadlift_sumo', 2, '3', '5-6'),
    ex('pause_squat', 2, '5', '5-6'),
    ex('leg_press', 2, '10', '5-6'),
  ]);
}

export function deloadBenchVolDay(): PrescribedDay {
  return day('bench_volume', 'Upper: Bench Volume (Deload)', [
    ex('close_grip_bench', 2, '6', '5-6'),
    ex('db_press_flat', 2, '8', '5-6'),
    ex('remada_apoio_peito', 2, '10', '5-6'),
    ex('elevacao_lateral', 2, '12', '5-6'),
  ]);
}

// --- Arms & Shoulders mini-session factories ---

export function armsShouldersDayA(weekIdx: number, opts?: {
  bicepsId?: string; bicepsReps?: string;
  tricepsId?: string; tricepsReps?: string;
  lateralId?: string; lateralReps?: string;
  posteriorId?: string; posteriorReps?: string;
}): PrescribedDay {
  const o = opts ?? {};
  const sets = weekIdx >= 2 ? 4 : 3;
  const rpeMap = ['8', '8.5', '9', '9'];
  const rpe = rpeMap[weekIdx] ?? '8';

  return day('arms_shoulders', 'Mini: Arms & Shoulders A', [
    ex(o.bicepsId ?? 'rosca_inclinada', sets, o.bicepsReps ?? '10-12', rpe, undefined, 'A'),
    ex(o.tricepsId ?? 'triceps_corda', sets, o.tricepsReps ?? '12-15', rpe, undefined, 'A'),
    ex(o.lateralId ?? 'elevacao_lateral', sets, o.lateralReps ?? '12-15', rpe, undefined, 'B'),
    ex(o.posteriorId ?? 'elevacao_posterior', sets, o.posteriorReps ?? '15-20', rpe, undefined, 'B'),
  ]);
}

export function armsShouldersDayB(weekIdx: number, opts?: {
  bicepsId?: string; bicepsReps?: string;
  tricepsId?: string; tricepsReps?: string;
  lateralId?: string; lateralReps?: string;
  posteriorId?: string; posteriorReps?: string;
}): PrescribedDay {
  const o = opts ?? {};
  const sets = weekIdx >= 2 ? 4 : 3;
  const rpeMap = ['8', '8.5', '9', '9'];
  const rpe = rpeMap[weekIdx] ?? '8';

  return day('arms_shoulders', 'Mini: Arms & Shoulders B', [
    ex(o.bicepsId ?? 'rosca_scott', sets, o.bicepsReps ?? '10-12', rpe, undefined, 'A'),
    ex(o.tricepsId ?? 'triceps_overhead_cabo', sets, o.tricepsReps ?? '10-15', rpe, undefined, 'A'),
    ex(o.lateralId ?? 'elevacao_lateral_cabo', sets, o.lateralReps ?? '12-15', rpe, undefined, 'B'),
    ex(o.posteriorId ?? 'face_pull', sets, o.posteriorReps ?? '15-20', rpe, undefined, 'B'),
  ]);
}

export function deloadArmsDayA(): PrescribedDay {
  return day('arms_shoulders', 'Mini: Arms & Shoulders A (Deload)', [
    ex('rosca_inclinada', 2, '10-12', '5-6', undefined, 'A'),
    ex('triceps_corda', 2, '12-15', '5-6', undefined, 'A'),
    ex('elevacao_lateral', 2, '12-15', '5-6', undefined, 'B'),
    ex('elevacao_posterior', 2, '15-20', '5-6', undefined, 'B'),
  ]);
}

export function deloadArmsDayB(): PrescribedDay {
  return day('arms_shoulders', 'Mini: Arms & Shoulders B (Deload)', [
    ex('rosca_scott', 2, '10-12', '5-6', undefined, 'A'),
    ex('triceps_overhead_cabo', 2, '10-15', '5-6', undefined, 'A'),
    ex('elevacao_lateral_cabo', 2, '12-15', '5-6', undefined, 'B'),
    ex('face_pull', 2, '15-20', '5-6', undefined, 'B'),
  ]);
}

export function makeDeloadWeek(
  weekNumber: number,
  macrocycle: number,
  blockName: string,
  objective: string,
  overrides?: {
    squat?: PrescribedDay;
    bench?: PrescribedDay;
    deadlift?: PrescribedDay;
    benchVol?: PrescribedDay;
    armsA?: PrescribedDay;
    armsB?: PrescribedDay;
  },
): PrescribedWeek {
  return week(weekNumber, macrocycle, blockName, 'deload', objective, true, [
    overrides?.squat ?? deloadSquatDay(),
    overrides?.bench ?? deloadBenchDay(),
    overrides?.armsA ?? deloadArmsDayA(),
    overrides?.deadlift ?? deloadDeadliftDay(),
    overrides?.benchVol ?? deloadBenchVolDay(),
    overrides?.armsB ?? deloadArmsDayB(),
  ]);
}

// ---------------------------------------------------------------------------
// MACROCYCLE 1 — Weeks 1-13: FOUNDATION HYPERTROPHY
// ---------------------------------------------------------------------------

export function buildMac1(): PrescribedWeek[] {
  const weeks: PrescribedWeek[] = [];

  // Block 1A — Accumulation (Weeks 1-4)
  for (let i = 0; i < 4; i++) {
    weeks.push(week(
      i + 1, 1, 'Acumulação 1A', 'accumulation',
      'Hipertrofia de base — construir volume progressivo a partir do MEV. Foco em padrões de movimento e tolerância ao volume.',
      false,
      [
        accSquatDay(i),
        accBenchDay(i),
        armsShouldersDayA(i),
        accDeadliftDay(i),
        accBenchVolDay(i),
        armsShouldersDayB(i),
      ],
    ));
  }

  // Week 5 — Deload
  weeks.push(makeDeloadWeek(5, 1, 'Deload 1', 'Recuperação ativa — reduzir fadiga acumulada do bloco 1A mantendo padrão motor.'));

  // Block 1B — Accumulation 2 (Weeks 6-9)
  for (let i = 0; i < 4; i++) {
    weeks.push(week(
      i + 6, 1, 'Acumulação 1B', 'accumulation',
      'Segundo bloco acumulativo — maior carga nos acessórios, introdução de variações (pause squat, seated GM).',
      false,
      [
        accSquatDay(i, {
          gmId: 'seated_good_morning',
          gmReps: '8-10',
          mainSets: volScale4(4, i),
        }),
        accBenchDay(i, {
          mainSets: volScale4(4, i),
          variationId: 'spoto_press',
          variationSets: 3,
          variationReps: '5-7',
        }),
        armsShouldersDayA(i, {
          bicepsId: 'rosca_martelo', bicepsReps: '10-12',
          tricepsId: 'triceps_testa', tricepsReps: '10-12',
          lateralId: 'elevacao_lateral_cabo', lateralReps: '12-15',
          posteriorId: 'face_pull', posteriorReps: '15-20',
        }),
        accDeadliftDay(i, {
          mainSets: volScale4(3, i),
          secondaryId: 'pause_squat',
          secondarySets: 3,
          secondaryReps: '4-6',
        }),
        accBenchVolDay(i, {
          variationId: 'larsen_press',
          variationSets: volScale4(3, i),
          variationReps: '6-8',
          tricepsId: 'triceps_testa',
          roscaId: 'rosca_martelo',
        }),
        armsShouldersDayB(i, {
          bicepsId: 'rosca_cabo', bicepsReps: '12-15',
          tricepsId: 'triceps_pulley', tricepsReps: '12-15',
          lateralId: 'elevacao_lateral', lateralReps: '15-20',
          posteriorId: 'elevacao_posterior', posteriorReps: '15-20',
        }),
      ],
    ));
  }

  // Week 10 — Deload
  weeks.push(makeDeloadWeek(10, 1, 'Deload 2', 'Recuperação ativa — reduzir fadiga do bloco 1B antes da transmutação.'));

  // Block 1C — Light Transmutation (Weeks 11-13)
  for (let i = 0; i < 3; i++) {
    const rpeMap = ['8', '8-8.5', '9'];
    const isTestWeek = i === 2;
    const setsMain = isTestWeek ? 3 : 4 + (i > 0 ? 1 : 0);
    const repsMain = isTestWeek ? '1-2' : '4-6';
    const rpeMain = rpeMap[i];

    weeks.push(week(
      i + 11, 1, 'Transmutação 1C', 'transmutation',
      isTestWeek
        ? 'Semana de teste — single a RPE 9 para estimar e1RM atual.'
        : 'Transmutação leve — redução de volume, aumento de intensidade. Preparação para teste de e1RM.',
      false,
      [
        day('squat_emphasis', 'Lower: Squat Emphasis', [
          ex('agachamento_low_bar', setsMain, repsMain, rpeMain, isTestWeek ? 'Teste e1RM: single @ RPE 9' : undefined),
          ex('good_morning', 3, '6-8', '7-8'),
          ex('hack_squat', 3, '8-10', '8'),
          ...(isTestWeek ? [] : [ex('leg_extension', 3, '12-15', '8')]),
        ]),
        day('bench_emphasis', 'Upper: Bench Emphasis', [
          ex('supino_wide_grip', setsMain, repsMain, rpeMain, isTestWeek ? 'Teste e1RM: single @ RPE 9' : undefined),
          ex('spoto_press', 3, '4-6', '7-8'),
          ex('remada_barra', 3, '8-10', '7-8'),
          ex('face_pull', 3, '15-20', '8'),
          ex('elevacao_lateral', 3, '12-15', '8'),
          ex('rosca', 3, '10-15', '8'),
          ex('triceps_testa', 3, '10-15', '8'),
        ]),
        day('arms_shoulders', 'Mini: Arms & Shoulders A', [
          ex('rosca_inclinada', 3, '10-12', '8-9', undefined, 'A'),
          ex('triceps_corda', 3, '12-15', '8-9', undefined, 'A'),
          ex('elevacao_lateral', 3, '12-15', '8-9', undefined, 'B'),
          ex('elevacao_posterior', 3, '15-20', '8-9', undefined, 'B'),
        ]),
        day('deadlift_emphasis', 'Lower: Deadlift Emphasis', [
          ex('deadlift_sumo', setsMain, repsMain, rpeMain, isTestWeek ? 'Teste e1RM: single @ RPE 9' : undefined),
          ex('pause_squat', 3, '4-6', '7'),
          ...(isTestWeek ? [] : [ex('leg_press', 3, '10-12', '8')]),
        ]),
        day('bench_volume', 'Upper: Bench Volume', [
          ex('close_grip_bench', 3, isTestWeek ? '3-5' : '4-6', isTestWeek ? '8' : '7-8'),
          ex('db_press_flat', 3, '8-10', '8'),
          ex('remada_apoio_peito', 3, '10-12', '8'),
          ex('elevacao_lateral', 3, '12-15', '8'),
          ex('triceps_frances', 3, '10-15', '8'),
          ex('rosca_martelo', 3, '10-15', '8'),
        ]),
        day('arms_shoulders', 'Mini: Arms & Shoulders B', [
          ex('rosca_scott', 3, '10-12', '8-9', undefined, 'A'),
          ex('triceps_overhead_cabo', 3, '10-15', '8-9', undefined, 'A'),
          ex('elevacao_lateral_cabo', 3, '12-15', '8-9', undefined, 'B'),
          ex('face_pull', 3, '15-20', '8-9', undefined, 'B'),
        ]),
      ],
    ));
  }

  return weeks;
}

// ---------------------------------------------------------------------------
// MACROCYCLE 2 — Weeks 14-26: DIRECTED HYPERTROPHY + STRENGTH
// ---------------------------------------------------------------------------

export function buildMac2(): PrescribedWeek[] {
  const weeks: PrescribedWeek[] = [];

  // Block 2A — Accumulation w/ specificity (Weeks 14-17)
  for (let i = 0; i < 4; i++) {
    const rpeMap = ['7', '7-7.5', '7.5-8', '8'];
    weeks.push(week(
      i + 14, 2, 'Acumulação 2A', 'accumulation',
      'Acumulação com especificidade — variações competitivas (pause squat, spoto press, deficit DL). Good mornings mais pesados.',
      false,
      [
        day('squat_emphasis', 'Lower: Squat Emphasis', [
          ex('agachamento_low_bar', 4, '5-7', rpeMap[i]),
          ex('pause_squat', 3, '4-6', '7-8', 'Variação competitiva'),
          ex('good_morning', volScale4(3, i), '6-8', '7-8', 'Mais pesado que Mac 1'),
          ex('leg_extension', 3, '12-15', '8-9'),
          ex('back_extension', 3, '10-12', '7'),
        ]),
        day('bench_emphasis', 'Upper: Bench Emphasis', [
          ex('supino_wide_grip', 4, '5-7', rpeMap[i]),
          ex('spoto_press', 3, '4-6', '7-8', 'Variação competitiva'),
          ex('remada_barra', volScale4(3, i), '8-10', '7-8'),
          ex('db_press_inclinado', 3, '8-10', '8'),
          ex('face_pull', volScale4(3, i), '15-20', '8'),
          ex('elevacao_lateral', volScale4(3, i), '12-15', '8'),
          ex('rosca', volScale4(3, i), '10-15', '8'),
          ex('triceps_testa', volScale4(3, i), '10-15', '8'),
        ]),
        armsShouldersDayA(i, {
          bicepsId: 'rosca_inclinada', bicepsReps: '8-12',
          tricepsId: 'triceps_frances', tricepsReps: '8-12',
          lateralId: 'elevacao_lateral', lateralReps: '12-15',
          posteriorId: 'elevacao_posterior', posteriorReps: '12-15',
        }),
        day('deadlift_emphasis', 'Lower: Deadlift Emphasis', [
          ex('deadlift_sumo', 4, '5-7', rpeMap[i]),
          ex('deficit_deadlift_sumo', 3, '3-5', '7-8', 'Variação competitiva'),
          ex('block_deadlift', volScale4(3, i), '3-5', '7-8'),
          ex('leg_press', 3, '10-12', '8'),
          ex('good_morning', 3, '8-10', '7', 'Light'),
        ]),
        day('bench_volume', 'Upper: Bench Volume', [
          ex('close_grip_bench', volScale4(3, i), '5-7', '7-8'),
          ex('db_press_flat', 3, '8-10', '8'),
          ex('remada_apoio_peito', volScale4(3, i), '10-12', '8'),
          ex('elevacao_lateral', volScale4(3, i), '12-15', '8'),
          ex('triceps_isolado', volScale4(3, i), '10-15', '8'),
          ex('rosca_martelo', volScale4(3, i), '10-15', '8'),
        ]),
        armsShouldersDayB(i, {
          bicepsId: 'rosca_barra', bicepsReps: '8-12',
          tricepsId: 'triceps_corda', tricepsReps: '10-15',
          lateralId: 'elevacao_lateral_cabo', lateralReps: '12-15',
          posteriorId: 'face_pull', posteriorReps: '15-20',
        }),
      ],
    ));
  }

  // Week 18 — Deload
  weeks.push(makeDeloadWeek(18, 2, 'Deload 3', 'Recuperação ativa — preparar para bloco de transmutação com intensidades maiores.'));

  // Block 2B — Transmutation (Weeks 19-22)
  for (let i = 0; i < 4; i++) {
    const rpeMap = ['8', '8', '8-8.5', '8.5'];
    const mainSets = 4 + (i >= 2 ? 1 : 0);
    weeks.push(week(
      i + 19, 2, 'Transmutação 2B', 'transmutation',
      'Transmutação — redução de reps, aumento de intensidade. Variações pesadas (spoto 3x3, pause squat 3x4). Manter MEV em acessórios.',
      false,
      [
        day('squat_emphasis', 'Lower: Squat Emphasis', [
          ex('agachamento_low_bar', mainSets, '3-5', rpeMap[i]),
          ex('pause_squat', 3, '3-4', '8', 'Pesado — variação competitiva'),
          ex('good_morning', 3, '6-8', '7-8'),
          ex('leg_extension', 3, '12-15', '8'),
        ]),
        day('bench_emphasis', 'Upper: Bench Emphasis', [
          ex('supino_wide_grip', mainSets, '3-5', rpeMap[i]),
          ex('spoto_press', 3, '3-4', '8', 'Pesado — variação competitiva'),
          ex('remada_barra', 3, '6-8', '7-8'),
          ex('db_press_inclinado', 3, '8-10', '8'),
          ex('face_pull', 3, '15-20', '8'),
          ex('elevacao_lateral', 3, '12-15', '8'),
          ex('rosca', 3, '10-15', '8'),
          ex('triceps_testa', 3, '10-15', '8'),
        ]),
        armsShouldersDayA(i, {
          bicepsId: 'rosca_martelo', bicepsReps: '10-12',
          tricepsId: 'triceps_overhead_cabo', tricepsReps: '10-15',
          lateralId: 'elevacao_lateral', lateralReps: '12-15',
          posteriorId: 'elevacao_posterior', posteriorReps: '15-20',
        }),
        day('deadlift_emphasis', 'Lower: Deadlift Emphasis', [
          ex('deadlift_sumo', mainSets, '3-5', rpeMap[i]),
          ex('block_deadlift', 3, '3-5', '7-8'),
          ex('leg_press', 3, '10-12', '8'),
          ex('good_morning', 3, '8-10', '7', 'Light'),
        ]),
        day('bench_volume', 'Upper: Bench Volume', [
          ex('close_grip_bench', 3, '4-6', '7-8'),
          ex('db_press_flat', 3, '8-10', '8'),
          ex('remada_apoio_peito', 3, '8-10', '8'),
          ex('elevacao_lateral', 3, '12-15', '8'),
          ex('triceps_isolado', 3, '10-12', '8'),
          ex('rosca_martelo', 3, '10-15', '8'),
        ]),
        armsShouldersDayB(i, {
          bicepsId: 'rosca_martelo', bicepsReps: '10-12',
          tricepsId: 'triceps_overhead_cabo', tricepsReps: '10-15',
          lateralId: 'elevacao_lateral', lateralReps: '12-15',
          posteriorId: 'elevacao_posterior', posteriorReps: '15-20',
        }),
      ],
    ));
  }

  // Week 23 — Deload
  weeks.push(makeDeloadWeek(23, 2, 'Deload 4', 'Recuperação ativa — preparar para bloco de intensificação.'));

  // Block 2C — Intensification (Weeks 24-26)
  for (let i = 0; i < 3; i++) {
    const rpeMap = ['8-8.5', '8.5-9', '9-9.5'];
    const isTestWeek = i === 2;
    const mainSets = isTestWeek ? 3 : 3 + (i > 0 ? 1 : 0);
    const mainReps = isTestWeek ? '1-2' : '2-4';

    weeks.push(week(
      i + 24, 2, 'Intensificação 2C', 'intensification',
      isTestWeek
        ? 'Semana de teste — single a RPE 9-9.5 para estimar e1RM.'
        : 'Intensificação — volume mínimo, intensidade alta. Acessórios apenas para manutenção.',
      false,
      [
        day('squat_emphasis', 'Lower: Squat Emphasis', [
          ex('agachamento_low_bar', mainSets, mainReps, rpeMap[i], isTestWeek ? 'Teste e1RM: single @ RPE 9-9.5' : undefined),
          ex('good_morning', 3, '6-8', '7'),
          ...(isTestWeek ? [] : [ex('hack_squat', 3, '8-10', '8')]),
        ]),
        day('bench_emphasis', 'Upper: Bench Emphasis', [
          ex('supino_wide_grip', mainSets, mainReps, rpeMap[i], isTestWeek ? 'Teste e1RM: single @ RPE 9-9.5' : undefined),
          ex('spoto_press', 2, '3-5', '7-8'),
          ex('remada_barra', 3, '6-8', '7'),
          ex('face_pull', 3, '15-20', '8'),
          ex('elevacao_lateral', 3, '12-15', '8'),
          ex('rosca', 3, '10-15', '8'),
          ex('triceps_testa', 3, '10-15', '8'),
        ]),
        day('arms_shoulders', 'Mini: Arms & Shoulders A', [
          ex('rosca_martelo', 3, '10-12', '8-9', undefined, 'A'),
          ex('triceps_overhead_cabo', 3, '10-15', '8-9', undefined, 'A'),
          ex('elevacao_lateral', 3, '12-15', '8-9', undefined, 'B'),
          ex('elevacao_posterior', 3, '15-20', '8-9', undefined, 'B'),
        ]),
        day('deadlift_emphasis', 'Lower: Deadlift Emphasis', [
          ex('deadlift_sumo', mainSets, mainReps, rpeMap[i], isTestWeek ? 'Teste e1RM: single @ RPE 9-9.5' : undefined),
          ex('block_deadlift', 3, '2-4', '7-8'),
          ...(isTestWeek ? [] : [ex('leg_press', 3, '10-12', '8')]),
        ]),
        day('bench_volume', 'Upper: Bench Volume', [
          ex('close_grip_bench', 3, '3-5', '7-8'),
          ex('db_press_flat', 3, '8-10', '8'),
          ex('remada_apoio_peito', 3, '8-10', '7-8'),
          ex('elevacao_lateral', 3, '12-15', '8'),
          ex('triceps_isolado', 3, '10-15', '8'),
          ex('rosca_martelo', 3, '10-15', '8'),
        ]),
        day('arms_shoulders', 'Mini: Arms & Shoulders B', [
          ex('rosca_martelo', 3, '10-12', '8-9', undefined, 'A'),
          ex('triceps_overhead_cabo', 3, '10-15', '8-9', undefined, 'A'),
          ex('elevacao_lateral', 3, '12-15', '8-9', undefined, 'B'),
          ex('elevacao_posterior', 3, '15-20', '8-9', undefined, 'B'),
        ]),
      ],
    ));
  }

  return weeks;
}

// ---------------------------------------------------------------------------
// MACROCYCLE 3 — Weeks 27-39: SECOND HYPERTROPHIC CYCLE
// ---------------------------------------------------------------------------

export function buildMac3(): PrescribedWeek[] {
  const weeks: PrescribedWeek[] = [];

  // Block 3A — Accumulation (Weeks 27-30)
  for (let i = 0; i < 4; i++) {
    weeks.push(week(
      i + 27, 3, 'Acumulação 3A', 'accumulation',
      'Segundo ciclo hipertrófico — volume acumulativo com variações (seated GM, leg press high&narrow). Início ligeiramente acima do Mac 1.',
      false,
      [
        accSquatDay(i, {
          mainSets: volScale4(4, i),
          gmId: 'seated_good_morning',
          gmReps: '8-10',
          quadCompound: 'leg_press',
          quadCompoundReps: '10-12',
        }),
        accBenchDay(i, {
          mainSets: volScale4(4, i),
          variationId: 'larsen_press',
          variationSets: 3,
          variationReps: '6-8',
        }),
        armsShouldersDayA(i, {
          bicepsId: 'rosca_scott', bicepsReps: '10-12',
          tricepsId: 'triceps_overhead_cabo', tricepsReps: '10-15',
          lateralId: 'elevacao_lateral', lateralReps: '12-15',
          posteriorId: 'face_pull_banda', posteriorReps: '15-20',
        }),
        accDeadliftDay(i, {
          mainSets: volScale4(3, i),
          secondaryId: 'front_squat',
          secondarySets: 3,
          secondaryReps: '5-8',
          gmId: 'seated_good_morning',
        }),
        accBenchVolDay(i, {
          variationId: 'feet_up_bench',
          variationSets: volScale4(3, i),
          variationReps: '6-8',
          dbPressId: 'db_press_inclinado',
          tricepsId: 'triceps_pulley',
          roscaId: 'rosca_martelo',
        }),
        armsShouldersDayB(i, {
          bicepsId: 'rosca_barra', bicepsReps: '10-12',
          tricepsId: 'triceps_pulley', tricepsReps: '10-15',
          lateralId: 'elevacao_lateral', lateralReps: '12-15',
          posteriorId: 'elevacao_posterior', posteriorReps: '15-20',
        }),
      ],
    ));
  }

  // Week 31 — Deload
  weeks.push(makeDeloadWeek(31, 3, 'Deload 5', 'Recuperação ativa — reduzir fadiga do bloco 3A.', {
    squat: day('squat_emphasis', 'Lower: Squat Emphasis (Deload)', [
      ex('agachamento_low_bar', 2, '5', '5-6'),
      ex('seated_good_morning', 2, '8', '5-6'),
      ex('leg_press', 2, '10', '5-6'),
    ]),
  }));

  // Block 3B — Accumulation 2 (Weeks 32-35)
  for (let i = 0; i < 4; i++) {
    weeks.push(week(
      i + 32, 3, 'Acumulação 3B', 'accumulation',
      'Segundo bloco acumulativo Mac 3 — pico de volume com variações. Carga progressiva em acessórios.',
      false,
      [
        accSquatDay(i, {
          mainSets: volScale4(4, i),
          gmId: 'good_morning',
          gmSets: volScale4(3, i),
          gmReps: '6-8',
          quadCompound: 'hack_squat',
          quadCompoundReps: '10-12',
          legExtSets: volScale4(3, i),
        }),
        accBenchDay(i, {
          mainSets: volScale4(4, i),
          variationId: 'close_grip_bench',
          variationSets: 3,
          variationReps: '5-7',
          rowSets: volScale4(3, i),
        }),
        armsShouldersDayA(i, {
          bicepsId: 'rosca_cabo', bicepsReps: '10-12',
          tricepsId: 'triceps_overhead_cabo', tricepsReps: '10-15',
          lateralId: 'elevacao_lateral', lateralReps: '12-15',
          posteriorId: 'face_pull_banda', posteriorReps: '15-20',
        }),
        accDeadliftDay(i, {
          mainSets: volScale4(4, i),
          secondaryId: 'pause_squat',
          secondarySets: 3,
          secondaryReps: '4-6',
          legPressId: 'leg_press',
          legPressSets: volScale4(3, i),
          gmId: 'good_morning',
        }),
        accBenchVolDay(i, {
          variationId: 'larsen_press',
          variationSets: volScale4(3, i),
          variationReps: '6-8',
          dbPressId: 'db_press_flat',
          rowId: 'remada_apoio_peito',
          rowSets: volScale4(3, i),
          tricepsId: 'triceps_testa',
          roscaId: 'rosca',
        }),
        armsShouldersDayB(i, {
          bicepsId: 'rosca_barra', bicepsReps: '10-12',
          tricepsId: 'triceps_pulley', tricepsReps: '10-15',
          lateralId: 'elevacao_lateral', lateralReps: '12-15',
          posteriorId: 'elevacao_posterior', posteriorReps: '15-20',
        }),
      ],
    ));
  }

  // Week 36 — Deload
  weeks.push(makeDeloadWeek(36, 3, 'Deload 6', 'Recuperação ativa — preparar para transmutação do Mac 3.'));

  // Block 3C — Transmutation (Weeks 37-39)
  for (let i = 0; i < 3; i++) {
    const rpeMap = ['8', '8-8.5', '8.5-9'];
    const mainSets = 4 + (i >= 1 ? 1 : 0);

    weeks.push(week(
      i + 37, 3, 'Transmutação 3C', 'transmutation',
      'Transmutação Mac 3 — redução de volume, aumento de intensidade. Variações competitivas pesadas.',
      false,
      [
        day('squat_emphasis', 'Lower: Squat Emphasis', [
          ex('agachamento_low_bar', mainSets, '3-5', rpeMap[i]),
          ex('pause_squat', 3, '3-5', '8'),
          ex('seated_good_morning', 3, '6-8', '7-8'),
          ex('leg_extension', 3, '12-15', '8'),
        ]),
        day('bench_emphasis', 'Upper: Bench Emphasis', [
          ex('supino_wide_grip', mainSets, '3-5', rpeMap[i]),
          ex('larsen_press', 3, '3-5', '8', 'Variação competitiva pesada'),
          ex('remada_barra', 3, '6-8', '7-8'),
          ex('db_press_inclinado', 3, '8-10', '8'),
          ex('face_pull', 3, '15-20', '8'),
          ex('elevacao_lateral', 3, '12-15', '8'),
          ex('rosca', 3, '10-15', '8'),
          ex('triceps_testa', 3, '10-15', '8'),
        ]),
        day('arms_shoulders', 'Mini: Arms & Shoulders A', [
          ex('rosca_scott', 3, '10-12', '8-9', undefined, 'A'),
          ex('triceps_overhead_cabo', 3, '10-15', '8-9', undefined, 'A'),
          ex('elevacao_lateral', 3, '12-15', '8-9', undefined, 'B'),
          ex('face_pull_banda', 3, '15-20', '8-9', undefined, 'B'),
        ]),
        day('deadlift_emphasis', 'Lower: Deadlift Emphasis', [
          ex('deadlift_sumo', mainSets, '3-5', rpeMap[i]),
          ex('deficit_deadlift_sumo', 3, '3-5', '7-8'),
          ex('leg_press', 3, '10-12', '8'),
          ex('good_morning', 3, '8-10', '7', 'Light'),
        ]),
        day('bench_volume', 'Upper: Bench Volume', [
          ex('close_grip_bench', 3, '4-6', '7-8'),
          ex('db_press_flat', 3, '8-10', '8'),
          ex('remada_apoio_peito', 3, '8-10', '8'),
          ex('elevacao_lateral', 3, '12-15', '8'),
          ex('triceps_pulley', 3, '10-12', '8'),
          ex('rosca_martelo', 3, '10-15', '8'),
        ]),
        day('arms_shoulders', 'Mini: Arms & Shoulders B', [
          ex('rosca_barra', 3, '10-12', '8-9', undefined, 'A'),
          ex('triceps_pulley', 3, '10-15', '8-9', undefined, 'A'),
          ex('elevacao_lateral', 3, '12-15', '8-9', undefined, 'B'),
          ex('elevacao_posterior', 3, '15-20', '8-9', undefined, 'B'),
        ]),
      ],
    ));
  }

  return weeks;
}

// ---------------------------------------------------------------------------
// MACROCYCLE 4 — Weeks 40-52: STRENGTH + REALIZATION
// ---------------------------------------------------------------------------

export function buildMac4(): PrescribedWeek[] {
  const weeks: PrescribedWeek[] = [];

  // Block 4A — Transmutation (Weeks 40-43)
  for (let i = 0; i < 4; i++) {
    const rpeMap = ['8', '8', '8-8.5', '8.5'];
    const mainSets = 4 + (i >= 2 ? 1 : 0);

    weeks.push(week(
      i + 40, 4, 'Transmutação 4A', 'transmutation',
      'Transmutação de força — intensidade moderada-alta com volume de manutenção (~8-10 sets/semana em acessórios).',
      false,
      [
        day('squat_emphasis', 'Lower: Squat Emphasis', [
          ex('agachamento_low_bar', mainSets, '3-5', rpeMap[i]),
          ex('good_morning', 3, '6-8', '7-8'),
          ex('hack_squat', 3, '8-10', '8'),
          ex('leg_extension', 3, '12-15', '8'),
        ]),
        day('bench_emphasis', 'Upper: Bench Emphasis', [
          ex('supino_wide_grip', mainSets, '3-5', rpeMap[i]),
          ex('spoto_press', 3, '3-5', '8'),
          ex('remada_barra', 3, '6-8', '7-8'),
          ex('db_press_inclinado', 3, '8-10', '8'),
          ex('face_pull', 3, '15-20', '8'),
          ex('elevacao_lateral', 3, '12-15', '8'),
          ex('rosca', 3, '10-15', '8'),
          ex('triceps_testa', 3, '10-15', '8'),
        ]),
        armsShouldersDayA(i),
        day('deadlift_emphasis', 'Lower: Deadlift Emphasis', [
          ex('deadlift_sumo', mainSets, '3-5', rpeMap[i]),
          ex('block_deadlift', 3, '3-5', '7-8'),
          ex('leg_press', 3, '10-12', '8'),
          ex('good_morning', 3, '8-10', '7', 'Light'),
        ]),
        day('bench_volume', 'Upper: Bench Volume', [
          ex('close_grip_bench', 3, '4-6', '7-8'),
          ex('db_press_flat', 3, '8-10', '8'),
          ex('remada_apoio_peito', 3, '8-10', '8'),
          ex('elevacao_lateral', 3, '12-15', '8'),
          ex('triceps_isolado', 3, '10-12', '8'),
          ex('rosca_martelo', 3, '10-15', '8'),
        ]),
        armsShouldersDayB(i),
      ],
    ));
  }

  // Week 44 — Deload
  weeks.push(makeDeloadWeek(44, 4, 'Deload 7', 'Recuperação ativa — preparar para intensificação final.'));

  // Block 4B — Intensification (Weeks 45-48)
  for (let i = 0; i < 4; i++) {
    const rpeMap = ['8.5', '8.5-9', '9', '9'];
    const armsRpeMap = ['8', '8.5', '9', '9'];
    const armsRpe = armsRpeMap[i];
    const mainSets = i < 2 ? 4 : 3;
    const mainReps = i < 2 ? '2-3' : '2';

    weeks.push(week(
      i + 45, 4, 'Intensificação 4B', 'intensification',
      'Intensificação — cargas próximas do máximo. Block deadlift pesado. Acessórios mínimos.',
      false,
      [
        day('squat_emphasis', 'Lower: Squat Emphasis', [
          ex('agachamento_low_bar', mainSets, mainReps, rpeMap[i]),
          ex('pause_squat', 2, '2-3', '8'),
          ex('good_morning', 3, '6-8', '7'),
        ]),
        day('bench_emphasis', 'Upper: Bench Emphasis', [
          ex('supino_wide_grip', mainSets, mainReps, rpeMap[i]),
          ex('spoto_press', 2, '2-3', '8'),
          ex('remada_barra', 3, '6-8', '7'),
          ex('face_pull', 3, '15-20', '8'),
          ex('elevacao_lateral', 3, '12-15', '8'),
          ex('rosca', 3, '10-15', '8'),
          ex('triceps_testa', 3, '10-15', '8'),
        ]),
        day('arms_shoulders', 'Mini: Arms & Shoulders A', [
          ex('rosca_inclinada', 3, '10-12', armsRpe, undefined, 'A'),
          ex('triceps_corda', 3, '12-15', armsRpe, undefined, 'A'),
          ex('elevacao_lateral', 3, '12-15', armsRpe, undefined, 'B'),
          ex('elevacao_posterior', 3, '15-20', armsRpe, undefined, 'B'),
        ]),
        day('deadlift_emphasis', 'Lower: Deadlift Emphasis', [
          ex('deadlift_sumo', mainSets, mainReps, rpeMap[i]),
          ex('block_deadlift', 3, '2', '8-9', 'Pesado'),
          ex('good_morning', 3, '8-10', '7', 'Light'),
        ]),
        day('bench_volume', 'Upper: Bench Volume', [
          ex('close_grip_bench', 3, '3-5', '7-8'),
          ex('db_press_flat', 3, '8-10', '7-8'),
          ex('remada_apoio_peito', 3, '8-10', '7'),
          ex('elevacao_lateral', 3, '12-15', '8'),
          ex('triceps_isolado', 3, '10-15', '8'),
          ex('rosca_martelo', 3, '10-15', '8'),
        ]),
        day('arms_shoulders', 'Mini: Arms & Shoulders B', [
          ex('rosca_scott', 3, '10-12', armsRpe, undefined, 'A'),
          ex('triceps_overhead_cabo', 3, '10-15', armsRpe, undefined, 'A'),
          ex('elevacao_lateral_cabo', 3, '12-15', armsRpe, undefined, 'B'),
          ex('face_pull', 3, '15-20', armsRpe, undefined, 'B'),
        ]),
      ],
    ));
  }

  // Week 49 — Deload
  weeks.push(makeDeloadWeek(49, 4, 'Deload 8', 'Recuperação ativa — preparar para semana de realização e teste.'));

  // Block 4C — Realization/Test (Weeks 50-52)

  // Week 50 — Openers (singles @ RPE 8)
  weeks.push(week(
    50, 4, 'Realização 4C', 'realization',
    'Semana de openers — singles a RPE 8 para calibrar cargas do teste.',
    false,
    [
      day('squat_emphasis', 'Lower: Squat Emphasis', [
        ex('agachamento_low_bar', 3, '1', '8', 'Openers: singles @ RPE 8'),
        ex('pause_squat', 2, '2', '7'),
        ex('good_morning', 2, '6-8', '7'),
      ]),
      day('bench_emphasis', 'Upper: Bench Emphasis', [
        ex('supino_wide_grip', 3, '1', '8', 'Openers: singles @ RPE 8'),
        ex('spoto_press', 2, '2', '7'),
        ex('remada_barra', 2, '6-8', '7'),
        ex('face_pull', 2, '15', '7'),
      ]),
      day('arms_shoulders', 'Mini: Arms & Shoulders A', [
        ex('rosca_inclinada', 2, '10-12', '7-8', undefined, 'A'),
        ex('triceps_corda', 2, '12-15', '7-8', undefined, 'A'),
        ex('elevacao_lateral', 2, '12-15', '7-8', undefined, 'B'),
        ex('elevacao_posterior', 2, '15-20', '7-8', undefined, 'B'),
      ]),
      day('deadlift_emphasis', 'Lower: Deadlift Emphasis', [
        ex('deadlift_sumo', 3, '1', '8', 'Openers: singles @ RPE 8'),
        ex('block_deadlift', 2, '2', '7'),
      ]),
      day('bench_volume', 'Upper: Bench Volume', [
        ex('close_grip_bench', 2, '3', '7'),
        ex('db_press_flat', 2, '8', '7'),
        ex('remada_apoio_peito', 2, '8', '7'),
      ]),
      day('arms_shoulders', 'Mini: Arms & Shoulders B', [
        ex('rosca_scott', 2, '10-12', '7-8', undefined, 'A'),
        ex('triceps_overhead_cabo', 2, '10-15', '7-8', undefined, 'A'),
        ex('elevacao_lateral_cabo', 2, '12-15', '7-8', undefined, 'B'),
        ex('face_pull', 2, '15-20', '7-8', undefined, 'B'),
      ]),
    ],
  ));

  // Week 51 — 1RM Test
  weeks.push(week(
    51, 4, 'Realização 4C', 'realization',
    'SEMANA DE TESTE — 1RM nos três levantamentos competitivos.',
    false,
    [
      day('squat_emphasis', 'Lower: 1RM Squat', [
        ex('agachamento_low_bar', 5, '1', '10', '1RM Test: aquecer progressivamente até máximo'),
      ]),
      day('bench_emphasis', 'Upper: 1RM Bench', [
        ex('supino_wide_grip', 5, '1', '10', '1RM Test: aquecer progressivamente até máximo'),
      ]),
      day('arms_shoulders', 'Mini: Arms & Shoulders A', [
        ex('rosca_inclinada', 2, '10-12', '7', undefined, 'A'),
        ex('triceps_corda', 2, '12-15', '7', undefined, 'A'),
        ex('elevacao_lateral', 2, '12-15', '7', undefined, 'B'),
        ex('elevacao_posterior', 2, '15-20', '7', undefined, 'B'),
      ]),
      day('deadlift_emphasis', 'Lower: 1RM Deadlift', [
        ex('deadlift_sumo', 5, '1', '10', '1RM Test: aquecer progressivamente até máximo'),
      ]),
      day('bench_volume', 'Upper: Recovery', [
        ex('db_press_flat', 2, '8', '6', 'Recuperação leve'),
        ex('remada_apoio_peito', 2, '8', '6'),
        ex('face_pull', 2, '15', '6'),
      ]),
      day('arms_shoulders', 'Mini: Arms & Shoulders B', [
        ex('rosca_scott', 2, '10-12', '7', undefined, 'A'),
        ex('triceps_overhead_cabo', 2, '10-15', '7', undefined, 'A'),
        ex('elevacao_lateral_cabo', 2, '12-15', '7', undefined, 'B'),
        ex('face_pull', 2, '15-20', '7', undefined, 'B'),
      ]),
    ],
  ));

  // Week 52 — Complete Deload / Transition
  weeks.push(makeDeloadWeek(52, 4, 'Transição', 'Semana de transição — deload completo. Recuperação total antes do próximo macrociclo ou off-season.'));

  return weeks;
}
