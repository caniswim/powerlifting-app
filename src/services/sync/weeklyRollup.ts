import type {
  BodyweightEntry,
  PainRegion,
  PlanAdherence,
  PrescribedWeek,
  StrengthPerception,
  WorkoutLog,
} from '../../types';
import { prescribedWeeklyVolume } from '../../domain/volumeTargets';
import { painRegionLabels } from '../../domain/painRegions';
import {
  describePainGate,
  evaluatePainGate,
  painFlagDefault,
  painGateScope,
  PAIN_GATE,
} from '../../domain/painGate';
import type { GateReading } from '../../domain/painGate';
import { addSet, newRollupAcc, toRollup } from './complianceRollup';
import { ROLLUP_SCHEMA_VERSION } from './rollupTypes';
import type {
  Deviation,
  LiftTotals,
  SessionDoc,
  SurveyAverages,
  TopSetRef,
  WeekDoc,
  WeekSessionRow,
} from './rollupTypes';
import { emptyLiftTotals, isWorkingSet, liftOf, weekIdFor } from './sessionRollup';

export interface WeekInput {
  programId: string;
  programName: string;
  week: PrescribedWeek;
  /** Sessões da semana, já resumidas (ordenadas por data). */
  sessions: SessionDoc[];
  /** Logs crus das mesmas sessões — só o padrão de competição os usa. */
  workouts: WorkoutLog[];
  /** Série de peso corporal completa — a janela da semana é recortada aqui. */
  bodyweight: BodyweightEntry[];
}

const SURVEY_KEYS: (keyof SurveyAverages)[] = [
  'sleepQuality', 'sleepHours', 'energyLevel', 'stressLevel',
  'motivation', 'sessionQuality', 'sessionRPE', 'pumpRating',
];

function round(n: number, places = 1): number {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}

function avg(values: number[], places = 2): number {
  if (values.length === 0) return 0;
  return round(values.reduce((s, v) => s + v, 0) / values.length, places);
}

function dayOf(iso: string): string {
  return iso.slice(0, 10);
}

// ---------------------------------------------------------------------------
// Blocos do rollup
// ---------------------------------------------------------------------------

function buildAdherence(input: WeekInput): WeekDoc['adherence'] {
  const { week, sessions } = input;

  const setsPrescribed = week.days.reduce(
    (sum, day) => sum + day.exercises.reduce((s, ex) => s + ex.sets, 0),
    0,
  );
  const setsCompleted = sessions.reduce((s, sess) => s + sess.setsCompleted, 0);

  const skippedCount = new Map<string, { name: string; sessions: number }>();
  for (const sess of sessions) {
    for (const ex of sess.exercises) {
      if (!ex.skipped) continue;
      const entry = skippedCount.get(ex.exerciseId) ?? { name: ex.name, sessions: 0 };
      entry.sessions += 1;
      skippedCount.set(ex.exerciseId, entry);
    }
  }

  const planAdherence: Record<PlanAdherence, number> = { full: 0, partial: 0, none: 0 };
  for (const sess of sessions) {
    if (sess.post) planAdherence[sess.post.planAdherence] += 1;
  }

  return {
    sessionsPrescribed: week.days.length,
    sessionsCompleted: sessions.filter((s) => s.completed).length,
    setsPrescribed,
    setsCompleted,
    setsSkipped: Math.max(0, setsPrescribed - setsCompleted),
    completionPct: setsPrescribed > 0 ? round((setsCompleted / setsPrescribed) * 100) : 0,
    exercisesSkipped: [...skippedCount].map(([exerciseId, v]) => ({ exerciseId, ...v })),
    planAdherence,
  };
}

function buildTonnage(sessions: SessionDoc[]): WeekDoc['tonnage'] {
  const byLift: LiftTotals = emptyLiftTotals();
  const byExercise: Record<string, number> = {};
  let total = 0;

  for (const sess of sessions) {
    total += sess.tonnage;
    for (const key of Object.keys(byLift) as (keyof LiftTotals)[]) {
      byLift[key] += sess.tonnageByLift[key] ?? 0;
    }
    for (const ex of sess.exercises) {
      if (ex.tonnage > 0) byExercise[ex.exerciseId] = round((byExercise[ex.exerciseId] ?? 0) + ex.tonnage);
    }
  }

  for (const key of Object.keys(byLift) as (keyof LiftTotals)[]) byLift[key] = round(byLift[key]);
  return { total: round(total), byLift, byExercise };
}

