import { workoutInstants } from '../../domain/workoutTime';
import type {
  AthleteProfile,
  ExerciseLog,
  PercentRef,
  PostWorkoutSurvey,
  PreWorkoutSurvey,
  SetLog,
  WorkoutLog,
} from '../../types';
import { getExercise, getExerciseMuscleMap, getExerciseName } from '../../domain/exerciseRegistry';
import { resolveReferenceMax } from '../../domain/referenceMax';
import { parseTargetNumber } from '../../utils/calculations';
import { addSet, addSetToAcc, newRollupAcc, newAcc, toRollup, toTotals, type ComplianceAcc } from './complianceRollup';
import { ROLLUP_SCHEMA_VERSION } from './rollupTypes';
import type {
  ExerciseSummary,
  LiftTotals,
  PostSummary,
  PreSummary,
  SessionDoc,
  TopSetRef,
} from './rollupTypes';

export const LIFT_KEYS: (PercentRef | 'other')[] = ['squat', 'bench', 'deadlift', 'ohp', 'other'];

export function emptyLiftTotals(): LiftTotals {
  return { squat: 0, bench: 0, deadlift: 0, ohp: 0, other: 0 };
}

export function weekIdFor(programId: string, weekNumber: number): string {
  return `${programId}__w${String(weekNumber).padStart(2, '0')}`;
}

/** Aquecimento nunca é volume, tonelagem, PR nem padrão de competição. */
export function isWorkingSet(set: SetLog): boolean {
  return set.setType !== 'warmup';
}

export function liftOf(exercise: ExerciseLog): PercentRef | undefined {
  return exercise.percentRef ?? getExercise(exercise.exerciseId)?.percentRef;
}

function round(n: number, places = 1): number {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}

/** Carga levantada na série: soma os segmentos quando a série é fracionada. */
function setTonnage(set: SetLog): number {
  if (set.segments?.length) {
    return set.segments.reduce((sum, seg) => sum + seg.weight * (seg.reps || 0), 0);
  }
  return set.weight * (set.reps || 0);
}

/** Carga esperada quando o programa prescreve em %1RM. */
function expectedLoad(set: SetLog, lift: PercentRef | undefined, profile: AthleteProfile): number | null {
  const percent = set.prescribed?.percentMin;
  if (!percent || !lift) return null;
  const oneRM = resolveReferenceMax(profile, lift);
  return oneRM > 0 ? oneRM * percent : null;
}

interface Avg {
  sum: number;
  n: number;
}

function push(avg: Avg, value: number): void {
  avg.sum += value;
  avg.n += 1;
}

function mean(avg: Avg, places = 2): number | null {
  return avg.n > 0 ? round(avg.sum / avg.n, places) : null;
}

function summarizeExercise(
  exercise: ExerciseLog,
  profile: AthleteProfile,
  out: {
    tonnageByLift: LiftTotals;
    tonnageByExercise: Record<string, number>;
    volumeByMuscle: Record<string, number>;
    compliance: ReturnType<typeof newRollupAcc>;
  },
): ExerciseSummary {
  const lift = liftOf(exercise);
  const liftKey = lift ?? 'other';
  const muscleMap = getExerciseMuscleMap(exercise.exerciseId);

  const repsDelta: Avg = { sum: 0, n: 0 };
  const rpeDelta: Avg = { sum: 0, n: 0 };
  const loadDelta: Avg = { sum: 0, n: 0 };
  const exCompliance: ComplianceAcc = newAcc();

  let setsCompleted = 0;
  let tonnage = 0;
  let topSet: TopSetRef | null = null;

  for (const set of exercise.sets) {
    if (!isWorkingSet(set) || !set.completed) continue;
    setsCompleted += 1;

    const t = setTonnage(set);
    tonnage += t;

    for (const [muscle, fraction] of Object.entries(muscleMap)) {
      out.volumeByMuscle[muscle] = round((out.volumeByMuscle[muscle] ?? 0) + (fraction as number), 2);
    }

    addSet(out.compliance, set, lift);
    addSetToAcc(exCompliance, set);

    if (set.e1rm > 0 && (!topSet || set.e1rm > topSet.e1rm)) {
      topSet = {
        exerciseId: exercise.exerciseId,
        name: exercise.exerciseName,
        weight: set.weight,
        reps: set.reps,
        rpe: set.rpe,
        e1rm: set.e1rm,
        isPR: set.isPR,
      };
    }

    // --- desvios em relação ao prescrito ---
    const plan = set.prescribed;
    if (plan) {
      const targetReps = /AMRAP/i.test(plan.reps) ? 0 : parseTargetNumber(plan.reps);
      if (targetReps > 0 && set.unit !== 'seconds') push(repsDelta, set.reps - targetReps);

      const targetRPE = parseTargetNumber(plan.rpe ?? '');
      if (targetRPE > 0 && set.rpe > 0) push(rpeDelta, set.rpe - targetRPE);

      const expected = expectedLoad(set, lift, profile);
      if (expected && expected > 0 && set.weight > 0) {
        push(loadDelta, ((set.weight - expected) / expected) * 100);
      }
    }
  }

  out.tonnageByLift[liftKey] = round(out.tonnageByLift[liftKey] + tonnage);
  if (tonnage > 0) {
    out.tonnageByExercise[exercise.exerciseId] = round(
      (out.tonnageByExercise[exercise.exerciseId] ?? 0) + tonnage,
    );
  }

  return {
    exerciseId: exercise.exerciseId,
    name: exercise.exerciseName || getExerciseName(exercise.exerciseId),
    skipped: exercise.skipped === true,
    prescribed: {
      sets: exercise.prescribedSets,
      reps: exercise.prescribedReps,
      rpe: exercise.prescribedRPE,
      ...(exercise.percent1RM ? { percent1RM: exercise.percent1RM } : {}),
    },
    setsCompleted,
    tonnage: round(tonnage),
    topSet,
    avgRepsDelta: mean(repsDelta),
    avgRpeDelta: mean(rpeDelta),
    avgLoadDeltaPct: mean(loadDelta),
    compliance: toTotals(exCompliance, lift),
    ...(exercise.notes ? { notes: exercise.notes } : {}),
  };
}

