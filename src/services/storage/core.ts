import { writeToOPFS } from '../opfs';

export const KEYS = {
  WORKOUTS: 'pl_workouts',
  RECORDS: 'pl_records',
  PROFILE: 'pl_profile',
  CURRENT_WEEK: 'pl_current_week',
  SESSION_INDEX: 'pl_session_index',
  PRE_SURVEYS: 'pl_pre_surveys',
  POST_SURVEYS: 'pl_post_surveys',
  AI_FEEDBACK: 'pl_ai_feedback',
  API_KEY: 'pl_api_key',
  /** Id do programa ativo. */
  ACTIVE_PROGRAM: 'pl_active_program',
  /** Posição por programa: Record<programId, sessionIndex>. */
  PROGRAM_PROGRESS: 'pl_program_progress',
  /** Versão do formato dos dados persistidos. */
  SCHEMA_VERSION: 'pl_schema_version',
} as const;

export const ALL_KEYS = Object.values(KEYS);

// ---------------------------------------------------------------------------
// OPFS sync (debounced — writes at most once every 2s)
// ---------------------------------------------------------------------------

let syncTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleSyncToOPFS(): void {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    const snapshot: Record<string, string | null> = {};
    for (const key of ALL_KEYS) {
      snapshot[key] = localStorage.getItem(key);
    }
    writeToOPFS(JSON.stringify(snapshot));
  }, 2_000);
}

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

export function getItem<T>(key: string, fallback: T, validate?: (data: unknown) => data is T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (validate && !validate(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
  scheduleSyncToOPFS();
}