function buildVolume(input: WeekInput): WeekDoc['volumeByMuscle'] {
  const actual: Record<string, number> = {};
  for (const sess of input.sessions) {
    for (const [muscle, sets] of Object.entries(sess.volumeByMuscle)) {
      actual[muscle] = round((actual[muscle] ?? 0) + sets, 2);
    }
  }

  const prescribed = prescribedWeeklyVolume(input.week) as Record<string, number>;
  const delta: Record<string, number> = {};
  for (const muscle of new Set([...Object.keys(actual), ...Object.keys(prescribed)])) {
    delta[muscle] = round((actual[muscle] ?? 0) - (prescribed[muscle] ?? 0), 2);
  }
  return { actual, prescribed, delta };
}

function buildTopE1rm(sessions: SessionDoc[], prev: WeekDoc | null): WeekDoc['topE1rm'] {
  const best = new Map<string, TopSetRef>();
  for (const sess of sessions) {
    for (const ex of sess.exercises) {
      if (!ex.topSet) continue;
      const current = best.get(ex.exerciseId);
      if (!current || ex.topSet.e1rm > current.e1rm) {
        best.set(ex.exerciseId, { ...ex.topSet, date: sess.date });
      }
    }
  }

  const result: WeekDoc['topE1rm'] = {};
  for (const [exerciseId, top] of best) {
    const before = prev?.topE1rm?.[exerciseId]?.e1rm;
    result[exerciseId] = {
      ...top,
      deltaPrevWeek: before !== undefined ? round(top.e1rm - before) : null,
    };
  }
  return result;
}

function buildSurveys(sessions: SessionDoc[], prev: WeekDoc | null): WeekDoc['surveys'] {
  const pre = sessions.map((s) => s.pre).filter((p): p is NonNullable<typeof p> => p != null);
  const post = sessions.map((s) => s.post).filter((p): p is NonNullable<typeof p> => p != null);

  const averages: SurveyAverages = {
    sleepQuality: avg(pre.map((p) => p.sleepQuality)),
    sleepHours: avg(pre.map((p) => p.sleepHours)),
    energyLevel: avg(pre.map((p) => p.energyLevel)),
    stressLevel: avg(pre.map((p) => p.stressLevel)),
    motivation: avg(pre.map((p) => p.motivation)),
    sessionQuality: avg(post.map((p) => p.sessionQuality)),
    sessionRPE: avg(post.map((p) => p.sessionRPE)),
    pumpRating: avg(post.map((p) => p.pumpRating ?? 0)),
  };

  const deltaPrevWeek: Partial<SurveyAverages> = {};
  if (prev && prev.surveys.n > 0) {
    for (const key of SURVEY_KEYS) {
      deltaPrevWeek[key] = round(averages[key] - (prev.surveys.averages[key] ?? 0), 2);
    }
  }

  // Mesma fórmula do indicador de prontidão da UI — um único conceito de
  // "prontidão" no app inteiro.
  const readinessScore = round(
    Math.max(0, Math.min(10,
      averages.sleepQuality * 0.3 + averages.energyLevel * 0.3
      + averages.motivation * 0.2 + (10 - averages.stressLevel) * 0.2,
    )),
  );

  const sRPELoad = sessions.reduce(
    (sum, s) => sum + (s.post ? s.post.sessionRPE * s.setsCompleted : 0),
    0,
  );

  const strengthPerception: Record<StrengthPerception, number> = { below: 0, normal: 0, above: 0 };
  for (const p of post) strengthPerception[p.strengthPerception] += 1;

  return {
    n: Math.max(pre.length, post.length),
    averages,
    deltaPrevWeek,
    readinessScore,
    sRPELoad: round(sRPELoad),
    strengthPerception,
  };
}

