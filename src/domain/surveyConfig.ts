import type { StrengthPerception, PlanAdherence } from '../types';

export const supplementLabels = {
  creatine: 'Creatina',
  protein: 'Proteína',
  preWorkoutMeal: 'Refeição',
} as const;

export const strengthPerceptionLabels: Record<StrengthPerception, string> = {
  below: 'Abaixo',
  normal: 'Normal',
  above: 'Acima',
};

export const planAdherenceLabels: Record<PlanAdherence, string> = {
  full: 'Completa',
  partial: 'Parcial',
  none: 'Nenhuma',
};
