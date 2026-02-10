import { useMemo } from 'react';
import { MAIN_LIFTS, isMainLift } from '../types.ts';
import type { E1rmDataPoint } from '../types.ts';
import type { WorkoutLog } from '../../../types/index.ts';

export function useE1rmChartData(filteredWorkouts: WorkoutLog[]): E1rmDataPoint[] {
  return useMemo(() => {
    const weekMap = new Map<number, E1rmDataPoint>();

    for (const workout of filteredWorkouts) {
      const wk = workout.weekNumber;
      if (!weekMap.has(wk)) {
        weekMap.set(wk, { week: wk, label: `S${wk}` });
      }
      const point = weekMap.get(wk)!;

      for (const exercise of workout.exercises) {
        if (!isMainLift(exercise.exerciseId)) continue;
        const best = exercise.sets
          .filter((s) => s.completed && s.e1rm > 0)
          .reduce((max, s) => (s.e1rm > max ? s.e1rm : max), 0);

        if (best > 0) {
          const current = point[exercise.exerciseId] ?? 0;
          if (best > current) {
            point[exercise.exerciseId] = best;
          }
        }
      }
    }

    return Array.from(weekMap.values()).sort((a, b) => a.week - b.week);
  }, [filteredWorkouts]);
}

// Re-export for components that need the constants
export { MAIN_LIFTS };
