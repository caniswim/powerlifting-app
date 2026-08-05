import type { BlockType } from '../types';

export function calculateE1RM(weight: number, reps: number, rpe: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  const rir = 10 - rpe;
  const effectiveReps = reps + rir;
  return Math.round(weight * (1 + 0.0333 * effectiveReps) * 10) / 10;
}

export function calculateDOTS(bodyweight: number, total: number, isMale = true): number {
  if (bodyweight <= 0 || total <= 0) return 0;

  const coefficients = isMale
    ? [-307.75076, 24.0900756, -0.1918759221, 0.0007391293, -0.000001093]
    : [-57.96288, 13.6175032, -0.1126655495, 0.0005158568, -0.0000010706];

  const bw = bodyweight;
  const denominator =
    coefficients[0] +
    coefficients[1] * bw +
    coefficients[2] * bw ** 2 +
    coefficients[3] * bw ** 3 +
    coefficients[4] * bw ** 4;

  return Math.round((500 / denominator) * total * 100) / 100;
}

export function getWeekRPEProgression(weekInBlock: number, blockType: BlockType): number {
  if (blockType === 'deload') return 5.5;
  const baseMap: Record<Exclude<BlockType, 'deload'>, number[]> = {
    accumulation: [7, 7.5, 8, 8.5],
    transmutation: [8, 8, 8.5, 8.5],
    intensification: [8.5, 8.5, 9, 9],
    realization: [8, 9, 9.5, 6],
  };
  const progression = baseMap[blockType];
  return progression[Math.min(weekInBlock, progression.length - 1)];
}

export interface ExercisePerformance {
  weight: number;
  reps: number;
  rpe: number;
  e1rm: number;
  date: string;
}

export interface LoadSuggestion {
  weight: number;
  basedOnE1RM: number;
  sessionsUsed: number;
}

const WEIGHTED_AVERAGES: Record<number, number[]> = {
  1: [1],
  2: [0.6, 0.4],
  3: [0.5, 0.3, 0.2],
};

export function estimateE1RMWeighted(performances: ExercisePerformance[]): number {
  if (performances.length === 0) return 0;
  if (performances.length === 1) return performances[0].e1rm;

  const weights = WEIGHTED_AVERAGES[Math.min(performances.length, 3)] || WEIGHTED_AVERAGES[3];
  let sum = 0;
  let totalWeight = 0;
  for (let i = 0; i < Math.min(performances.length, 3); i++) {
    sum += performances[i].e1rm * weights[i];
    totalWeight += weights[i];
  }
  return sum / totalWeight;
}

export function suggestWeight(
  estimatedE1RM: number,
  targetReps: number,
  targetRPE: number,
  roundingIncrement: number
): number {
  if (estimatedE1RM <= 0 || targetReps <= 0) return 0;
  const rir = 10 - targetRPE;
  const effectiveReps = targetReps + rir;
  const rawWeight = estimatedE1RM / (1 + 0.0333 * effectiveReps);

  if (roundingIncrement <= 0) return Math.round(rawWeight);
  return Math.round(rawWeight / roundingIncrement) * roundingIncrement;
}

export function roundToIncrement(weight: number, increment: number): number {
  if (weight <= 0) return 0;
  if (increment <= 0) return Math.round(weight);
  return Math.round(weight / increment) * increment;
}

/** Carga a partir de uma prescrição em %1RM ("82.5-87.5%" usa o extremo inferior). */
export function suggestWeightFromPercent(
  oneRM: number,
  percent: number,
  roundingIncrement: number,
): number {
  if (oneRM <= 0 || percent <= 0) return 0;
  return roundToIncrement(oneRM * percent, roundingIncrement);
}

/** Extremo inferior de "8-10", "20-30 sec", "4-6" — 0 para AMRAP. */
export function parseTargetNumber(raw: string): number {
  if (!raw) return 0;
  const match = raw.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}

export function formatWeight(weight: number): string {
  return weight % 1 === 0 ? weight.toString() : weight.toFixed(1);
}

export function parseRPE(value: string): number {
  const n = parseFloat(value);
  if (isNaN(n)) return 0;
  return Math.max(6, Math.min(10, Math.round(n * 2) / 2));
}
