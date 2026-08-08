import { getFirebase, isFirebaseConfigured } from '../firebase/config';
import {
  athletePath,
  bodyweightPath,
  recordPath,
  safeDocId,
  sessionPath,
  sessionRawPath,
  statePath,
  weekPath,
} from '../firebase/paths';
import {
  bodyweightKey,
  clearOutbox,
  dequeue,
  enqueue,
  parseWeekKey,
  readOutbox,
  recordKey,
  sessionKey,
  weekKey,
  type DirtyKey,
} from './outbox';
import {
  buildAthleteDoc,
  buildBodyweightPayload,
  buildRecordPayload,
  buildSessionPayload,
  buildStateDoc,
  buildWeekPayload,
  enumerateEverything,
} from './documentBuilders';
import { weekIdFor } from './sessionRollup';

/**
 * Motor de sincronização local → Firestore.
 *
 * Direção única de propósito: o localStorage é a fonte de escrita, o Firestore
 * é o armazém de leitura da revisão semanal. Um pull automático exigiria
 * resolução de conflito entre dispositivos — complexidade sem benefício para um
 * único atleta. Restauração continua sendo o export/import JSON.
 */

const LAST_SYNC_KEY = 'pl_sync_last';
const DEBOUNCE_MS = 4_000;
const INTERVAL_MS = 5 * 60_000;

export interface SyncStatus {
  configured: boolean;
  signedIn: boolean;
  email: string | null;
  syncing: boolean;
  pending: number;
  lastSyncAt: string | null;
  lastError: string | null;
}

let signedIn = false;
let email: string | null = null;
let syncing = false;
let lastError: string | null = null;
let started = false;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const listeners = new Set<(status: SyncStatus) => void>();

export function getSyncStatus(): SyncStatus {
  return {
    configured: isFirebaseConfigured(),
    signedIn,
    email,
    syncing,
    pending: readOutbox().length,
    lastSyncAt: localStorage.getItem(LAST_SYNC_KEY),
    lastError,
  };
}

export function subscribeSync(listener: (status: SyncStatus) => void): () => void {
  listeners.add(listener);
  listener(getSyncStatus());
  return () => listeners.delete(listener);
}

function notify(): void {
  const status = getSyncStatus();
  for (const listener of listeners) listener(status);
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

/**
 * O Firestore rejeita `undefined`. Os rollups são montados com spreads
 * condicionais, mas os logs crus vêm de anos de dados — sanear é mais barato
 * que confiar.
 */
function sanitize<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => sanitize(v)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === undefined) continue;
      out[k] = sanitize(v);
    }
    return out as T;
  }
  return value;
}

// ---------------------------------------------------------------------------
// Marcação de sujeira
// ---------------------------------------------------------------------------

export function markDirty(...keys: DirtyKey[]): void {
  if (!isFirebaseConfigured()) return;
  enqueue(...keys);
  notify();
  scheduleFlush();
}

export const dirty = { sessionKey, weekKey, bodyweightKey, recordKey };

function scheduleFlush(): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    void flush();
  }, DEBOUNCE_MS);
}

/** Reenfileira tudo que existe localmente. Usado após import ou bump de schema. */
export function markEverythingDirty(): void {
  if (!isFirebaseConfigured()) return;
  const all = enumerateEverything();
  const keys: DirtyKey[] = ['athlete', 'state'];
  for (const id of all.workoutIds) keys.push(sessionKey(id));
  for (const w of all.weeks) keys.push(weekKey(w.programId, w.weekNumber));
  for (const date of all.bodyweightDates) keys.push(bodyweightKey(date));
  for (const id of all.exerciseIds) keys.push(recordKey(id));
  markDirty(...keys);
}

// ---------------------------------------------------------------------------
// Escrita
// ---------------------------------------------------------------------------

interface Write {
  path: string;
  data: Record<string, unknown>;
}

