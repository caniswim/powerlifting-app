import type { AIFeedback, FeedbackPeriod } from '../../types';
import { getItem, setItem, KEYS } from './core';

export function getAllFeedback(): AIFeedback[] {
  return getItem<AIFeedback[]>(KEYS.AI_FEEDBACK, []);
}

export function saveFeedback(feedback: AIFeedback): void {
  const all = getAllFeedback();
  const idx = all.findIndex((f) => f.id === feedback.id);
  if (idx >= 0) {
    all[idx] = feedback;
  } else {
    all.push(feedback);
  }
  setItem(KEYS.AI_FEEDBACK, all);
}

export function getFeedbackByPeriod(period: FeedbackPeriod): AIFeedback[] {
  return getAllFeedback()
    .filter((f) => f.period === period && f.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeedbackForWorkout(workoutId: string): AIFeedback | undefined {
  return getAllFeedback().find((f) => f.workoutId === workoutId && f.status === 'completed');
}

export function getPendingFeedback(): AIFeedback[] {
  return getAllFeedback().filter((f) => f.status === 'pending');
}
