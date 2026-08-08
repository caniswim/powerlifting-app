import type { PercentRef, SetLog, SquatDepth } from '../../types';
import type { ComplianceRollup, ComplianceTotals } from './rollupTypes';

/**
 * Agregação do padrão de competição.
 *
 * Regra que atravessa o arquivo inteiro: série sem `compliance` é **não
 * julgada**, nunca inválida. `judgedSets < sets` é a forma honesta de dizer
 * "não sabemos" — sem isso o histórico anterior a esta versão apareceria como
 * 100% de reprovação.
 */

const DEPTH_KEYS: SquatDepth[] = ['below_parallel', 'at_parallel', 'above_parallel', 'unknown'];

export interface ComplianceAcc {
  sets: number;
  judgedSets: number;
  reps: number;
  judgedReps: number;
  validReps: number;
  videos: number;
  depth: Record<SquatDepth, number>;
  depthJudged: number;
  pausedSets: number;
  pauseSecSum: number;
  pauseSecN: number;
  deadStopSets: number;
  strapSets: number;
}

export interface ComplianceRollupAcc {
  overall: ComplianceAcc;
  byLift: Map<PercentRef, ComplianceAcc>;
  equipment: { belt: number; straps: number; kneeSleeves: number; wristWraps: number };
  bars: Record<string, number>;
  plates: Record<string, number>;
}

export function newAcc(): ComplianceAcc {
  const depth = Object.fromEntries(DEPTH_KEYS.map((k) => [k, 0])) as Record<SquatDepth, number>;
  return {
    sets: 0, judgedSets: 0, reps: 0, judgedReps: 0, validReps: 0, videos: 0,
    depth, depthJudged: 0,
    pausedSets: 0, pauseSecSum: 0, pauseSecN: 0, deadStopSets: 0, strapSets: 0,
  };
}

export function newRollupAcc(): ComplianceRollupAcc {
  return {
    overall: newAcc(),
    byLift: new Map(),
    equipment: { belt: 0, straps: 0, kneeSleeves: 0, wristWraps: 0 },
    bars: {},
    plates: {},
  };
}

/** Soma uma série a um acumulador isolado (usado no resumo por exercício). */
export function addSetToAcc(acc: ComplianceAcc, set: SetLog): void {
  acc.sets += 1;
  acc.reps += set.reps || 0;

  const c = set.compliance;
  if (!c) return;

  if (c.validReps !== undefined) {
    acc.judgedSets += 1;
    acc.judgedReps += set.reps || 0;
    acc.validReps += c.validReps;
  }
  if (c.depth) {
    acc.depth[c.depth] += 1;
    acc.depthJudged += 1;
  }
  if (c.paused) acc.pausedSets += 1;
  if (c.pauseSec !== undefined && c.pauseSec > 0) {
    acc.pauseSecSum += c.pauseSec;
    acc.pauseSecN += 1;
  }
  if (c.deadStop) acc.deadStopSets += 1;
  if (c.equipment?.straps) acc.strapSets += 1;
  if (c.video) acc.videos += 1;
}

/** Soma uma série de trabalho concluída ao rollup. */
export function addSet(rollup: ComplianceRollupAcc, set: SetLog, lift?: PercentRef): void {
  addSetToAcc(rollup.overall, set);

  if (lift) {
    let liftAcc = rollup.byLift.get(lift);
    if (!liftAcc) {
      liftAcc = newAcc();
      rollup.byLift.set(lift, liftAcc);
    }
    addSetToAcc(liftAcc, set);
  }

  const c = set.compliance;
  if (!c) return;
  if (c.equipment?.belt) rollup.equipment.belt += 1;
  if (c.equipment?.straps) rollup.equipment.straps += 1;
  if (c.equipment?.kneeSleeves) rollup.equipment.kneeSleeves += 1;
  if (c.equipment?.wristWraps) rollup.equipment.wristWraps += 1;
  if (c.bar) rollup.bars[c.bar] = (rollup.bars[c.bar] ?? 0) + 1;
  if (c.plates) rollup.plates[c.plates] = (rollup.plates[c.plates] ?? 0) + 1;
}

/** Funde o acumulado de uma sessão no acumulado da semana. */
export function mergeAcc(target: ComplianceAcc, source: ComplianceAcc): void {
  target.sets += source.sets;
  target.judgedSets += source.judgedSets;
  target.reps += source.reps;
  target.judgedReps += source.judgedReps;
  target.validReps += source.validReps;
  target.videos += source.videos;
  target.depthJudged += source.depthJudged;
  for (const k of DEPTH_KEYS) target.depth[k] += source.depth[k];
  target.pausedSets += source.pausedSets;
  target.pauseSecSum += source.pauseSecSum;
  target.pauseSecN += source.pauseSecN;
  target.deadStopSets += source.deadStopSets;
  target.strapSets += source.strapSets;
}

export function mergeRollup(target: ComplianceRollupAcc, source: ComplianceRollupAcc): void {
  mergeAcc(target.overall, source.overall);
  for (const [lift, acc] of source.byLift) {
    const existing = target.byLift.get(lift);
    if (existing) mergeAcc(existing, acc);
    else target.byLift.set(lift, { ...acc, depth: { ...acc.depth } });
  }
  target.equipment.belt += source.equipment.belt;
  target.equipment.straps += source.equipment.straps;
  target.equipment.kneeSleeves += source.equipment.kneeSleeves;
  target.equipment.wristWraps += source.equipment.wristWraps;
  for (const [k, v] of Object.entries(source.bars)) target.bars[k] = (target.bars[k] ?? 0) + v;
  for (const [k, v] of Object.entries(source.plates)) target.plates[k] = (target.plates[k] ?? 0) + v;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function toTotals(acc: ComplianceAcc, lift?: PercentRef): ComplianceTotals {
  const totals: ComplianceTotals = {
    sets: acc.sets,
    judgedSets: acc.judgedSets,
    reps: acc.reps,
    judgedReps: acc.judgedReps,
    validReps: acc.validReps,
    validRepPct: acc.judgedReps > 0 ? round1((acc.validReps / acc.judgedReps) * 100) : null,
    videos: acc.videos,
  };

  // Só publica a dimensão que faz sentido para o levantamento — profundidade em
  // supino seria ruído no briefing.
  if (!lift || lift === 'squat') {
    if (acc.depthJudged > 0) totals.depth = { ...acc.depth };
  }
  if (!lift || lift === 'bench') {
    if (acc.pausedSets > 0 || acc.pauseSecN > 0) {
      totals.pausedSets = acc.pausedSets;
      totals.avgPauseSec = acc.pauseSecN > 0 ? round1(acc.pauseSecSum / acc.pauseSecN) : null;
    }
  }
  if (!lift || lift === 'deadlift') {
    if (acc.deadStopSets > 0 || acc.strapSets > 0) {
      totals.deadStopSets = acc.deadStopSets;
      totals.strapSets = acc.strapSets;
    }
  }
  return totals;
}

export function toRollup(acc: ComplianceRollupAcc): ComplianceRollup {
  const byLift: ComplianceRollup['byLift'] = {};
  for (const [lift, liftAcc] of acc.byLift) {
    byLift[lift] = toTotals(liftAcc, lift);
  }
  return {
    ...toTotals(acc.overall),
    byLift,
    equipment: { ...acc.equipment },
    bars: { ...acc.bars },
    plates: { ...acc.plates },
  };
}
