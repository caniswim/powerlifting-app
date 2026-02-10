import { useState, useCallback, useEffect } from 'react';
import { useStorage } from '../../../contexts/StorageContext';
import { generateDailyFeedback, generateWeeklyFeedback } from '../../../services/feedbackOrchestrator';
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

    // Fire-and-forget AI feedback generation
    const apiKey = storage.getApiKey();
    if (apiKey && workout) {
      const preSurvey = storage.getPreSurveyForWorkout(workout.id);
      generateDailyFeedback(
        preSurvey,
        survey,
        workout,
        apiKey,
        (fb) => storage.saveFeedback(fb)
      );

      // Check if this is the 4th session of the week (trigger weekly feedback)
      const weekWorkouts = storage.getWorkoutsByWeek(workout.weekNumber);
      const completedThisWeek = weekWorkouts.filter(w => w.completed).length;
      if (completedThisWeek >= 4) {
        const weekPreSurveys = weekWorkouts
          .map(w => storage.getPreSurveyForWorkout(w.id))
          .filter((s): s is PreWorkoutSurvey => s != null);
        const weekPostSurveys = weekWorkouts
          .map(w => storage.getPostSurveyForWorkout(w.id))
          .filter((s): s is PostWorkoutSurvey => s != null);

        generateWeeklyFeedback(
          weekPreSurveys,
          weekPostSurveys,
          weekWorkouts,
          workout.weekNumber,
          apiKey,
          (fb) => storage.saveFeedback(fb)
        );
      }
    }
  }, [workout, storage]);

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