function buildPain(sessions: SessionDoc[]): WeekDoc['pain'] {
  const acc = new Map<PainRegion, { total: number; max: number; n: number; pre: boolean; post: boolean }>();

  const record = (region: PainRegion, intensity: number, phase: 'pre' | 'post') => {
    const entry = acc.get(region) ?? { total: 0, max: 0, n: 0, pre: false, post: false };
    entry.total += intensity;
    entry.max = Math.max(entry.max, intensity);
    entry.n += 1;
    entry[phase] = true;
    acc.set(region, entry);
  };

  for (const sess of sessions) {
    for (const p of sess.pre?.pain ?? []) record(p.region, p.intensity, 'pre');
    for (const p of sess.post?.newPain ?? []) record(p.region, p.intensity, 'post');
  }

  return [...acc]
    .map(([region, v]) => ({
      region,
      occurrences: v.n,
      maxIntensity: v.max,
      avgIntensity: round(v.total / v.n),
      source: (v.pre && v.post ? 'both' : v.pre ? 'pre' : 'post') as 'pre' | 'post' | 'both',
    }))
    .sort((a, b) => b.occurrences - a.occurrences || b.maxIntensity - a.maxIntensity);
}

/**
 * Padrão de competição a partir das séries cruas. Reagregar os totais já
 * resumidos por sessão perderia a média de pausa; contar do zero é exato e
 * custa uma passada por um punhado de séries.
 */
function buildCompliance(workouts: WorkoutLog[]): WeekDoc['compliance'] {
  const total = newRollupAcc();
  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      const lift = liftOf(exercise);
      for (const set of exercise.sets) {
        if (!isWorkingSet(set) || !set.completed) continue;
        addSet(total, set, lift);
      }
    }
  }
  return toRollup(total);
}

function buildBodyweight(input: WeekInput, first: string | null, last: string | null): WeekDoc['bodyweight'] {
  const empty = {
    n: 0, start: null, end: null, avg: null, deltaKg: null,
    dotsStart: null, dotsEnd: null, dotsDelta: null,
  };
  if (!first || !last) return empty;

  const inWeek = input.bodyweight.filter((e) => e.date >= first && e.date <= last);
  if (inWeek.length === 0) return empty;

  const start = inWeek[0];
  const end = inWeek[inWeek.length - 1];
  return {
    n: inWeek.length,
    start: start.weightKg,
    end: end.weightKg,
    avg: avg(inWeek.map((e) => e.weightKg)),
    deltaKg: round(end.weightKg - start.weightKg, 2),
    dotsStart: start.dots ?? null,
    dotsEnd: end.dots ?? null,
    dotsDelta: start.dots != null && end.dots != null ? round(end.dots - start.dots, 2) : null,
  };
}

/** Desvio médio por exercício, ponderado pelo número de séries de cada sessão. */
function buildDeviations(input: WeekInput, sessions: SessionDoc[]): Deviation[] {
  const prescribedSets = new Map<string, number>();
  for (const day of input.week.days) {
    for (const ex of day.exercises) {
      prescribedSets.set(ex.exerciseId, (prescribedSets.get(ex.exerciseId) ?? 0) + ex.sets);
    }
  }

  const acc = new Map<string, {
    name: string; sets: number;
    reps: { sum: number; n: number }; rpe: { sum: number; n: number }; load: { sum: number; n: number };
  }>();

  for (const sess of sessions) {
    for (const ex of sess.exercises) {
      const entry = acc.get(ex.exerciseId) ?? {
        name: ex.name, sets: 0,
        reps: { sum: 0, n: 0 }, rpe: { sum: 0, n: 0 }, load: { sum: 0, n: 0 },
      };
      entry.sets += ex.setsCompleted;
      if (ex.avgRepsDelta != null) { entry.reps.sum += ex.avgRepsDelta * ex.setsCompleted; entry.reps.n += ex.setsCompleted; }
      if (ex.avgRpeDelta != null) { entry.rpe.sum += ex.avgRpeDelta * ex.setsCompleted; entry.rpe.n += ex.setsCompleted; }
      if (ex.avgLoadDeltaPct != null) { entry.load.sum += ex.avgLoadDeltaPct * ex.setsCompleted; entry.load.n += ex.setsCompleted; }
      acc.set(ex.exerciseId, entry);
    }
  }

  const deviations: Deviation[] = [];
  for (const [exerciseId, v] of acc) {
    const avgReps = v.reps.n > 0 ? round(v.reps.sum / v.reps.n, 2) : null;
    const avgRpe = v.rpe.n > 0 ? round(v.rpe.sum / v.rpe.n, 2) : null;
    const avgLoad = v.load.n > 0 ? round(v.load.sum / v.load.n, 2) : null;
    const setsDelta = v.sets - (prescribedSets.get(exerciseId) ?? v.sets);

    // Ruído não vira linha do briefing: só entra desvio que muda decisão.
    const material =
      (avgReps !== null && Math.abs(avgReps) >= 1) ||
      (avgRpe !== null && Math.abs(avgRpe) >= 0.5) ||
      (avgLoad !== null && Math.abs(avgLoad) >= 3) ||
      setsDelta !== 0;
    if (!material) continue;

    deviations.push({
      exerciseId, name: v.name, sets: v.sets,
      avgRepsDelta: avgReps, avgRpeDelta: avgRpe, avgLoadDeltaPct: avgLoad, setsDelta,
    });
  }

  return deviations.sort((a, b) => Math.abs(b.avgLoadDeltaPct ?? 0) - Math.abs(a.avgLoadDeltaPct ?? 0));
}

