import type { WorkoutLog, PersonalRecord, AthleteProfile } from '../types';

const KEYS = {
  WORKOUTS: 'pl_workouts',
  RECORDS: 'pl_records',
  PROFILE: 'pl_profile',
  CURRENT_WEEK: 'pl_current_week',
} as const;

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Workouts
export function getWorkouts(): WorkoutLog[] {
  return getItem<WorkoutLog[]>(KEYS.WORKOUTS, []);
}

export function saveWorkout(workout: WorkoutLog): void {
  const workouts = getWorkouts();
  const idx = workouts.findIndex((w) => w.id === workout.id);
  if (idx >= 0) {
    workouts[idx] = workout;
  } else {
    workouts.push(workout);
  }
  setItem(KEYS.WORKOUTS, workouts);
}

export function getWorkoutsByWeek(weekNumber: number): WorkoutLog[] {
  return getWorkouts().filter((w) => w.weekNumber === weekNumber);
}

// Personal Records
export function getRecords(): PersonalRecord[] {
  return getItem<PersonalRecord[]>(KEYS.RECORDS, []);
}

export function saveRecord(record: PersonalRecord): void {
  const records = getRecords();
  const idx = records.findIndex((r) => r.exerciseId === record.exerciseId);
  if (idx >= 0) {
    if (record.e1rm > records[idx].e1rm) {
      records[idx] = record;
    }
  } else {
    records.push(record);
  }
  setItem(KEYS.RECORDS, records);
}

export function getRecordForExercise(exerciseId: string): PersonalRecord | undefined {
  return getRecords().find((r) => r.exerciseId === exerciseId);
}

// Profile
const defaultProfile: AthleteProfile = {
  bodyweight: 84,
  squat1RM: 250,
  bench1RM: 170,
  deadlift1RM: 260,
  total: 680,
  dots: 0,
};

export function getProfile(): AthleteProfile {
  return getItem<AthleteProfile>(KEYS.PROFILE, defaultProfile);
}

export function saveProfile(profile: AthleteProfile): void {
  setItem(KEYS.PROFILE, profile);
}

// Current Week
export function getCurrentWeek(): number {
  return getItem<number>(KEYS.CURRENT_WEEK, 1);
}

export function setCurrentWeek(week: number): void {
  setItem(KEYS.CURRENT_WEEK, week);
}

// Export/Import
export function exportAllData(): string {
  return JSON.stringify({
    workouts: getWorkouts(),
    records: getRecords(),
    profile: getProfile(),
    currentWeek: getCurrentWeek(),
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
}

// Last weight used for an exercise
export function getLastWeightForExercise(exerciseId: string): number | null {
  const workouts = getWorkouts()
    .filter((w) => w.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      if (exercise.exerciseId === exerciseId) {
        const completedSets = exercise.sets.filter((s) => s.completed);
        if (completedSets.length > 0) {
          return completedSets[completedSets.length - 1].weight;
        }
      }
    }
  }
  return null;
}
