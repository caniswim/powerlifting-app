import type { BodyweightEntry, WorkoutLog } from '../../types';
import { getExerciseName } from '../../domain/exerciseRegistry';
import { getProgram } from '../../data/program/programs';
import { getSessionData, getTotalSessions } from '../scheduling';
import {
  getActiveProgramId,
  getBodyweightEntries,
  getCurrentWeek,
  getLastCompletedWorkout,
  getPostSurveyForWorkout,
  getPreSurveyForWorkout,
  getProfile,
  getRecords,
  getSessionIndex,
  getWorkouts,
  getRestPainLogs,
  listRestPainByWeek,
} from '../storage/index';
import { gateLookbackWeeks } from '../../domain/painGate';
import { buildSessionDoc, weekIdFor } from './sessionRollup';
import { buildWeekDoc } from './weeklyRollup';
import { ROLLUP_SCHEMA_VERSION } from './rollupTypes';
import type { SessionDoc, WeekDoc } from './rollupTypes';

/** Quantos PRs cabem no documento de estado antes de virar ruído. */
const STATE_RECORD_LIMIT = 20;

const APP_VERSION = '1.3.0';

function round(n: number, places = 2): number {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}

function programOf(workout: WorkoutLog): string {
  return workout.programId ?? getActiveProgramId();
}

// ---------------------------------------------------------------------------
// athletes/{uid}
// ---------------------------------------------------------------------------

export function buildAthleteDoc(uid: string, email: string | null): Record<string, unknown> {
  const programId = getActiveProgramId();
  const program = getProgram(programId);

  return {
    uid,
    email: email ?? null,
    schemaVersion: ROLLUP_SCHEMA_VERSION,
    appVersion: APP_VERSION,
    updatedAt: new Date().toISOString(),
    profile: getProfile(),
    activeProgramId: programId,
    programName: program.name,
    totalWeeks: program.weeks.length,
    totalSessions: getTotalSessions(programId),
  };
}

// ---------------------------------------------------------------------------
// athletes/{uid}/state/current
// ---------------------------------------------------------------------------

function bodyweightAt(entries: BodyweightEntry[], daysAgo: number): BodyweightEntry | null {
  if (entries.length === 0) return null;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysAgo);
  const target = cutoff.toISOString().slice(0, 10);
  // O ponto mais recente que não passou da data alvo.
  const older = entries.filter((e) => e.date <= target);
  return older[older.length - 1] ?? entries[0];
}

function buildBodyweightState(): Record<string, unknown> {
  const entries = getBodyweightEntries();
  const latest = entries[entries.length - 1] ?? null;
  const d7 = bodyweightAt(entries, 7);
  const d28 = bodyweightAt(entries, 28);

  const trendKgPerWeek =
    latest && d28 && d28.date !== latest.date
      ? round(
          ((latest.weightKg - d28.weightKg) /
            Math.max(1, (Date.parse(latest.date) - Date.parse(d28.date)) / 86_400_000)) * 7,
        )
      : null;

  return {
    latest,
    d7,
    d28,
    trendKgPerWeek,
    dotsDelta28: latest?.dots != null && d28?.dots != null ? round(latest.dots - d28.dots) : null,
    n: entries.length,
  };
}

export function buildStateDoc(): Record<string, unknown> {
  const programId = getActiveProgramId();
  const sessionIndex = getSessionIndex(programId);
  const totalSessions = getTotalSessions(programId);
  const session = getSessionData(Math.min(sessionIndex, Math.max(0, totalSessions - 1)), programId);
  const last = getLastCompletedWorkout();
  const lastWorkout = last ? getWorkouts().find((w) => (w.completedAt ?? w.date) === last.date) : undefined;

  const records = getRecords()
    .slice()
    .sort((a, b) => b.e1rm - a.e1rm)
    .slice(0, STATE_RECORD_LIMIT)
    .map((r) => ({ ...r, name: getExerciseName(r.exerciseId) }));

  return {
    updatedAt: new Date().toISOString(),
    activeProgramId: programId,
    sessionIndex,
    currentWeek: getCurrentWeek(),
    totalSessions,
    programComplete: sessionIndex >= totalSessions,
    latestWeekId: session ? weekIdFor(programId, session.weekNumber) : null,
    nextSession: session
      ? {
          sessionIndex: session.sessionIndex,
          weekNumber: session.weekNumber,
          dayIndex: session.dayIndex,
          dayType: session.day.dayType,
          dayLabel: session.day.dayLabel,
          blockName: session.week.blockName,
          blockType: session.week.blockType,
          isDeload: session.week.isDeload,
        }
      : null,
    lastCompletedWorkout: lastWorkout
      ? {
          id: lastWorkout.id,
          date: lastWorkout.completedAt ?? lastWorkout.date,
          weekNumber: lastWorkout.weekNumber,
          dayType: lastWorkout.dayType,
        }
      : null,
    records,
    bodyweight: buildBodyweightState(),
  };
}