function buildSessionRows(sessions: SessionDoc[]): WeekSessionRow[] {
  return sessions.map((s) => {
    const topSet = s.exercises.reduce<TopSetRef | null>(
      (best, ex) => (ex.topSet && (!best || ex.topSet.e1rm > best.e1rm) ? ex.topSet : best),
      null,
    );
    return {
      id: s.id,
      date: s.date,
      dayIndex: s.dayIndex,
      dayType: s.dayType,
      completed: s.completed,
      setsPrescribed: s.setsPrescribed,
      setsCompleted: s.setsCompleted,
      tonnage: s.tonnage,
      sessionRPE: s.post?.sessionRPE ?? null,
      sessionQuality: s.post?.sessionQuality ?? null,
      strengthPerception: s.post?.strengthPerception ?? null,
      planAdherence: s.post?.planAdherence ?? null,
      topSet,
    };
  });
}

function buildNotes(sessions: SessionDoc[]): WeekDoc['notes'] {
  const notes: WeekDoc['notes'] = [];
  for (const s of sessions) {
    if (s.notes) notes.push({ date: dayOf(s.date), dayType: s.dayType, text: s.notes });
    if (s.post?.notes) notes.push({ date: dayOf(s.date), dayType: s.dayType, text: s.post.notes });
    for (const ex of s.exercises) {
      if (ex.notes) notes.push({ date: dayOf(s.date), dayType: s.dayType, exerciseName: ex.name, text: ex.notes });
    }
  }
  return notes;
}

/**
 * Leitura de peitoral por sessão, para a janela do gate de §1.2.
 *
 * Uma sessão entra na lista só se colheu log de peitoral; é o que torna a janela
 * de "3 sessões de supino" contável sem o rollup precisar saber quais sessões
 * tinham supino. Os dois lados são somados no mesmo tecido — o pico da sessão é
 * o maior valor entre esquerdo e direito, pré e pós.
 */