function writesFor(key: DirtyKey, uid: string, userEmail: string | null): Write[] {
  if (key === 'athlete') {
    return [{ path: athletePath(uid), data: buildAthleteDoc(uid, userEmail) }];
  }
  if (key === 'state') {
    return [{ path: statePath(uid), data: buildStateDoc() }];
  }

  if (key.startsWith('session:')) {
    const workoutId = key.slice('session:'.length);
    const payload = buildSessionPayload(workoutId);
    if (!payload) return [];
    return [
      { path: sessionPath(uid, safeDocId(workoutId)), data: payload.summary as unknown as Record<string, unknown> },
      {
        path: sessionRawPath(uid, safeDocId(workoutId)),
        data: { workout: payload.workout, updatedAt: new Date().toISOString() },
      },
    ];
  }

  if (key.startsWith('week:')) {
    const parsed = parseWeekKey(key);
    if (!parsed) return [];
    const doc = buildWeekPayload(parsed.programId, parsed.weekNumber);
    if (!doc) return [];
    return [{
      path: weekPath(uid, weekIdFor(parsed.programId, parsed.weekNumber)),
      data: doc as unknown as Record<string, unknown>,
    }];
  }

  if (key.startsWith('bodyweight:')) {
    const date = key.slice('bodyweight:'.length);
    const data = buildBodyweightPayload(date);
    return data ? [{ path: bodyweightPath(uid, date), data }] : [];
  }

  if (key.startsWith('record:')) {
    const exerciseId = key.slice('record:'.length);
    const data = buildRecordPayload(exerciseId);
    return data ? [{ path: recordPath(uid, safeDocId(exerciseId)), data }] : [];
  }

  return [];
}

/** Envia a fila. Falha de rede só mantém os marcadores — nada é perdido. */
export async function flush(): Promise<void> {
  if (syncing || !isFirebaseConfigured()) return;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return;

  const keys = readOutbox();
  if (keys.length === 0) return;

  const fb = await getFirebase();
  const user = fb?.auth.currentUser;
  if (!fb || !user) return;

  syncing = true;
  notify();

  const { doc, setDoc } = await import('firebase/firestore');
  const done: DirtyKey[] = [];
  let failure: string | null = null;

  try {
    for (const key of keys) {
      // Um marcador problemático não pode travar a fila inteira atrás dele:
      // falha isolada mantém só aquele marcador enfileirado.
      try {
        for (const write of writesFor(key, user.uid, user.email)) {
          await setDoc(doc(fb.db, write.path), sanitize(write.data));
        }
        done.push(key);
      } catch (error) {
        failure = errorMessage(error);
      }
    }
    lastError = failure;
    if (done.length > 0) localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
  } finally {
    dequeue(done);
    syncing = false;
    notify();
  }
}

export async function flushNow(): Promise<void> {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  await flush();
}

// ---------------------------------------------------------------------------
// Autenticação
// ---------------------------------------------------------------------------

export async function signIn(userEmail: string, password: string): Promise<void> {
  const fb = await getFirebase();
  if (!fb) throw new Error('Firebase não configurado (.env ausente)');
  const { signInWithEmailAndPassword } = await import('firebase/auth');
  await signInWithEmailAndPassword(fb.auth, userEmail.trim(), password);
  markDirty('athlete', 'state');
  await flushNow();
}

export async function signOutCloud(): Promise<void> {
  const fb = await getFirebase();
  if (!fb) return;
  const { signOut } = await import('firebase/auth');
  await signOut(fb.auth);
}

// ---------------------------------------------------------------------------
// Ciclo de vida
// ---------------------------------------------------------------------------

export async function initSync(): Promise<void> {
  if (started || !isFirebaseConfigured()) return;
  started = true;

  const fb = await getFirebase();
  if (!fb) return;

  const { onAuthStateChanged } = await import('firebase/auth');
  onAuthStateChanged(fb.auth, (user) => {
    signedIn = user !== null;
    email = user?.email ?? null;
    notify();
    if (user) void flush();
  });

  window.addEventListener('online', () => void flush());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void flush();
  });
  setInterval(() => void flush(), INTERVAL_MS);
}

/** Esvazia a fila sem enviar — só para sair de um estado corrompido. */
export function discardQueue(): void {
  clearOutbox();
  notify();
}
