import type { PreWorkoutSurvey, PostWorkoutSurvey } from '../../types';
import { getItem, setItem, KEYS } from './core';

// Pre-Workout Surveys
export function getPreSurveys(): PreWorkoutSurvey[] {
  return getItem<PreWorkoutSurvey[]>(KEYS.PRE_SURVEYS, []);
}

export function savePreSurvey(survey: PreWorkoutSurvey): void {
  const surveys = getPreSurveys();
  const idx = surveys.findIndex((s) => s.workoutId === survey.workoutId);
  if (idx >= 0) {
    surveys[idx] = survey;
  } else {
    surveys.push(survey);
  }
  setItem(KEYS.PRE_SURVEYS, surveys);
}

export function getPreSurveyForWorkout(workoutId: string): PreWorkoutSurvey | undefined {
  return getPreSurveys().find((s) => s.workoutId === workoutId);
}

export function getRecentPreSurveys(limit = 10): PreWorkoutSurvey[] {
  return getPreSurveys()
    .filter((s) => !s.skipped)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

// Post-Workout Surveys
export function getPostSurveys(): PostWorkoutSurvey[] {
  return getItem<PostWorkoutSurvey[]>(KEYS.POST_SURVEYS, []);
}

export function savePostSurvey(survey: PostWorkoutSurvey): void {
  const surveys = getPostSurveys();
  const idx = surveys.findIndex((s) => s.workoutId === survey.workoutId);
  if (idx >= 0) {
    surveys[idx] = survey;
  } else {
    surveys.push(survey);
  }
  setItem(KEYS.POST_SURVEYS, surveys);
}

export function getPostSurveyForWorkout(workoutId: string): PostWorkoutSurvey | undefined {
  return getPostSurveys().find((s) => s.workoutId === workoutId);
}

export function getRecentPostSurveys(limit = 10): PostWorkoutSurvey[] {
  return getPostSurveys()
    .filter((s) => !s.skipped)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
