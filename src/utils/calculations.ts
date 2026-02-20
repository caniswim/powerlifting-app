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

export function formatWeight(weight: number): string {
  return weight % 1 === 0 ? weight.toString() : weight.toFixed(1);
}

export function parseRPE(value: string): number {
  const n = parseFloat(value);
  if (isNaN(n)) return 0;
  return Math.max(6, Math.min(10, Math.round(n * 2) / 2));
}

// ─── Wilks-2 (2020 revision) ───────────────────────────────────────
export function calculateWilks2(bodyweight: number, total: number, isMale = true): number {
  if (bodyweight <= 0 || total <= 0) return 0;

  const c = isMale
    ? [47.4617885411949, 8.47206137941125, 0.073694103462609, -0.00139583381094385,
       0.00000707665973070743, -0.0000000120804336482315]
    : [-125.425539779509, 13.7121941940668, -0.0330725063103405, -0.0010504000506583,
       0.00000938773881462799, -0.0000000231313315990204]
  ;

  const bw = bodyweight;
  const denom = c[0] + c[1]*bw + c[2]*bw**2 + c[3]*bw**3 + c[4]*bw**4 + c[5]*bw**5;
  if (denom <= 0) return 0;
  return Math.round((600 / denom) * total * 100) / 100;
}

// ─── IPF GL Points (Goodlift) ──────────────────────────────────────
export function calculateIPFGL(bodyweight: number, total: number, isMale = true): number {
  if (bodyweight <= 0 || total <= 0) return 0;

  // IPF GL coefficients for classic (raw) powerlifting
  const params = isMale
    ? { a: 1199.72839, b: 1025.18162, c: 0.009210 }
    : { a: 610.32796, b: 1045.59282, c: 0.003266 };

  const { a, b, c } = params;
  const denominator = a - b * Math.exp(-c * bodyweight);
  if (denominator <= 0) return 0;
  return Math.round((total / denominator) * 100 * 100) / 100;
}

// ─── Strength Classification ───────────────────────────────────────
export type StrengthClass = 'Elite Mundial' | 'Elite' | 'Master' | 'Classe I' | 'Classe II' | 'Classe III' | 'Iniciante';

export function getStrengthClass(dots: number): StrengthClass {
  if (dots >= 500) return 'Elite Mundial';
  if (dots >= 450) return 'Elite';
  if (dots >= 400) return 'Master';
  if (dots >= 350) return 'Classe I';
  if (dots >= 300) return 'Classe II';
  if (dots >= 250) return 'Classe III';
  return 'Iniciante';
}

export function getStrengthClassColor(cls: StrengthClass): string {
  switch (cls) {
    case 'Elite Mundial': return 'text-accent-gold';
    case 'Elite': return 'text-accent-red';
    case 'Master': return 'text-accent-purple';
    case 'Classe I': return 'text-accent-blue';
    case 'Classe II': return 'text-accent-green';
    case 'Classe III': return 'text-text-secondary';
    default: return 'text-text-muted';
  }
}

// ─── Autoregulation: Load Adjustment Factor ────────────────────────
export interface ReadinessFactors {
  sleepQuality: number;   // 1-10
  sleepHours: number;     // 0-14
  energyLevel: number;    // 1-10
  stressLevel: number;    // 1-10
  motivation: number;     // 1-10
  hasPain: boolean;
}

export function calculateAutoregulationFactor(factors: ReadinessFactors): {
  factor: number;           // 0.80 - 1.05 multiplier
  rpeAdjustment: number;    // -1.5 to +0.5
  recommendation: string;
  level: 'optimal' | 'good' | 'moderate' | 'low' | 'critical';
} {
  const readiness =
    factors.sleepQuality * 0.25 +
    factors.energyLevel * 0.25 +
    factors.motivation * 0.15 +
    (10 - factors.stressLevel) * 0.20 +
    Math.min(factors.sleepHours / 8, 1) * 10 * 0.15;

  const painPenalty = factors.hasPain ? 0.8 : 0;
  const adjustedReadiness = Math.max(0, readiness - painPenalty);

  if (adjustedReadiness >= 8.5) {
    return { factor: 1.03, rpeAdjustment: 0.5, recommendation: 'Dia excelente. Pode buscar PRs.', level: 'optimal' };
  }
  if (adjustedReadiness >= 7) {
    return { factor: 1.0, rpeAdjustment: 0, recommendation: 'Prontidão boa. Siga o plano normalmente.', level: 'good' };
  }
  if (adjustedReadiness >= 5.5) {
    return { factor: 0.95, rpeAdjustment: -0.5, recommendation: 'Prontidão moderada. Reduza 5% da carga e RPE.', level: 'moderate' };
  }
  if (adjustedReadiness >= 4) {
    return { factor: 0.90, rpeAdjustment: -1.0, recommendation: 'Prontidão baixa. Reduza 10% e foque em técnica.', level: 'low' };
  }
  return { factor: 0.82, rpeAdjustment: -1.5, recommendation: 'Considere um dia de recuperação ativa ou descanso.', level: 'critical' };
}

// ─── Competition Attempt Selection ─────────────────────────────────
export interface AttemptStrategy {
  opener: number;      // ~88-90% of best
  second: number;      // ~95-97% of best
  third: number;       // ~100-103% of best (PR attempt)
  openerRPE: string;
  secondRPE: string;
  thirdRPE: string;
}

export function calculateAttemptStrategy(
  bestE1RM: number,
  roundingIncrement: number = 2.5,
  conservative: boolean = false
): AttemptStrategy {
  const openerPct = conservative ? 0.87 : 0.89;
  const secondPct = conservative ? 0.94 : 0.96;
  const thirdPct = conservative ? 0.99 : 1.02;

  const round = (v: number) => Math.round(v / roundingIncrement) * roundingIncrement;

  return {
    opener: round(bestE1RM * openerPct),
    second: round(bestE1RM * secondPct),
    third: round(bestE1RM * thirdPct),
    openerRPE: conservative ? '7-7.5' : '7.5-8',
    secondRPE: conservative ? '8.5-9' : '9-9.5',
    thirdRPE: conservative ? '9.5' : '9.5-10',
  };
}
