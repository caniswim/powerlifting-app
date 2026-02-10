import type { MuscleGroup } from '../../types/index.ts';

export const MAIN_LIFTS = ['agachamento_low_bar', 'supino_wide_grip', 'deadlift_sumo'] as const;

export type MainLiftId = typeof MAIN_LIFTS[number];

export function isMainLift(id: string): id is MainLiftId {
  return (MAIN_LIFTS as readonly string[]).includes(id);
}

export interface E1rmDataPoint extends Partial<Record<MainLiftId, number>> {
  week: number;
  label: string;
}

export interface TotalDataPoint {
  week: number;
  label: string;
  total: number;
}

export interface VolumeBarDataPoint extends Partial<Record<MuscleGroup, number>> {
  week: number;
  label: string;
}

export interface PRRow {
  exerciseId: string;
  name: string;
  weight: number;
  reps: number;
  rpe: number;
  date: string;
  e1rm: number;
}
