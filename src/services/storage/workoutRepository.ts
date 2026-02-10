import type { WorkoutLog } from '../../types';
import { getItem, setItem, KEYS } from './core';

export function getWorkouts(): WorkoutLog[] {
  return getItem<WorkoutLog[]>(KEYS.WORKOUTS, []);
}

export function saveWorkout(workout: WorkoutLog): void {
  const workouts = getWorkouts();
  const idx = workouts.findIndex((w) => w.id === workout.id);
  if (idx >= 0) {
    workouts[idx] = workout;
  } else {
    workouts.push(workout);
  }
  setItem(KEYS.WORKOUTS, workouts);
}

export function getWorkoutsByWeek(weekNumber: number): WorkoutLog[] {
  return getWorkouts().filter((w) => w.weekNumber === weekNumber);
}

export function getLastCompletedWorkout(): { date: string; dayIndex: number } | null {
  const workouts = getWorkouts()
    .filter((w) => w.completed)
    .sort((a, b) => new Date(b.completedAt || b.date).getTime() - new Date(a.completedAt || a.date).getTime());

  if (workouts.length === 0) return null;

  const last = workouts[0];
  const dayTypes: string[] = ['squat_emphasis', 'bench_emphasis', 'deadlift_emphasis', 'bench_volume'];
  const dayIndex = dayTypes.indexOf(last.dayType);

  return {
    date: last.completedAt || last.date,
    dayIndex: dayIndex >= 0 ? dayIndex : 0,
  };
}

// Recent performances for load suggestion (best set per session, most recent first)
export function getRecentPerformances(
  exerciseId: string,
  limit = 3
): { weight: number; reps: number; rpe: number; e1rm: number; date: string }[] {
  const workouts = getWorkouts()
    .filter((w) => w.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const performances: { weight: number; reps: number; rpe: number; e1rm: number; date: string }[] = [];

  for (const workout of workouts) {
    if (performances.length >= limit) break;
    for (const exercise of workout.exercises) {
      if (exercise.exerciseId === exerciseId) {
        const completedSets = exercise.sets.filter((s) => s.completed && s.weight > 0);
        if (completedSets.length > 0) {
          const bestSet = completedSets.reduce((best, s) =>
            s.e1rm > best.e1rm ? s : best
          );
          performances.push({
            weight: bestSet.weight,
            reps: bestSet.reps,
            rpe: bestSet.rpe,
            e1rm: bestSet.e1rm,
            date: workout.date,
          });
        }
        break;
      }
    }
  }

  return performances;
}

// Last weight used for an exercise
export function getLastWeightForExercise(exerciseId: string): number | null {
  const workouts = getWorkouts()
    .filter((w) => w.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      if (exercise.exerciseId === exerciseId) {
        const completedSets = exercise.sets.filter((s) => s.completed);
        if (completedSets.length > 0) {
          return completedSets[completedSets.length - 1].weight;
        }
      }
    }
  }
  return null;
}
