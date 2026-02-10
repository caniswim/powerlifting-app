import type { PersonalRecord } from '../../types';
import { getItem, setItem, KEYS } from './core';
import { getWorkouts } from './workoutRepository';

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

export function recalculateRecord(exerciseId: string): void {
  const workouts = getWorkouts();
  let best: PersonalRecord | null = null;

  for (const w of workouts) {
    for (const ex of w.exercises) {
      if (ex.exerciseId !== exerciseId) continue;
      for (const set of ex.sets) {
        if (!set.completed || set.weight <= 0) continue;
        if (!best || set.e1rm > best.e1rm) {
          best = {
            exerciseId,
            e1rm: set.e1rm,
            weight: set.weight,
            reps: set.reps,
            rpe: set.rpe,
            date: w.date,
          };
        }
      }
    }
  }

  const records = getRecords();
  const idx = records.findIndex((r) => r.exerciseId === exerciseId);
  if (best) {
    if (idx >= 0) {
      records[idx] = best;
    } else {
      records.push(best);
    }
  } else if (idx >= 0) {
    records.splice(idx, 1);
  }
  setItem(KEYS.RECORDS, records);
}
