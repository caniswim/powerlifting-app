import { useState, useEffect } from 'react';
import { useStorage } from '../../../contexts/StorageContext';
import { shouldShowRestWarning, getNextTrainingDate } from '../../../data/programData';

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
    if (lastCompleted) {
      const needsRest = shouldShowRestWarning(lastCompleted.date, lastCompleted.dayIndex);
      if (needsRest) {
        setShowRestWarning(true);
        setRecommendedDate(getNextTrainingDate(lastCompleted.date, lastCompleted.dayIndex));
      }
    }
  }, [storage]);

  return {
    showRestWarning,
    recommendedDate,
    restWarningDismissed,
    dismissRestWarning: () => setRestWarningDismissed(true),
  };
}
