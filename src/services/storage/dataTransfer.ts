import { KEYS, scheduleSyncToOPFS, setItem, getItem } from './core';
import { clearOPFS } from '../opfs';
import { getWorkouts } from './workoutRepository';
import { getRecords } from './recordRepository';
import { getProfile } from './profileRepository';
import { getCurrentWeek, getActiveProgramId, runMigrations, SCHEMA_VERSION } from './sessionManager';
import { getPreSurveys, getPostSurveys } from './surveyRepository';
import { getAllFeedback } from './feedbackRepository';

export function exportAllData(): string {
  return JSON.stringify({
    schemaVersion: SCHEMA_VERSION,
    workouts: getWorkouts(),
    records: getRecords(),
    profile: getProfile(),
    currentWeek: getCurrentWeek(),
    activeProgram: getActiveProgramId(),
    programProgress: getItem<Record<string, number>>(KEYS.PROGRAM_PROGRESS, {}),
    preSurveys: getPreSurveys(),
    postSurveys: getPostSurveys(),
    aiFeedback: getAllFeedback(),
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
    if (data.preSurveys) setItem(KEYS.PRE_SURVEYS, data.preSurveys);
    if (data.postSurveys) setItem(KEYS.POST_SURVEYS, data.postSurveys);
    if (data.aiFeedback) setItem(KEYS.AI_FEEDBACK, data.aiFeedback);

    if (data.programProgress) {
      setItem(KEYS.PROGRAM_PROGRESS, data.programProgress);
      if (data.activeProgram) setItem(KEYS.ACTIVE_PROGRAM, data.activeProgram);
      setItem(KEYS.SCHEMA_VERSION, data.schemaVersion ?? SCHEMA_VERSION);
    } else {
      // Backup anterior à v2: guarda o índice antigo e deixa a migração
      // carimbar os treinos e mover a posição para o programa legado.
      if (data.sessionIndex != null) {
        setItem(KEYS.SESSION_INDEX, data.sessionIndex);
      } else {
        localStorage.removeItem(KEYS.SESSION_INDEX);
      }
      localStorage.removeItem(KEYS.PROGRAM_PROGRESS);
      localStorage.removeItem(KEYS.SCHEMA_VERSION);
      runMigrations();
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
  localStorage.removeItem(KEYS.PRE_SURVEYS);
  localStorage.removeItem(KEYS.POST_SURVEYS);
  localStorage.removeItem(KEYS.AI_FEEDBACK);
  localStorage.removeItem(KEYS.API_KEY);
  localStorage.removeItem(KEYS.ACTIVE_PROGRAM);
  localStorage.removeItem(KEYS.PROGRAM_PROGRESS);
  localStorage.removeItem(KEYS.SCHEMA_VERSION);
  clearOPFS();
}
