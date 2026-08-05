import { getItem, setItem, KEYS } from './core';
import { getWorkouts, saveWorkouts } from './workoutRepository';
import { getSessionData, getTotalSessions } from '../scheduling';
import { DEFAULT_PROGRAM_ID, LEGACY_PROGRAM_ID, getProgram } from '../../data/program/programs';

/** Versão atual do formato dos dados persistidos. */
export const SCHEMA_VERSION = 2;

/** Dias por semana do programa legado de 52 semanas (usado só na migração v1). */
const LEGACY_DAYS_PER_WEEK = 6;

type ProgramProgress = Record<string, number>;

// ---------------------------------------------------------------------------
// Programa ativo
// ---------------------------------------------------------------------------

export function getActiveProgramId(): string {
  return getItem<string>(KEYS.ACTIVE_PROGRAM, DEFAULT_PROGRAM_ID);
}

export function setActiveProgramId(programId: string): void {
  setItem(KEYS.ACTIVE_PROGRAM, programId);
  setCurrentWeek(weekNumberFor(getSessionIndex(programId), programId));
}

// ---------------------------------------------------------------------------
// Posição no programa
// ---------------------------------------------------------------------------

function readProgress(): ProgramProgress {
  return getItem<ProgramProgress>(KEYS.PROGRAM_PROGRESS, {});
}

function weekNumberFor(sessionIndex: number, programId: string): number {
  return getSessionData(sessionIndex, programId)?.weekNumber ?? 1;
}

export function getCurrentWeek(): number {
  return getItem<number>(KEYS.CURRENT_WEEK, 1);
}

export function setCurrentWeek(week: number): void {
  setItem(KEYS.CURRENT_WEEK, week);
}

export function getSessionIndex(programId?: string): number {
  const id = programId ?? getActiveProgramId();
  const progress = readProgress();
  return progress[id] ?? 0;
}

export function setSessionIndex(index: number, programId?: string): void {
  const id = programId ?? getActiveProgramId();
  // O índice pode chegar a `total` — é assim que o programa fica concluído.
  const clamped = Math.max(0, Math.min(getTotalSessions(id), index));
  setItem(KEYS.PROGRAM_PROGRESS, { ...readProgress(), [id]: clamped });
  if (id === getActiveProgramId()) {
    setCurrentWeek(weekNumberFor(Math.min(clamped, getTotalSessions(id) - 1), id));
  }
}

/** Volta o programa ativo para a primeira sessão, sem tocar no histórico. */
export function resetProgramPosition(programId?: string): void {
  setSessionIndex(0, programId);
}

// ---------------------------------------------------------------------------
// Migrações
// ---------------------------------------------------------------------------

/**
 * v0 -> v1: deriva o índice de sessão de `pl_current_week` + treinos concluídos.
 * Só roda para instalações antigas que nunca tiveram `pl_session_index`.
 */
export function migrateSessionIndex(): number {
  const currentWeek = getItem<number>(KEYS.CURRENT_WEEK, 1);
  const workouts = getWorkouts().filter((w) => w.completed && w.weekNumber === currentWeek);

  const dayOrder: string[] = [
    'squat_emphasis', 'bench_emphasis', 'arms_shoulders',
    'deadlift_emphasis', 'bench_volume', 'arms_shoulders',
  ];

  const typeCounts: Record<string, number> = {};
  for (const w of workouts) {
    typeCounts[w.dayType] = (typeCounts[w.dayType] || 0) + 1;
  }

  const usedCounts: Record<string, number> = {};
  let completedCount = 0;
  for (const dt of dayOrder) {
    usedCounts[dt] = (usedCounts[dt] || 0) + 1;
    if ((typeCounts[dt] || 0) >= usedCounts[dt]) {
      completedCount++;
    } else {
      break;
    }
  }

  const legacyTotal = getProgram(LEGACY_PROGRAM_ID).weeks.length * LEGACY_DAYS_PER_WEEK;
  const sessionIndex = (currentWeek - 1) * LEGACY_DAYS_PER_WEEK + completedCount;
  return Math.max(0, Math.min(legacyTotal - 1, sessionIndex));
}

/**
 * v1 -> v2: o app passa a ter mais de um programa.
 *
 * Todos os treinos já registrados vieram do programa de 52 semanas, então são
 * carimbados com `programId: 'legacy-52w'` — sem isso o Calendar marcaria dias
 * do programa novo como concluídos por coincidência de semana + tipo de dia.
 * A posição antiga migra para o progresso do programa legado e o Powerbuilding
 * 2.0 entra como programa ativo, começando na sessão 0.
 */
function migrateToV2(): void {
  const legacyIndex = localStorage.getItem(KEYS.SESSION_INDEX) !== null
    ? getItem<number>(KEYS.SESSION_INDEX, 0)
    : migrateSessionIndex();

  const workouts = getWorkouts();
  const stamped = workouts.map((w) => (w.programId ? w : { ...w, programId: LEGACY_PROGRAM_ID }));
  if (stamped.length > 0) saveWorkouts(stamped);

  const progress = readProgress();
  setItem(KEYS.PROGRAM_PROGRESS, {
    ...progress,
    [LEGACY_PROGRAM_ID]: legacyIndex,
    [DEFAULT_PROGRAM_ID]: progress[DEFAULT_PROGRAM_ID] ?? 0,
  });
  setItem(KEYS.ACTIVE_PROGRAM, DEFAULT_PROGRAM_ID);
  setCurrentWeek(weekNumberFor(progress[DEFAULT_PROGRAM_ID] ?? 0, DEFAULT_PROGRAM_ID));
}

export function runMigrations(): void {
  const version = getItem<number>(KEYS.SCHEMA_VERSION, 0);
  if (version >= SCHEMA_VERSION) return;

  if (version < 2) migrateToV2();

  setItem(KEYS.SCHEMA_VERSION, SCHEMA_VERSION);
}

/** Mantido para compatibilidade com chamadas antigas. */
export function ensureSessionIndexMigrated(): void {
  runMigrations();
}
