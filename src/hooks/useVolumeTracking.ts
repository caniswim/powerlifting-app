import { useMemo } from 'react';
import { exerciseMuscleMap } from '../data/exerciseMuscleMap';
import { muscleGroupLabels } from '../domain/muscleGroupLabels';
import type { WorkoutLog, MuscleGroup } from '../types';

export interface VolumeData {
  muscleGroup: MuscleGroup;
  actual: number;
  label: string;
}

export function calculateWeeklyVolume(workouts: WorkoutLog[]): VolumeData[] {
  const volumeMap: Partial<Record<MuscleGroup, number>> = {};

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      const muscleMapping = exerciseMuscleMap[exercise.exerciseId];
      if (!muscleMapping) continue;

      // Aquecimento não é volume de trabalho. Séries unilaterais contam uma vez
      // por par (esquerda + direita), como manda a contagem usual de séries.
      const completedSets = exercise.sets.filter(
        (s) => s.completed && s.setType !== 'warmup',
      ).length;

      for (const [muscle, fraction] of Object.entries(muscleMapping)) {
        const mg = muscle as MuscleGroup;
        volumeMap[mg] = (volumeMap[mg] || 0) + completedSets * (fraction as number);
      }
    }
  }

  return Object.entries(muscleGroupLabels).map(([key, label]) => ({
    muscleGroup: key as MuscleGroup,
    actual: Math.round((volumeMap[key as MuscleGroup] || 0) * 10) / 10,
    label,
  }));
}

export function useVolumeTracking(workouts: WorkoutLog[]) {
  return useMemo(() => calculateWeeklyVolume(workouts), [workouts]);
}