function buildGateReadings(sessions: SessionDoc[]): GateReading[] {
  const out: GateReading[] = [];
  for (const sess of sessions) {
    const entries = [...(sess.pre?.pain ?? []), ...(sess.post?.newPain ?? [])]
      .filter((p) => painGateScope(p.region) === 'peitoral');
    if (entries.length === 0) continue;
    out.push({ date: dayOf(sess.date), peak: Math.max(...entries.map((p) => p.intensity)) });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Sinalizadores determinísticos. Não são julgamento — são onde olhar primeiro.
 * A conversa semanal decide o que fazer; isto só evita que algo passe batido.
 */
function buildFlags(doc: Omit<WeekDoc, 'flags'>, sessions: SessionDoc[]): string[] {
  const flags: string[] = [];
  const { adherence, compliance, surveys, pain, bodyweight } = doc;

  if (adherence.sessionsCompleted < adherence.sessionsPrescribed) {
    flags.push(`${adherence.sessionsCompleted}/${adherence.sessionsPrescribed} sessões concluídas`);
  }
  if (adherence.completionPct < 85 && adherence.setsPrescribed > 0) {
    flags.push(`aderência de séries em ${adherence.completionPct}%`);
  }

  const squat = compliance.byLift.squat;
  const failedDepth = (squat?.depth?.above_parallel ?? 0) + (squat?.depth?.at_parallel ?? 0);
  if (squat && failedDepth > 0) {
    flags.push(`profundidade: ${failedDepth} de ${squat.judgedSets || squat.sets} séries julgadas não passariam`);
  }
  if (squat && squat.judgedSets === 0 && squat.sets > 0) {
    flags.push(`agachamento sem nenhuma série julgada em padrão (${squat.sets} séries)`);
  }

  const bench = compliance.byLift.bench;
  if (bench && (bench.pausedSets ?? 0) > 0 && (bench.avgPauseSec ?? 0) < 0.8) {
    flags.push(`pausa média no supino em ${bench.avgPauseSec}s — abaixo do comando de competição`);
  }

  const dl = compliance.byLift.deadlift;
  if ((dl?.strapSets ?? 0) > 0) {
    flags.push(`strap usado em ${dl?.strapSets} séries de terra — proibido na IPF`);
  }
  if ((compliance.plates.thick_plastic ?? 0) > 0) {
    flags.push(`${compliance.plates.thick_plastic} séries com anilha grossa de plástico — carga não comparável à calibrada`);
  }

  const sleepDelta = surveys.deltaPrevWeek.sleepQuality;
  if (sleepDelta !== undefined && sleepDelta <= -1) {
    flags.push(`sono caiu ${Math.abs(sleepDelta)} vs semana anterior`);
  }
  if (surveys.n > 0 && surveys.averages.stressLevel >= 7) {
    flags.push(`estresse médio em ${surveys.averages.stressLevel}`);
  }

  // GATE DE PEITORAL — o limiar vem da tabela de PROGRAMA.md §1.2, não daqui.
  // Fica ANTES das outras linhas de dor: é o único item desta função que aponta
  // para uma ação já prescrita, e não para "olhe isto".
  const gate = evaluatePainGate(buildGateReadings(sessions));
  if (gate) flags.push(describePainGate(gate));

  for (const p of pain) {
    const scope = painGateScope(p.region);
    const label = painRegionLabels[p.region] ?? p.region;
    if (scope === 'peitoral') {
      // O degrau já saiu acima; aqui fica só o registro por lado, que o gate
      // agrega e portanto perderia.
      flags.push(`dor em ${label}: ${p.occurrences}×, pico ${p.maxIntensity}/10`);
    } else if (scope === 'ambiguo') {
      if (p.maxIntensity >= PAIN_GATE.limiarMinimo || p.occurrences >= painFlagDefault.occurrences) {
        flags.push(
          `dor em ${label}: ${p.occurrences}×, pico ${p.maxIntensity}/10 — ` +
            `a gaveta "Outro" não distingue peitoral; confirme a região antes de descartar o gate ${PAIN_GATE.secao}`,
        );
      }
    } else if (
      p.occurrences >= painFlagDefault.occurrences ||
      p.maxIntensity >= painFlagDefault.maxIntensity
    ) {
      flags.push(`dor em ${label}: ${p.occurrences}×, pico ${p.maxIntensity}/10`);
    }
  }

  if (bodyweight.dotsDelta != null && bodyweight.dotsDelta < -2) {
    flags.push(`DOTS caiu ${Math.abs(bodyweight.dotsDelta)} na semana`);
  }

  return flags;
}

// ---------------------------------------------------------------------------

/** Rollup semanal completo. Nenhum consumidor precisa reabrir os logs crus. */
export function buildWeekDoc(input: WeekInput, prev: WeekDoc | null = null): WeekDoc {
  const sessions = [...input.sessions].sort((a, b) => a.date.localeCompare(b.date));
  const dates = sessions.map((s) => dayOf(s.date)).sort();
  const firstDate = dates[0] ?? null;
  const lastDate = dates[dates.length - 1] ?? null;

  const base: Omit<WeekDoc, 'flags'> = {
    schemaVersion: ROLLUP_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    weekId: weekIdFor(input.programId, input.week.weekNumber),
    programId: input.programId,
    programName: input.programName,
    weekNumber: input.week.weekNumber,
    macrocycle: input.week.macrocycle,
    blockName: input.week.blockName,
    blockType: input.week.blockType,
    isDeload: input.week.isDeload,
    ...(input.week.weekLabel ? { weekLabel: input.week.weekLabel } : {}),
    firstDate,
    lastDate,
    adherence: buildAdherence(input),
    tonnage: buildTonnage(sessions),
    volumeByMuscle: buildVolume(input),
    topE1rm: buildTopE1rm(sessions, prev),
    surveys: buildSurveys(sessions, prev),
    pain: buildPain(sessions),
    compliance: buildCompliance(input.workouts),
    bodyweight: buildBodyweight(input, firstDate, lastDate),
    deviations: buildDeviations(input, sessions),
    sessions: buildSessionRows(sessions),
    notes: buildNotes(sessions),
  };

  return { ...base, flags: buildFlags(base, sessions) };
}
