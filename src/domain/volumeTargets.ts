import type { MuscleGroup, PrescribedWeek } from '../types';
import { getExerciseMuscleMap } from './exerciseRegistry';

/**
 * Alvo de volume semanal derivado do próprio programa, em vez de uma lista
 * fixa: soma as séries de trabalho prescritas na semana ponderadas pela
 * fração de ativação de cada exercício. Séries de aquecimento não entram —
 * elas não fazem parte da prescrição de volume.
 */
export function prescribedWeeklyVolume(week: PrescribedWeek): Partial<Record<MuscleGroup, number>> {
  const totals: Partial<Record<MuscleGroup, number>> = {};

  for (const day of week.days) {
    for (const ex of day.exercises) {
      const map = getExerciseMuscleMap(ex.exerciseId);
      for (const [muscle, fraction] of Object.entries(map)) {
        const mg = muscle as MuscleGroup;
        totals[mg] = (totals[mg] ?? 0) + ex.sets * (fraction as number);
      }
    }
  }

  for (const key of Object.keys(totals) as MuscleGroup[]) {
    totals[key] = Math.round((totals[key] ?? 0) * 10) / 10;
  }
  return totals;
}
