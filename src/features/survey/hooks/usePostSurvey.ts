import { useState } from 'react';
import type { PostWorkoutSurvey, PainEntry, StrengthPerception, PlanAdherence } from '../../../types';

export function usePostSurvey() {
  const [sessionQuality, setSessionQuality] = useState(5);
  const [sessionRPE, setSessionRPE] = useState(5);
  const [strengthPerception, setStrengthPerception] = useState<StrengthPerception>('normal');
  const [planAdherence, setPlanAdherence] = useState<PlanAdherence>('full');
  const [adherenceReason, setAdherenceReason] = useState('');
  const [hasNewPain, setHasNewPain] = useState(false);
  const [painEntries, setPainEntries] = useState<PainEntry[]>([]);
  const [pumpRating, setPumpRating] = useState(3);
  const [notes, setNotes] = useState('');

  const buildSurvey = (workoutId: string): PostWorkoutSurvey => ({
    workoutId,
    date: new Date().toISOString(),
    sessionQuality,
    sessionRPE,
    strengthPerception,
    planAdherence,
    adherenceReason: adherenceReason || undefined,
    hasNewPain,
    painEntries,
    pumpRating,
    notes: notes || undefined,
    skipped: false,
  });

  return {
    sessionQuality,
    setSessionQuality,
    sessionRPE,
    setSessionRPE,
    strengthPerception,
    setStrengthPerception,
    planAdherence,
    setPlanAdherence,
    adherenceReason,
    setAdherenceReason,
    hasNewPain,
    setHasNewPain,
    painEntries,
    setPainEntries,
    pumpRating,
    setPumpRating,
    notes,
    setNotes,
    buildSurvey,
  };
}
