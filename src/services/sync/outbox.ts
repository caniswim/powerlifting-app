/**
 * Fila de sincronização.
 *
 * A fila guarda **marcadores, não payloads**. `session:abc123` significa "a
 * sessão abc123 mudou"; o documento é reconstruído do estado local no momento
 * do envio. Consequências que sustentam o offline:
 *
 * - dez edições offline da mesma sessão viram UMA escrita, com o dado final;
 * - o replay é idempotente — reenviar o mesmo marcador não corrompe nada;
 * - a fila não cresce com o tamanho do dado, só com a quantidade de entidades.
 */

const OUTBOX_KEY = 'pl_sync_outbox';

export type DirtyKey =
  | `session:${string}`
  | `week:${string}`
  | `bodyweight:${string}`
  | `record:${string}`
  | 'athlete'
  | 'state';

export function sessionKey(workoutId: string): DirtyKey {
  return `session:${workoutId}`;
}

export function weekKey(programId: string, weekNumber: number): DirtyKey {
  return `week:${programId}|${weekNumber}`;
}

export function parseWeekKey(key: DirtyKey): { programId: string; weekNumber: number } | null {
  if (!key.startsWith('week:')) return null;
  const [programId, week] = key.slice(5).split('|');
  const weekNumber = Number(week);
  return programId && Number.isFinite(weekNumber) ? { programId, weekNumber } : null;
}

export function bodyweightKey(date: string): DirtyKey {
  return `bodyweight:${date}`;
}

export function recordKey(exerciseId: string): DirtyKey {
  return `record:${exerciseId}`;
}

export function readOutbox(): DirtyKey[] {
  try {
    const raw = localStorage.getItem(OUTBOX_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed.filter((k) => typeof k === 'string') as DirtyKey[]) : [];
  } catch {
    return [];
  }
}

function writeOutbox(keys: DirtyKey[]): void {
  try {
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(keys));
  } catch {
    // Quota estourada: perder a fila é aceitável — "Reenviar tudo" reconstroi.
  }
}

export function enqueue(...keys: DirtyKey[]): void {
  if (keys.length === 0) return;
  const set = new Set(readOutbox());
  const before = set.size;
  for (const key of keys) set.add(key);
  if (set.size !== before) writeOutbox([...set]);
}

export function dequeue(keys: DirtyKey[]): void {
  if (keys.length === 0) return;
  const done = new Set<string>(keys);
  writeOutbox(readOutbox().filter((k) => !done.has(k)));
}

export function clearOutbox(): void {
  writeOutbox([]);
}

export function pendingCount(): number {
  return readOutbox().length;
}
