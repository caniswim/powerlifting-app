import { useMemo } from 'react';
import { exerciseNames } from '../../../data/exerciseMuscleMap.ts';
import type { PRRow } from '../types.ts';
import type { WorkoutLog, PersonalRecord } from '../../../types/index.ts';

export function usePRTableData(workouts: WorkoutLog[], records: PersonalRecord[]): PRRow[] {
  return useMemo(() => {
    const bestMap = new Map<string, PRRow>();

    for (const workout of workouts) {
      for (const exercise of workout.exercises) {
        for (const set of exercise.sets) {
          if (!set.completed || set.e1rm <= 0) continue;
          const existing = bestMap.get(exercise.exerciseId);
          if (!existing || set.e1rm > existing.e1rm) {
            bestMap.set(exercise.exerciseId, {
              exerciseId: exercise.exerciseId,
              name: exerciseNames[exercise.exerciseId] ?? exercise.exerciseId,
              weight: set.weight,
              reps: set.reps,
              rpe: set.rpe,
              date: workout.date,
              e1rm: set.e1rm,
            });
          }
        }
      }
    }

    for (const rec of records) {
      const existing = bestMap.get(rec.exerciseId);
      if (!existing || rec.e1rm > existing.e1rm) {
        bestMap.set(rec.exerciseId, {
          exerciseId: rec.exerciseId,
          name: exerciseNames[rec.exerciseId] ?? rec.exerciseId,
          weight: rec.weight,
          reps: rec.reps,
          rpe: rec.rpe,
          date: rec.date,
          e1rm: rec.e1rm,
        });
      }
    }

    return Array.from(bestMap.values()).sort((a, b) => b.e1rm - a.e1rm);
  }, [workouts, records]);
}
