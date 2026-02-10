import type { PreWorkoutSurvey, PostWorkoutSurvey, WorkoutLog, AIFeedback } from '../types';
import { requestAIFeedback } from './aiService';
import { buildDailyPrompt, buildWeeklyPrompt, buildMonthlyPrompt, buildQuarterlyPrompt } from './aiPrompts';
import { v4 as uuidv4 } from 'uuid';

export async function generateDailyFeedback(
  pre: PreWorkoutSurvey | undefined,
  post: PostWorkoutSurvey,
  workout: WorkoutLog,
  apiKey: string,
  saveFeedback: (feedback: AIFeedback) => void
): Promise<void> {
  const feedback: AIFeedback = {
    id: uuidv4(),
    workoutId: workout.id,
    date: new Date().toISOString(),
    period: 'daily',
    weekNumber: workout.weekNumber,
    macrocycle: workout.macrocycle,
    content: '',
    status: 'pending',
  };
  saveFeedback(feedback);

  try {
    const messages = buildDailyPrompt(pre, post, workout);
    const content = await requestAIFeedback(messages, { apiKey });
    feedback.content = content;
    feedback.status = 'completed';
  } catch {
    feedback.status = 'failed';
  }
  saveFeedback(feedback);
}

export async function generateWeeklyFeedback(
  preSurveys: PreWorkoutSurvey[],
  postSurveys: PostWorkoutSurvey[],
  workouts: WorkoutLog[],
  weekNumber: number,
  apiKey: string,
  saveFeedback: (feedback: AIFeedback) => void
): Promise<void> {
  const feedback: AIFeedback = {
    id: uuidv4(),
    date: new Date().toISOString(),
    period: 'weekly',
    weekNumber,
    content: '',
    status: 'pending',
  };
  saveFeedback(feedback);

  try {
    const messages = buildWeeklyPrompt(preSurveys, postSurveys, workouts);
    const content = await requestAIFeedback(messages, { apiKey });
    feedback.content = content;
    feedback.status = 'completed';
  } catch {
    feedback.status = 'failed';
  }
  saveFeedback(feedback);
}

export async function generateMonthlyFeedback(
  preSurveys: PreWorkoutSurvey[],
  postSurveys: PostWorkoutSurvey[],
  workouts: WorkoutLog[],
  macrocycle: number,
  apiKey: string,
  saveFeedback: (feedback: AIFeedback) => void
): Promise<void> {
  const feedback: AIFeedback = {
    id: uuidv4(),
    date: new Date().toISOString(),
    period: 'monthly',
    macrocycle,
    content: '',
    status: 'pending',
  };
  saveFeedback(feedback);

  try {
    const messages = buildMonthlyPrompt(preSurveys, postSurveys, workouts);
    const content = await requestAIFeedback(messages, { apiKey });
    feedback.content = content;
    feedback.status = 'completed';
  } catch {
    feedback.status = 'failed';
  }
  saveFeedback(feedback);
}

export async function generateQuarterlyFeedback(
  preSurveys: PreWorkoutSurvey[],
  postSurveys: PostWorkoutSurvey[],
  workouts: WorkoutLog[],
  macrocycle: number,
  apiKey: string,
  saveFeedback: (feedback: AIFeedback) => void
): Promise<void> {
  const feedback: AIFeedback = {
    id: uuidv4(),
    date: new Date().toISOString(),
    period: 'quarterly',
    macrocycle,
    content: '',
    status: 'pending',
  };
  saveFeedback(feedback);

  try {
    const messages = buildQuarterlyPrompt(preSurveys, postSurveys, workouts);
    const content = await requestAIFeedback(messages, { apiKey });
    feedback.content = content;
    feedback.status = 'completed';
  } catch {
    feedback.status = 'failed';
  }
  saveFeedback(feedback);
}

export async function retryPendingFeedback(
  pendingFeedback: AIFeedback[],
  _apiKey: string,
  saveFeedback: (feedback: AIFeedback) => void
): Promise<void> {
  // Retry is a no-op if we don't have the original prompt data
  // Mark old pending feedback as failed
  for (const fb of pendingFeedback) {
    fb.status = 'failed';
    saveFeedback(fb);
  }
}
