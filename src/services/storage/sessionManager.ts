import { getItem, setItem, KEYS } from './core';
import { getWorkouts } from './workoutRepository';
import { DAYS_PER_WEEK, TOTAL_SESSIONS } from '../scheduling';

export function getCurrentWeek(): number {
  return getItem<number>(KEYS.CURRENT_WEEK, 1);
}

export function setCurrentWeek(week: number): void {
  setItem(KEYS.CURRENT_WEEK, week);
}

export function getSessionIndex(): number {
  return getItem<number>(KEYS.SESSION_INDEX, 0);
}

export function setSessionIndex(index: number): void {
  const clamped = Math.max(0, Math.min(TOTAL_SESSIONS - 1, index));
  setItem(KEYS.SESSION_INDEX, clamped);
  // Keep currentWeek in sync
  setItem(KEYS.CURRENT_WEEK, Math.floor(clamped / DAYS_PER_WEEK) + 1);
}

export function migrateSessionIndex(): void {
  const currentWeek = getItem<number>(KEYS.CURRENT_WEEK, 1);
  const workouts = getWorkouts().filter((w) => w.completed && w.weekNumber === currentWeek);

  const dayOrder: string[] = ['squat_emphasis', 'bench_emphasis', 'arms_shoulders', 'deadlift_emphasis', 'bench_volume', 'arms_shoulders'];

  // Count how many of each dayType have been completed
  const typeCounts: Record<string, number> = {};
  for (const w of workouts) {
    typeCounts[w.dayType] = (typeCounts[w.dayType] || 0) + 1;
  }

  // Walk through dayOrder, consuming counts to handle duplicate arms_shoulders
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

  const sessionIndex = (currentWeek - 1) * DAYS_PER_WEEK + completedCount;
  setItem(KEYS.SESSION_INDEX, Math.max(0, Math.min(TOTAL_SESSIONS - 1, sessionIndex)));
}

export function ensureSessionIndexMigrated(): void {
  if (localStorage.getItem(KEYS.SESSION_INDEX) !== null) return;
  migrateSessionIndex();
}
