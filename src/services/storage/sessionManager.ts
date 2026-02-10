import { getItem, setItem, KEYS } from './core';
import { getWorkouts } from './workoutRepository';

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
  const clamped = Math.max(0, Math.min(207, index));
  setItem(KEYS.SESSION_INDEX, clamped);
  // Keep currentWeek in sync
  setItem(KEYS.CURRENT_WEEK, Math.floor(clamped / 4) + 1);
}

export function migrateSessionIndex(): void {
  const currentWeek = getItem<number>(KEYS.CURRENT_WEEK, 1);
  const workouts = getWorkouts().filter((w) => w.completed && w.weekNumber === currentWeek);

  const dayOrder: string[] = ['squat_emphasis', 'bench_emphasis', 'deadlift_emphasis', 'bench_volume'];
  let completedCount = 0;
  for (const dt of dayOrder) {
    if (workouts.some((w) => w.dayType === dt)) {
      completedCount++;
    } else {
      break;
    }
  }

  const sessionIndex = (currentWeek - 1) * 4 + completedCount;
  setItem(KEYS.SESSION_INDEX, Math.max(0, Math.min(207, sessionIndex)));
}

export function ensureSessionIndexMigrated(): void {
  if (localStorage.getItem(KEYS.SESSION_INDEX) !== null) return;
  migrateSessionIndex();
}
