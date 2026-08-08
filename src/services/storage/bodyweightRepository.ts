import type { BodyweightEntry } from '../../types';
import { calculateDOTS } from '../../utils/calculations';
import { getItem, setItem, KEYS } from './core';
import { getProfile, saveProfile } from './profileRepository';

/** Data local no formato YYYY-MM-DD (não UTC — a pesagem é um evento local). */
export function localDateKey(d: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Série completa, do mais antigo para o mais recente. */
export function getBodyweightEntries(): BodyweightEntry[] {
  return getItem<BodyweightEntry[]>(KEYS.BODYWEIGHT, []).slice().sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Grava um ponto da série. Uma medição por dia: regravar a mesma data
 * sobrescreve. O DOTS é derivado aqui para o ponto ficar auto-contido —
 * comparar DOTS ao longo do tempo é o objetivo da série.
 */
export function saveBodyweightEntry(entry: BodyweightEntry): void {
  const profile = getProfile();
  const total = entry.total ?? profile.total ?? (profile.squat1RM + profile.bench1RM + profile.deadlift1RM);
  const complete: BodyweightEntry = {
    ...entry,
    total,
    dots: entry.dots ?? calculateDOTS(entry.weightKg, total),
  };

  const entries = getBodyweightEntries();
  const idx = entries.findIndex((e) => e.date === complete.date);
  if (idx >= 0) entries[idx] = complete;
  else entries.push(complete);

  entries.sort((a, b) => a.date.localeCompare(b.date));
  setItem(KEYS.BODYWEIGHT, entries);

  // O escalar do perfil segue sendo o "peso de hoje": mantém a UI e as
  // prescrições existentes funcionando sem conhecer a série.
  const latest = entries[entries.length - 1];
  if (latest.date === complete.date && profile.bodyweight !== complete.weightKg) {
    saveProfile({ ...profile, bodyweight: complete.weightKg, dots: calculateDOTS(complete.weightKg, total) });
  }
}

export function getLatestBodyweight(): BodyweightEntry | undefined {
  const entries = getBodyweightEntries();
  return entries[entries.length - 1];
}
