import type { AthleteProfile, PercentRef } from '../types';

/**
 * Resolve o número contra o qual um percentual prescrito é calculado.
 *
 * O app guardava UM número por levantamento, e isso não basta: o 1RM do perfil
 * é a melhor marca já feita em condição de academia, enquanto um programa que
 * corrige execução precisa ancorar os percentuais no maior peso que o atleta
 * move **sem degradar a técnica**.
 *
 * É o "technical max" de Brett Gibbs — ≈92–94% do máximo real —, e ele o usa
 * exatamente por este motivo: percentual ancorado no máximo de academia
 * prescreve mais do que o atleta consegue executar dentro do padrão.
 *
 * Caso concreto que motivou a separação: agacho declarado 250 kg (pin squat,
 * acima do paralelo) contra 215 kg em profundidade legal. Prescrever 84% de
 * 250 daria 210 kg onde o programa quer 180.
 *
 * `trainingMax` nasce ausente, então nenhum programa existente muda de
 * comportamento: sem o campo, o fallback é o 1RM do perfil.
 */
export function resolveReferenceMax(profile: AthleteProfile, ref: PercentRef): number {
  const trainingMax = profile.trainingMax?.[ref];
  if (trainingMax !== undefined && trainingMax > 0) return trainingMax;

  switch (ref) {
    case 'squat': return profile.squat1RM;
    case 'bench': return profile.bench1RM;
    case 'deadlift': return profile.deadlift1RM;
    case 'ohp': return profile.ohp1RM ?? 0;
  }
}

/**
 * True quando o percentual está sendo calculado contra um máximo técnico
 * DEFINIDO — isto é, medido pelo atleta e não semeado pela migração.
 *
 * O seed de `baseline.md` §4 existe para que nada prescreva contra o 1RM de
 * academia enquanto a calibração não roda; ele NÃO é uma medição. Contá-lo como
 * definido é o que fazia `missingTrainingMaxRefs` nunca disparar e o gate
 * S3→S4 nunca ser cobrado.
 */
export function usesTrainingMax(profile: AthleteProfile, ref: PercentRef): boolean {
  if (profile.trainingMaxOrigin === 'seed') return false;
  const trainingMax = profile.trainingMax?.[ref];
  return trainingMax !== undefined && trainingMax > 0;
}
