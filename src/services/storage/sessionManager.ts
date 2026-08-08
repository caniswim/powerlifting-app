import { getItem, setItem, KEYS, OBSOLETE_KEYS } from './core';
import { getWorkouts, saveWorkouts } from './workoutRepository';
import { getSessionData, getTotalSessions } from '../scheduling';
import { DEFAULT_PROGRAM_ID, LEGACY_PROGRAM_ID, getProgram } from '../../data/program/programs';
import { getBodyweightEntries, saveBodyweightEntry, localDateKey } from './bodyweightRepository';
import { getProfile, saveProfile } from './profileRepository';

/** Versão atual do formato dos dados persistidos. */
export const SCHEMA_VERSION = 4;

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

/**
 * v2 -> v3: sai o feedback de IA embarcado, entra o peso corporal como série.
 *
 * A chave da API de IA é apagada — era um segredo parado no localStorage sem
 * nenhum consumidor. O escalar `profile.bodyweight` vira o primeiro ponto da
 * série para o histórico de DOTS não começar vazio.
 */
function migrateToV3(): void {
  for (const key of OBSOLETE_KEYS) {
    localStorage.removeItem(key);
  }

  if (getBodyweightEntries().length === 0) {
    const profile = getProfile();
    if (profile.bodyweight > 0) {
      saveBodyweightEntry({
        date: localDateKey(),
        weightKg: profile.bodyweight,
        note: 'Ponto inicial migrado do perfil',
      });
    }
  }
}

/**
 * v3 -> v4: perfil ganha `trainingMax`, o máximo em padrão de competição.
 *
 * Evolução de schema com default, não escrita arbitrária: o campo nasceu
 * opcional e instalações antigas ficariam sem ele. Sem o valor, o Bloco 1
 * prescreveria contra as marcas DECLARADAS (250/170/268) em vez das legais
 * (215/160/240) — ~16% de carga a mais no agachamento, em silêncio.
 *
 * ⚠️ O valor é marcado como `seed`, e a marca é o ponto: pré-preencher sem
 * marcar fazia `missingTrainingMaxRefs` nunca disparar, e então NADA forçava o
 * gate S3→S4 — as três semanas de calibração mediam algo que o produto não
 * consumia. Com `trainingMaxOrigin: 'seed'`, a trava trata o valor como AUSENTE
 * (nenhuma carga sugerida, gate visível) e ao mesmo tempo nenhum percentual cai
 * no 1RM de academia se algo o resolver.
 *
 * O seed vem de `baseline.md` §4 e é substituído pelo gate da semana 4, que
 * grava a mediana das três âncoras e marca a origem como `calibrado`. Perfil que
 * já tenha o campo não é tocado.
 */
function migrateToV4(): void {
  const profile = getProfile();
  if (profile.trainingMax !== undefined) return;
  saveProfile({
    ...profile,
    trainingMax: { squat: 215, bench: 160, deadlift: 240 },
    trainingMaxOrigin: 'seed',
  });
}

export function runMigrations(): void {
  const version = getItem<number>(KEYS.SCHEMA_VERSION, 0);
  if (version >= SCHEMA_VERSION) return;

  if (version < 2) migrateToV2();
  if (version < 3) migrateToV3();
  if (version < 4) migrateToV4();

  setItem(KEYS.SCHEMA_VERSION, SCHEMA_VERSION);
}

/** Mantido para compatibilidade com chamadas antigas. */
export function ensureSessionIndexMigrated(): void {
  runMigrations();
}