function toPreSummary(pre: PreWorkoutSurvey | undefined): PreSummary | null {
  if (!pre || pre.skipped) return null;
  return {
    sleepQuality: pre.sleepQuality,
    sleepHours: pre.sleepHours,
    energyLevel: pre.energyLevel,
    stressLevel: pre.stressLevel,
    motivation: pre.motivation,
    pain: pre.painEntries ?? [],
    supplements: pre.supplements,
  };
}

function toPostSummary(post: PostWorkoutSurvey | undefined): PostSummary | null {
  if (!post || post.skipped) return null;
  return {
    sessionQuality: post.sessionQuality,
    sessionRPE: post.sessionRPE,
    strengthPerception: post.strengthPerception,
    planAdherence: post.planAdherence,
    ...(post.adherenceReason ? { adherenceReason: post.adherenceReason } : {}),
    newPain: post.painEntries ?? [],
    ...(post.pumpRating !== undefined ? { pumpRating: post.pumpRating } : {}),
    ...(post.notes ? { notes: post.notes } : {}),
  };
}

/**
 * Resumo de UMA sessão, agregado por exercício. É o nível intermediário: mais
 * detalhado que o rollup semanal, muito menor que o log cru.
 */
export function buildSessionDoc(
  workout: WorkoutLog,
  profile: AthleteProfile,
  pre: PreWorkoutSurvey | undefined,
  post: PostWorkoutSurvey | undefined,
  programId: string,
): SessionDoc {
  const out = {
    tonnageByLift: emptyLiftTotals(),
    tonnageByExercise: {} as Record<string, number>,
    volumeByMuscle: {} as Record<string, number>,
    compliance: newRollupAcc(),
  };

  const exercises = workout.exercises.map((ex) => summarizeExercise(ex, profile, out));

  const setsPrescribed = workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter(isWorkingSet).length,
    0,
  );
  const setsCompleted = exercises.reduce((sum, ex) => sum + ex.setsCompleted, 0);
  const tonnage = round(exercises.reduce((sum, ex) => sum + ex.tonnage, 0));

  const durationMin =
    // ANTES: `completedAt - startedAt`, que mede o tempo entre ABRIR e FECHAR a
    // tela. Sessão aberta 16/08 e fechada 17/08 saía com 1.995 min (33 h), e 4
    // das 7 sessões do bloco 1 passaram de 13 h por esse caminho. Agora mede de
    // primeira a última série; sem carimbo, `null` — ausente é melhor que falso.
    workoutInstants(workout).durationMin !== null
      ? workoutInstants(workout).durationMin
      : null;

  return {
    schemaVersion: ROLLUP_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    id: workout.id,
    date: workout.date,
    programId,
    weekId: weekIdFor(programId, workout.weekNumber),
    weekNumber: workout.weekNumber,
    macrocycle: workout.macrocycle,
    dayIndex: workout.dayIndex ?? 0,
    dayType: workout.dayType,
    blockName: workout.blockName,
    blockType: workout.blockType,
    completed: workout.completed,
    ...(workout.startedAt ? { startedAt: workout.startedAt } : {}),
    ...(workout.completedAt ? { completedAt: workout.completedAt } : {}),
    durationMin: durationMin !== null && durationMin >= 0 && durationMin < 600 ? durationMin : null,
    setsPrescribed,
    setsCompleted,
    tonnage,
    tonnageByLift: out.tonnageByLift,
    volumeByMuscle: out.volumeByMuscle,
    exercises,
    compliance: toRollup(out.compliance),
    pre: toPreSummary(pre),
    post: toPostSummary(post),
    ...(workout.notes ? { notes: workout.notes } : {}),
  };
}
