/**
 * Caminhos dos documentos no Firestore.
 *
 * ⚠️ `scripts/weekly-briefing.mjs` repete estas mesmas strings — é um script
 * Node puro e não importa TypeScript. Mexeu aqui, mexa lá, e atualize
 * `docs/firestore-schema.md` §1.
 */

export const ATHLETES = 'athletes';

export function athletePath(uid: string): string {
  return `${ATHLETES}/${uid}`;
}

export function statePath(uid: string): string {
  return `${ATHLETES}/${uid}/state/current`;
}

export function weeksPath(uid: string): string {
  return `${ATHLETES}/${uid}/weeks`;
}

export function weekPath(uid: string, weekId: string): string {
  return `${weeksPath(uid)}/${weekId}`;
}

export function sessionsPath(uid: string): string {
  return `${ATHLETES}/${uid}/sessions`;
}

export function sessionPath(uid: string, workoutId: string): string {
  return `${sessionsPath(uid)}/${workoutId}`;
}

/** Log cru completo — só para cavar uma sessão ou restaurar o app. */
export function sessionRawPath(uid: string, workoutId: string): string {
  return `${sessionPath(uid, workoutId)}/raw/log`;
}

export function bodyweightPath(uid: string, date: string): string {
  return `${ATHLETES}/${uid}/bodyweight/${date}`;
}

export function recordPath(uid: string, exerciseId: string): string {
  return `${ATHLETES}/${uid}/records/${exerciseId}`;
}

/** Ids de exercício podem conter qualquer coisa; `/` quebraria o caminho. */
export function safeDocId(raw: string): string {
  return raw.replace(/[/\\]/g, '_');
}
