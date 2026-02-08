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

export function getWeekRPEProgression(weekInBlock: number, blockType: string): number {
  if (blockType === 'deload') return 5.5;
  const baseMap: Record<string, number[]> = {
    accumulation: [7, 7.5, 8, 8.5],
    transmutation: [8, 8, 8.5, 8.5],
    intensification: [8.5, 8.5, 9, 9],
    realization: [8, 9, 9.5, 6],
  };
  const progression = baseMap[blockType] || baseMap.accumulation;
  return progression[Math.min(weekInBlock, progression.length - 1)];
}

export function formatWeight(weight: number): string {
  return weight % 1 === 0 ? weight.toString() : weight.toFixed(1);
}

export function parseRPE(value: string): number {
  const n = parseFloat(value);
  if (isNaN(n)) return 0;
  return Math.max(6, Math.min(10, Math.round(n * 2) / 2));
}
