import { useState, useCallback, useEffect } from 'react';
import { useStorage } from '../../../contexts/StorageContext';
import type { WorkoutLog, PreWorkoutSurvey, PostWorkoutSurvey } from '../../../types';

export type SurveyPhase = 'pre' | 'workout' | 'post' | 'done';

export function useWorkoutSurveys(workout: WorkoutLog | null) {
  const storage = useStorage();
  const [phase, setPhase] = useState<SurveyPhase>('workout');

  // Determine initial phase
  useEffect(() => {
    if (!workout) return;

    if (workout.completed) {
      // Check if post-survey exists
      const postSurvey = storage.getPostSurveyForWorkout(workout.id);
      if (postSurvey) {
        setPhase('done');
      } else {
        setPhase('post');
      }
      return;
    }

    // Check if pre-survey exists
    const preSurvey = storage.getPreSurveyForWorkout(workout.id);
    if (!preSurvey) {
      setPhase('pre');
    } else {
      setPhase('workout');
    }
  }, [workout?.id, workout?.completed, storage]);

  const submitPreSurvey = useCallback((survey: PreWorkoutSurvey) => {
    storage.savePreSurvey(survey);
    setPhase('workout');
  }, [storage]);

  const skipPreSurvey = useCallback(() => {
    if (!workout) return;
    const skippedSurvey: PreWorkoutSurvey = {
      workoutId: workout.id,
      date: new Date().toISOString(),
      sleepQuality: 0,
      sleepHours: 0,
      energyLevel: 0,
      stressLevel: 0,
      motivation: 0,
      hasPain: false,
      painEntries: [],
      supplements: { creatine: false, protein: false, preWorkoutMeal: false },
      skipped: true,
    };
    storage.savePreSurvey(skippedSurvey);
    setPhase('workout');
  }, [workout, storage]);

  const submitPostSurvey = useCallback((survey: PostWorkoutSurvey) => {
    storage.savePostSurvey(survey);
    setPhase('done');
  }, [storage]);

  const skipPostSurvey = useCallback(() => {
    if (!workout) return;
    const skippedSurvey: PostWorkoutSurvey = {
      workoutId: workout.id,
      date: new Date().toISOString(),
      sessionQuality: 0,
      sessionRPE: 0,
      strengthPerception: 'normal',
      planAdherence: 'full',
      hasNewPain: false,
      painEntries: [],
      skipped: true,
    };
    storage.savePostSurvey(skippedSurvey);
    setPhase('done');
  }, [workout, storage]);

  return {
    phase,
    submitPreSurvey,
    skipPreSurvey,
    submitPostSurvey,
    skipPostSurvey,
  };
}
