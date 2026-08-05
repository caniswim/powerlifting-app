import { useState, useCallback } from 'react';
import {
  estimateE1RMWeighted,
  suggestWeight,
  suggestWeightFromPercent,
  roundToIncrement,
  parseTargetNumber,
} from '../../../utils/calculations';
import type { LoadSuggestion } from '../../../utils/calculations';
import { useStorage } from '../../../contexts/StorageContext';
import { exerciseEquipment, equipmentIncrement } from '../../../data/exerciseMuscleMap';
import type { AthleteProfile, ExerciseLog, PercentRef, PrescribedSet, SetSegmentLog } from '../../../types';

export interface SetInputState {
  inputWeight: number;
  inputReps: number;
  inputRPE: number;
  inputSeconds: number;
  inputSegments: SetSegmentLog[];
  suggestion: LoadSuggestion | null;
  setInputWeight: (w: number) => void;
  setInputReps: (r: number) => void;
  setInputRPE: (rpe: number) => void;
  setInputSeconds: (s: number) => void;
  updateSegment: (index: number, patch: Partial<SetSegmentLog>) => void;
  prefillInputs: (exercise: ExerciseLog, setIdx: number) => void;
}

/** @deprecated nome antigo mantido para os imports existentes */
export type LoadSuggestionState = SetInputState;

function oneRMFor(profile: AthleteProfile, ref: PercentRef): number {
  switch (ref) {
    case 'squat': return profile.squat1RM;
    case 'bench': return profile.bench1RM;
    case 'deadlift': return profile.deadlift1RM;
    case 'ohp': return profile.ohp1RM ?? 0;
  }
}

export function useLoadSuggestion(): SetInputState {
  const storage = useStorage();

  const [inputWeight, setInputWeight] = useState(0);
  const [inputReps, setInputReps] = useState(0);
  const [inputRPE, setInputRPE] = useState(7);
  const [inputSeconds, setInputSeconds] = useState(0);
  const [inputSegments, setInputSegments] = useState<SetSegmentLog[]>([]);
  const [suggestion, setSuggestion] = useState<LoadSuggestion | null>(null);

  const updateSegment = useCallback((index: number, patch: Partial<SetSegmentLog>) => {
    setInputSegments((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }, []);

  const weightFromHistory = useCallback((
    exercise: ExerciseLog,
    targetReps: number,
    targetRPE: number,
    increment: number,
  ): { weight: number; suggestion: LoadSuggestion | null } => {
    const performances = storage.getRecentPerformances(exercise.exerciseId, 3);
    if (performances.length === 0) return { weight: 0, suggestion: null };

    const estimatedE1RM = estimateE1RMWeighted(performances);
    const suggested = suggestWeight(estimatedE1RM, targetReps || 5, targetRPE, increment);
    if (suggested <= 0) return { weight: 0, suggestion: null };

    return {
      weight: suggested,
      suggestion: {
        weight: suggested,
        basedOnE1RM: Math.round(estimatedE1RM * 10) / 10,
        sessionsUsed: performances.length,
      },
    };
  }, [storage]);

  const prefillInputs = useCallback((exercise: ExerciseLog, setIdx: number) => {
    const plan: PrescribedSet | undefined = exercise.sets[setIdx]?.prescribed;
    const increment = equipmentIncrement[exerciseEquipment[exercise.exerciseId] || 'barbell'];

    // --- Alvos de reps / tempo / RPE -------------------------------------
    const repsSource = plan?.reps ?? exercise.prescribedReps;
    const isTimed = plan?.unit === 'seconds';
    const isAmrap = plan?.type === 'amrap' || /AMRAP/i.test(repsSource);

    if (isTimed) {
      setInputSeconds(parseTargetNumber(repsSource));
      setInputReps(0);
    } else {
      setInputSeconds(0);
      setInputReps(isAmrap ? 0 : parseTargetNumber(repsSource));
    }

    const rpeSource = plan?.rpe ?? exercise.prescribedRPE;
    setInputRPE(parseTargetNumber(rpeSource) || 7);

    // --- Carga ------------------------------------------------------------
    const targetReps = isAmrap || isTimed ? parseTargetNumber(exercise.prescribedReps) || 5 : parseTargetNumber(repsSource);
    const targetRPE = parseTargetNumber(rpeSource) || 7;

    let weight = 0;
    let nextSuggestion: LoadSuggestion | null = null;

    // 1) %1RM prescrito pelo programa tem precedência.
    const ref = exercise.percentRef;
    const percent = plan?.percentMin;
    if (ref && percent) {
      const oneRM = oneRMFor(storage.getProfile(), ref);
      weight = suggestWeightFromPercent(oneRM, percent, increment);
    }

    // 2) Aquecimento sem %1RM: fração da carga da primeira série de trabalho.
    if (weight === 0 && plan?.type === 'warmup' && plan.warmupFraction) {
      const firstWorking = exercise.sets.find((s) => s.setType !== 'warmup');
      const base = firstWorking?.completed && firstWorking.weight > 0
        ? firstWorking.weight
        : weightFromHistory(exercise, targetReps, targetRPE, increment).weight;
      weight = roundToIncrement(base * plan.warmupFraction, increment);
    }

    // 3) Séries seguintes do mesmo bloco repetem a carga da anterior.
    if (weight === 0) {
      const prevSet = setIdx > 0 ? exercise.sets[setIdx - 1] : null;
      if (prevSet?.completed && prevSet.setType === plan?.type) {
        weight = prevSet.weight;
      }
    }

    // 4) Sem prescrição de carga: estimativa por e1RM histórico.
    if (weight === 0) {
      const fromHistory = weightFromHistory(exercise, targetReps, targetRPE, increment);
      weight = fromHistory.weight;
      nextSuggestion = fromHistory.suggestion;
    }

    setInputWeight(weight);
    setSuggestion(nextSuggestion);

    // --- Segmentos (dropset, 21s, rest-pause, unilateral) -----------------
    if (plan?.segments?.length) {
      setInputSegments(plan.segments.map((seg) => ({
        label: seg.label,
        weight: seg.loadDropPct ? roundToIncrement(weight * (1 - seg.loadDropPct), increment) : weight,
        reps: seg.unit === 'seconds' ? 0 : parseTargetNumber(seg.reps),
        ...(seg.unit === 'seconds' ? { seconds: parseTargetNumber(seg.reps) } : {}),
      })));
    } else {
      setInputSegments([]);
    }
  }, [storage, weightFromHistory]);

  return {
    inputWeight,
    inputReps,
    inputRPE,
    inputSeconds,
    inputSegments,
    suggestion,
    setInputWeight,
    setInputReps,
    setInputRPE,
    setInputSeconds,
    updateSegment,
    prefillInputs,
  };
}
