import { useState, useEffect } from 'react';
import { useStorage } from '../../../contexts/StorageContext';
import { shouldShowRestWarning, getNextTrainingDate, getRestDaysAfterSession } from '../../../data/programData';

export interface RestWarningState {
  showRestWarning: boolean;
  recommendedDate: Date | null;
  restWarningDismissed: boolean;
  dismissRestWarning: () => void;
}

export function useRestWarning(): RestWarningState {
  const storage = useStorage();

  const [showRestWarning, setShowRestWarning] = useState(false);
  const [recommendedDate, setRecommendedDate] = useState<Date | null>(null);
  const [restWarningDismissed, setRestWarningDismissed] = useState(false);

  useEffect(() => {
    const lastCompleted = storage.getLastCompletedWorkout();
    if (!lastCompleted) return;

    // O programa diz quantos dias de descanso sugere após cada sessão
    // ("SUGGESTED REST DAY"); dias emendados trazem 0.
    const restDays = lastCompleted.sessionIndex !== undefined
      ? getRestDaysAfterSession(lastCompleted.sessionIndex, lastCompleted.programId)
      : lastCompleted.dayIndex === 5 ? 1 : 0;

    if (shouldShowRestWarning(lastCompleted.date, restDays)) {
      setShowRestWarning(true);
      setRecommendedDate(getNextTrainingDate(lastCompleted.date, restDays));
    }
  }, [storage]);

  return {
    showRestWarning,
    recommendedDate,
    restWarningDismissed,
    dismissRestWarning: () => setRestWarningDismissed(true),
  };
}
