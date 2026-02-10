import { KEYS, scheduleSyncToOPFS, setItem } from './core';
import { clearOPFS } from '../opfs';
import { getWorkouts } from './workoutRepository';
import { getRecords } from './recordRepository';
import { getProfile } from './profileRepository';
import { getCurrentWeek, getSessionIndex, ensureSessionIndexMigrated } from './sessionManager';

export function exportAllData(): string {
  return JSON.stringify({
    workouts: getWorkouts(),
    records: getRecords(),
    profile: getProfile(),
    currentWeek: getCurrentWeek(),
    sessionIndex: getSessionIndex(),
    exportDate: new Date().toISOString(),
  }, null, 2);
}

export function importData(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (data.workouts) setItem(KEYS.WORKOUTS, data.workouts);
    if (data.records) setItem(KEYS.RECORDS, data.records);
    if (data.profile) setItem(KEYS.PROFILE, data.profile);
    if (data.currentWeek) setItem(KEYS.CURRENT_WEEK, data.currentWeek);
    if (data.sessionIndex != null) {
      setItem(KEYS.SESSION_INDEX, data.sessionIndex);
    } else {
      // Migrate from currentWeek if sessionIndex is absent
      localStorage.removeItem(KEYS.SESSION_INDEX);
      ensureSessionIndexMigrated();
    }
    scheduleSyncToOPFS();
    return true;
  } catch {
    return false;
  }
}

export function resetAllData(): void {
  localStorage.removeItem(KEYS.WORKOUTS);
  localStorage.removeItem(KEYS.RECORDS);
  localStorage.removeItem(KEYS.PROFILE);
  localStorage.removeItem(KEYS.CURRENT_WEEK);
  localStorage.removeItem(KEYS.SESSION_INDEX);
  clearOPFS();
}
