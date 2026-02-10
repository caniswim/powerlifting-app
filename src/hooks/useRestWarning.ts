import { useState, useEffect } from 'react';
import { getLastCompletedWorkout } from '../services/storage';
import { shouldShowRestWarning, getNextTrainingDate } from '../data/programData';

export interface RestWarningState {
  showRestWarning: boolean;
  recommendedDate: Date | null;
  restWarningDismissed: boolean;
  dismissRestWarning: () => void;
}

export function useRestWarning(): RestWarningState {
  const [showRestWarning, setShowRestWarning] = useState(false);
  const [recommendedDate, setRecommendedDate] = useState<Date | null>(null);
  const [restWarningDismissed, setRestWarningDismissed] = useState(false);

  useEffect(() => {
    const lastCompleted = getLastCompletedWorkout();
    if (lastCompleted) {
      const needsRest = shouldShowRestWarning(lastCompleted.date, lastCompleted.dayIndex);
      if (needsRest) {
        setShowRestWarning(true);
        setRecommendedDate(getNextTrainingDate(lastCompleted.date, lastCompleted.dayIndex));
      }
    }
  }, []);

  return {
    showRestWarning,
    recommendedDate,
    restWarningDismissed,
    dismissRestWarning: () => setRestWarningDismissed(true),
  };
}