// ---------------------------------------------------------------------------
// Sessões
// ---------------------------------------------------------------------------

export function summarizeWorkout(workout: WorkoutLog): SessionDoc {
  return buildSessionDoc(
    workout,
    getProfile(),
    getPreSurveyForWorkout(workout.id),
    getPostSurveyForWorkout(workout.id),
    programOf(workout),
  );
}

export interface SessionPayload {
  workout: WorkoutLog;
  summary: SessionDoc;
}

export function buildSessionPayload(workoutId: string): SessionPayload | null {
  const workout = getWorkouts().find((w) => w.id === workoutId);
  if (!workout) return null;
  return { workout, summary: summarizeWorkout(workout) };
}

// ---------------------------------------------------------------------------
// Semanas
// ---------------------------------------------------------------------------

function workoutsOf(programId: string, weekNumber: number): WorkoutLog[] {
  return getWorkouts().filter(
    (w) => programOf(w) === programId && w.weekNumber === weekNumber,
  );
}

function weekDocOrNull(programId: string, weekNumber: number, prev: WeekDoc | null): WeekDoc | null {
  const program = getProgram(programId);
  const week = program.weeks.find((w) => w.weekNumber === weekNumber);
  if (!week) return null;

  const workouts = workoutsOf(programId, weekNumber);
  return buildWeekDoc(
    {
      programId,
      programName: program.name,
      week,
      workouts,
      sessions: workouts.map(summarizeWorkout),
      bodyweight: getBodyweightEntries(),
      restPainLogs: listRestPainByWeek(programId, weekNumber),
    },
    prev,
  );
}

/**
 * Rollup da semana.
 *
 * As semanas anteriores são recalculadas em CADEIA, e não só a imediatamente
 * anterior. Duas coisas dependem disso, e nenhuma delas cabe numa semana:
 *
 * - a janela de sessões do gate de dor (`PROGRAMA.md §1.2`), que atravessa a
 *   virada de semana e chega ao `WeekDoc` pelo `prev.gate.carry`;
 * - a linha `RETORNO`, que fala de semanas consecutivas limpas.
 *
 * `gateLookbackWeeks` sai da própria tabela do §1.2 — quantas semanas o gate
 * precisa enxergar para trás. Sai barato porque tudo vem do localStorage, e a
 * cadeia é curta: hoje são 3 semanas.
 */
export function buildWeekPayload(programId: string, weekNumber: number): WeekDoc | null {
  const from = Math.max(1, weekNumber - gateLookbackWeeks);
  let prev: WeekDoc | null = null;
  for (let w = from; w < weekNumber; w += 1) {
    const doc = weekDocOrNull(programId, w, prev);
    // Semana inexistente no programa não zera o histórico já acumulado.
    if (doc) prev = doc;
  }
  return weekDocOrNull(programId, weekNumber, prev);
}

// ---------------------------------------------------------------------------
// Peso corporal e PRs
// ---------------------------------------------------------------------------

export function buildBodyweightPayload(date: string): Record<string, unknown> | null {
  const entry = getBodyweightEntries().find((e) => e.date === date);
  if (!entry) return null;
  return { ...entry, updatedAt: new Date().toISOString() };
}

export function buildRecordPayload(exerciseId: string): Record<string, unknown> | null {
  const record = getRecords().find((r) => r.exerciseId === exerciseId);
  if (!record) return null;
  return { ...record, name: getExerciseName(exerciseId), updatedAt: new Date().toISOString() };
}

/** Tudo que existe localmente, para o "Reenviar tudo". */
export function enumerateEverything(): {
  workoutIds: string[];
  weeks: { programId: string; weekNumber: number }[];
  bodyweightDates: string[];
  exerciseIds: string[];
} {
  const workouts = getWorkouts();
  const weeks = new Map<string, { programId: string; weekNumber: number }>();
  for (const w of workouts) {
    const programId = programOf(w);
    weeks.set(`${programId}|${w.weekNumber}`, { programId, weekNumber: w.weekNumber });
  }
  // A semana que só tem dor fora de sessão não tem treino nenhum para enumerar,
  // e é justamente a semana que este campo existe para não perder: sem esta
  // passada, "Reenviar tudo" a deixaria de fora.
  for (const log of getRestPainLogs()) {
    weeks.set(`${log.programId}|${log.weekNumber}`, {
      programId: log.programId,
      weekNumber: log.weekNumber,
    });
  }

  return {
    workoutIds: workouts.map((w) => w.id),
    weeks: [...weeks.values()],
    bodyweightDates: getBodyweightEntries().map((e) => e.date),
    exerciseIds: getRecords().map((r) => r.exerciseId),
  };
}
