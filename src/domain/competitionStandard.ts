import type { BarType, PercentRef, PlateType, SquatDepth, VideoAngle } from '../types';

/** Rótulos do padrão de competição. Configuração externa ao componente. */

export const squatDepthLabels: Record<SquatDepth, string> = {
  below_parallel: 'Abaixo',
  at_parallel: 'Paralelo',
  above_parallel: 'Acima',
  unknown: 'Não sei',
};

/** Ordem em que aparecem na UI — do que passa para o que reprova. */
export const squatDepthOrder: SquatDepth[] = ['below_parallel', 'at_parallel', 'above_parallel', 'unknown'];

export const barTypeLabels: Record<BarType, string> = {
  ipf_calibrated: 'IPF calibrada',
  stiff: 'Rígida',
  gym_barbell: 'Academia',
  deadlift_bar: 'Terra (whip)',
  safety_squat: 'Safety squat',
  trap: 'Trap',
  smith: 'Smith',
  other: 'Outra',
};

export const plateTypeLabels: Record<PlateType, string> = {
  calibrated: 'Calibrada',
  steel: 'Ferro',
  rubber_bumper: 'Bumper',
  thick_plastic: 'Plástico grossa',
  other: 'Outra',
};

export const videoAngleLabels: Record<VideoAngle, string> = {
  side: 'Lateral (quadril)',
  front: 'Frontal',
  foot: 'Dos pés',
  rear45: 'Trás 45°',
  other: 'Outro',
};

export const equipmentLabels = {
  belt: 'Cinto',
  straps: 'Strap',
  kneeSleeves: 'Joelheira',
  wristWraps: 'Munhequeira',
} as const;

export type EquipmentField = keyof typeof equipmentLabels;

export const equipmentFields: EquipmentField[] = ['belt', 'straps', 'kneeSleeves', 'wristWraps'];

/** Levantamentos em que o padrão de competição é registrável. */
export const JUDGED_LIFTS: PercentRef[] = ['squat', 'bench', 'deadlift'];

export function isJudgedLift(ref: PercentRef | undefined): ref is PercentRef {
  return ref !== undefined && JUDGED_LIFTS.includes(ref);
}
