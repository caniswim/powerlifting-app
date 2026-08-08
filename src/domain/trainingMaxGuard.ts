import { getExercise } from './exerciseRegistry';
import { usesTrainingMax } from './referenceMax';
import type { AthleteProfile, ExerciseLog, PercentRef, PrescribedExercise } from '../types';

/**
 * Programas cujos percentuais são prescritos contra o padrão de COMPETIÇÃO e
 * que, portanto, não podem cair no 1RM de academia.
 *
 * O Bloco 1 é prescrito contra 215/160/240 (marcas legais, `baseline.md` §4),
 * não contra 250/170/268 (declaradas). Sem `trainingMax`, o fallback do motor
 * de %1RM prescreveria ~16% a mais no agachamento — 210 kg onde o programa
 * quer 180 — em silêncio, na semana 1, numa profundidade que o atleta nunca
 * executou. Falhar visível é melhor que prescrever errado.
 *
 * Powerbuilding 2.0 e o programa de 52 semanas ficam de fora de propósito:
 * eles são prescritos contra o 1RM declarado e devem continuar funcionando
 * sem `trainingMax`.
 */
const PROGRAMS_REQUIRING_TRAINING_MAX = new Set(['vena-block1']);

export function requiresTrainingMax(programId: string | undefined): boolean {
  return programId !== undefined && PROGRAMS_REQUIRING_TRAINING_MAX.has(programId);
}

/** Levantamento de referência de um bloco de prescrição, se houver. */
function refOf(ex: Pick<PrescribedExercise, 'exerciseId' | 'percentRef' | 'percent1RM'>): PercentRef | undefined {
  if (ex.percent1RM === undefined) return undefined;
  return ex.percentRef ?? getExercise(ex.exerciseId)?.percentRef;
}

/**
 * Referências usadas pela sessão que ainda não têm máximo técnico definido.
 * Vazio = pode prescrever. Não vazio = bloquear e mandar para Settings.
 */
export function missingTrainingMaxRefs(
  profile: AthleteProfile,
  programId: string | undefined,
  exercises: ReadonlyArray<Pick<ExerciseLog, 'exerciseId' | 'percentRef' | 'percent1RM'>>,
): PercentRef[] {
  if (!requiresTrainingMax(programId)) return [];
  const missing = new Set<PercentRef>();
  for (const ex of exercises) {
    const ref = refOf(ex);
    if (ref && !usesTrainingMax(profile, ref)) missing.add(ref);
  }
  return [...missing];
}

/** True quando ESTE bloco não pode ter carga sugerida por percentual. */
export function blocksLoadSuggestion(
  profile: AthleteProfile,
  programId: string | undefined,
  ref: PercentRef,
): boolean {
  return requiresTrainingMax(programId) && !usesTrainingMax(profile, ref);
}

export const REF_LABELS: Record<PercentRef, string> = {
  squat: 'Agachamento',
  bench: 'Supino',
  deadlift: 'Terra',
  ohp: 'Desenvolvimento',
};
