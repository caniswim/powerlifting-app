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

  // Determine dayIndex by matching completed workouts in the same week to day slots.
  // arms_shoulders appears twice (index 2 and 5), so indexOf alone is ambiguous.
  const sameWeekWorkouts = workouts
    .filter((w) => w.weekNumber === last.weekNumber)
    .sort((a, b) => new Date(a.completedAt || a.date).getTime() - new Date(b.completedAt || b.date).getTime());

  const dayOrder: string[] = ['squat_emphasis', 'bench_emphasis', 'arms_shoulders', 'deadlift_emphasis', 'bench_volume', 'arms_shoulders'];

  // Match completed workouts to day slots in order
  const usedSlots = new Set<number>();
  for (const w of sameWeekWorkouts) {
    for (let i = 0; i < dayOrder.length; i++) {
      if (!usedSlots.has(i) && dayOrder[i] === w.dayType) {
        usedSlots.add(i);
        if (w.id === last.id) {
          return {
            date: last.completedAt || last.date,
            dayIndex: i,
          };
        }
        break;
      }
    }
  }

  // Fallback
  const dayIndex = dayOrder.indexOf(last.dayType);
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
