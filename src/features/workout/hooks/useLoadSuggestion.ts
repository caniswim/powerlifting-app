import { useState, useCallback, useMemo } from 'react';
import { estimateE1RMWeighted, suggestWeight, getReadinessRecommendation } from '../../../utils/calculations';
import type { LoadSuggestion, ReadinessRecommendation } from '../../../utils/calculations';
import { useStorage } from '../../../contexts/StorageContext';
import { exerciseEquipment, equipmentIncrement } from '../../../data/exerciseMuscleMap';
import { useSurveyTrends } from '../../feedback/hooks/useSurveyTrends';
import type { ExerciseLog } from '../../../types';

export interface LoadSuggestionState {
  inputWeight: number;
  inputReps: number;
  inputRPE: number;
  suggestion: LoadSuggestion | null;
  readinessRec: ReadinessRecommendation | null;
  setInputWeight: (w: number) => void;
  setInputReps: (r: number) => void;
  setInputRPE: (rpe: number) => void;
  prefillInputs: (exercise: ExerciseLog, setIdx: number) => void;
}

export function useLoadSuggestion(): LoadSuggestionState {
  const storage = useStorage();
  const trends = useSurveyTrends();

  const [inputWeight, setInputWeight] = useState(0);
  const [inputReps, setInputReps] = useState(0);
  const [inputRPE, setInputRPE] = useState(7);
  const [suggestion, setSuggestion] = useState<LoadSuggestion | null>(null);

  // Readiness recommendation from survey data (display only — does NOT change weights)
  const readinessRec = useMemo(() => {
    if (!trends.hasSurveyData) return null;
    const latestPreSurveys = storage.getRecentPreSurveys(1);
    const hasPain = latestPreSurveys.length > 0 && latestPreSurveys[0].hasPain;
    return getReadinessRecommendation(trends.readinessScore, hasPain);
  }, [trends, storage]);

  const prefillInputs = useCallback((exercise: ExerciseLog, setIdx: number) => {
    const repRange = exercise.prescribedReps.split('-');
    const targetReps = parseInt(repRange[0]) || 0;
    setInputReps(targetReps);

    const rpeRange = exercise.prescribedRPE.split('-');
    const targetRPE = parseFloat(rpeRange[0]) || 7;
    setInputRPE(targetRPE);

    // Set 2+: use previous set's weight (straight sets)
    const prevSet = setIdx > 0 ? exercise.sets[setIdx - 1] : null;
    if (prevSet?.completed) {
      setInputWeight(prevSet.weight);
      setSuggestion(null);
      return;
    }

    // Set 1: smart suggestion from e1RM back-calculation (NO autoregulation adjustment)
    const performances = storage.getRecentPerformances(exercise.exerciseId, 3);
    if (performances.length > 0) {
      const estimatedE1RM = estimateE1RMWeighted(performances);
      const equipment = exerciseEquipment[exercise.exerciseId] || 'barbell';
      const increment = equipmentIncrement[equipment];
      const suggested = suggestWeight(estimatedE1RM, targetReps, targetRPE, increment);

      if (suggested > 0) {
        setInputWeight(suggested);
        setSuggestion({
          weight: suggested,
          basedOnE1RM: Math.round(estimatedE1RM * 10) / 10,
          sessionsUsed: performances.length,
        });
        return;
      }
    }

    // Fallback: no history
    setInputWeight(0);
    setSuggestion(null);
  }, [storage]);

  return {
    inputWeight,
    inputReps,
    inputRPE,
    suggestion,
    readinessRec,
    setInputWeight,
    setInputReps,
    setInputRPE,
    prefillInputs,
  };
}
