import { useState, useEffect } from 'react';
import { useStorage } from '../../../contexts/StorageContext';
import { shouldShowRestWarning, getNextTrainingDate, getRestDaysAfterSession } from '../../../data/programData';

export interface RestWarningState {
  showRestWarning: boolean;
  recommendedDate: Date | null;
  restWarningDismissed: boolean;
  dismissRestWarning: () => void;
  /**
   * O que SUSTENTA a recomendação, para a tela poder mostrá-lo.
   *
   * O aviso pedia confiança cega: dizia "recomendado para X" sem dizer de onde
   * X saiu. Quando o resto do app datava a sessão pelo dia da ABERTURA, o aviso
   * parecia contradizer o histórico e era dispensado — foi o que aconteceu em
   * 18/08/2026, com o descanso obrigatório após D3. Número auditável derrota
   * número pedido em confiança.
   */
  lastTrainedAt: string | null;
  restDays: number | null;
}

export function useRestWarning(): RestWarningState {
  const storage = useStorage();

  const [showRestWarning, setShowRestWarning] = useState(false);
  const [recommendedDate, setRecommendedDate] = useState<Date | null>(null);
  const [restWarningDismissed, setRestWarningDismissed] = useState(false);
  const [lastTrainedAt, setLastTrainedAt] = useState<string | null>(null);
  const [restDays, setRestDays] = useState<number | null>(null);

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
      setLastTrainedAt(lastCompleted.date);
      setRestDays(restDays);
    }
  }, [storage]);

  return {
    showRestWarning,
    recommendedDate,
    restWarningDismissed,
    dismissRestWarning: () => setRestWarningDismissed(true),
    lastTrainedAt,
    restDays,
  };
}
