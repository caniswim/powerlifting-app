import { useMemo } from 'react';
import { useStorage } from '../../../contexts/StorageContext';
import type { AIFeedback } from '../../../types';

export interface FeedbackHistory {
  latestDaily: AIFeedback | null;
  latestWeekly: AIFeedback | null;
  dailyHistory: AIFeedback[];
}

export function useFeedbackHistory(): FeedbackHistory {
  const storage = useStorage();

  return useMemo(() => {
    const dailyFeedback = storage.getFeedbackByPeriod('daily');
    const weeklyFeedback = storage.getFeedbackByPeriod('weekly');

    return {
      latestDaily: dailyFeedback[0] ?? null,
      latestWeekly: weeklyFeedback[0] ?? null,
      dailyHistory: dailyFeedback.slice(0, 10),
    };
  }, [storage]);
}
