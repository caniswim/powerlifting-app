import { useMemo } from 'react';
import { MAIN_LIFTS, isMainLift } from '../types.ts';
import type { TotalDataPoint } from '../types.ts';
import type { WorkoutLog } from '../../../types/index.ts';

export function useEstimatedTotal(filteredWorkouts: WorkoutLog[]): TotalDataPoint[] {
  return useMemo(() => {
    const weekBest = new Map<number, Record<string, number>>();

    for (const workout of filteredWorkouts) {
      const wk = workout.weekNumber;
      if (!weekBest.has(wk)) weekBest.set(wk, {});
      const bests = weekBest.get(wk)!;

      for (const exercise of workout.exercises) {
        if (!isMainLift(exercise.exerciseId)) continue;
        const best = exercise.sets
          .filter((s) => s.completed && s.e1rm > 0)
          .reduce((max, s) => (s.e1rm > max ? s.e1rm : max), 0);
        if (best > (bests[exercise.exerciseId] ?? 0)) {
          bests[exercise.exerciseId] = best;
        }
      }
    }

    // Carry forward last known values
    const lastKnown: Record<string, number> = {};
    const sorted = Array.from(weekBest.entries()).sort(([a], [b]) => a - b);
    const result: TotalDataPoint[] = [];

    for (const [wk, bests] of sorted) {
      for (const lift of MAIN_LIFTS) {
        if (bests[lift]) lastKnown[lift] = bests[lift];
      }
      const squat = lastKnown['agachamento_low_bar'] ?? 0;
      const bench = lastKnown['supino_wide_grip'] ?? 0;
      const dead = lastKnown['deadlift_sumo'] ?? 0;
      const total = squat + bench + dead;
      if (total > 0) {
        result.push({ week: wk, label: `S${wk}`, total: Math.round(total * 10) / 10 });
      }
    }

    return result;
  }, [filteredWorkouts]);
}
