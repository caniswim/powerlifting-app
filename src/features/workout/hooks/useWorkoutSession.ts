import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStorage } from '../../../contexts/StorageContext';
import { exerciseNames } from '../../../data/exerciseMuscleMap';
import { getSessionData } from '../../../data/programData';
import type {
  PrescribedWeek,
  PrescribedDay,
  WorkoutLog,
  ExerciseLog,
  DayType,
} from '../../../types';

export interface WorkoutSessionState {
  workout: WorkoutLog | null;
  weekData: PrescribedWeek | null;
  loading: boolean;
  programComplete: boolean;
  activeExIdx: number;
  activeSetIdx: number;
  showNotes: boolean;
  showAddExercise: boolean;
  setWorkout: (w: WorkoutLog) => void;
  setActiveExIdx: (i: number) => void;
  setActiveSetIdx: (i: number) => void;
  setShowNotes: (v: boolean) => void;
  setShowAddExercise: (v: boolean) => void;
  skipExercise: () => void;
  addExtraExercise: (exerciseId: string) => void;
  updateExerciseNotes: (notes: string) => void;
}

export function useWorkoutSession(
  prefillInputs: (exercise: ExerciseLog, setIdx: number) => void,
): WorkoutSessionState {
  const storage = useStorage();

  const [weekData, setWeekData] = useState<PrescribedWeek | null>(null);
  const [workout, setWorkout] = useState<WorkoutLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [programComplete, setProgramComplete] = useState(false);
  const [activeExIdx, setActiveExIdx] = useState(0);
  const [activeSetIdx, setActiveSetIdx] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(false);

  useEffect(() => {
    loadWorkout();
  }, []);

  async function loadWorkout() {
    try {
      const sessionIndex = storage.getSessionIndex();

      if (sessionIndex >= 312) {
        setProgramComplete(true);
        setLoading(false);
        return;
      }

      const sessionData = getSessionData(sessionIndex);
      if (!sessionData) {
        setLoading(false);
        return;
      }

      const { week, day, weekNumber } = sessionData;
      setWeekData(week);

      const existingWorkouts = storage.getWorkouts();
      const existingToday = existingWorkouts.find(
        (w) => w.weekNumber === weekNumber && w.dayType === day.dayType && !w.completed
      );

      if (existingToday) {
        setWorkout(existingToday);
        const exIdx = existingToday.exercises.findIndex(
          (ex) => ex.sets.some((s) => !s.completed)
        );
        if (exIdx >= 0) {
          setActiveExIdx(exIdx);
          const setIdx = existingToday.exercises[exIdx].sets.findIndex((s) => !s.completed);
          setActiveSetIdx(setIdx >= 0 ? setIdx : 0);
          prefillInputs(existingToday.exercises[exIdx], setIdx >= 0 ? setIdx : 0);
        }
      } else {
        const newWorkout = createWorkoutFromPlan(day, week, weekNumber, day.dayType);
        setWorkout(newWorkout);
        prefillInputs(newWorkout.exercises[0], 0);
      }
    } catch {
      // Fallback: no workout available
    }
    setLoading(false);
  }

  function createWorkoutFromPlan(
    plan: PrescribedDay,
    week: PrescribedWeek,
    currentWeek: number,
    dayType: DayType
  ): WorkoutLog {
    return {
      id: uuidv4(),
      date: new Date().toISOString(),
      weekNumber: currentWeek,
      macrocycle: week.macrocycle,
      blockName: week.blockName,
      blockType: week.blockType,
      dayType,
      exercises: plan.exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        prescribedSets: ex.sets,
        prescribedReps: ex.reps,
        prescribedRPE: ex.rpe,
        ...(ex.supersetGroup ? { supersetGroup: ex.supersetGroup } : {}),
        sets: Array.from({ length: ex.sets }, (_, i) => ({
          setNumber: i + 1,
          weight: 0,
          reps: 0,
          rpe: 0,
          e1rm: 0,
          completed: false,
          isPR: false,
        })),
      })),
      completed: false,
      startedAt: new Date().toISOString(),
    };
  }

  const skipExercise = useCallback(() => {
    if (!workout) return;
    const updatedWorkout = { ...workout };
    const exercises = [...updatedWorkout.exercises];
    exercises[activeExIdx] = { ...exercises[activeExIdx], skipped: true };
    updatedWorkout.exercises = exercises;
    setWorkout(updatedWorkout);
    storage.saveWorkout(updatedWorkout);

    if (activeExIdx < exercises.length - 1) {
      setActiveExIdx(activeExIdx + 1);
      setActiveSetIdx(0);
      prefillInputs(exercises[activeExIdx + 1], 0);
    }
  }, [workout, activeExIdx, prefillInputs, storage]);

  const addExtraExercise = useCallback(
    (exerciseId: string) => {
      if (!workout) return;
      const name = exerciseNames[exerciseId] || exerciseId;
      const newExercise: ExerciseLog = {
        exerciseId,
        exerciseName: name,
        prescribedSets: 3,
        prescribedReps: '8-12',
        prescribedRPE: '8',
        sets: Array.from({ length: 3 }, (_, i) => ({
          setNumber: i + 1,
          weight: 0,
          reps: 0,
          rpe: 0,
          e1rm: 0,
          completed: false,
          isPR: false,
        })),
      };
      const updatedWorkout = {
        ...workout,
        exercises: [...workout.exercises, newExercise],
      };
      setWorkout(updatedWorkout);
      storage.saveWorkout(updatedWorkout);
      setShowAddExercise(false);
    },
    [workout, storage]
  );

  const updateExerciseNotes = useCallback(
    (notes: string) => {
      if (!workout) return;
      const updated = { ...workout };
      const exercises = [...updated.exercises];
      exercises[activeExIdx] = {
        ...exercises[activeExIdx],
        notes,
      };
      updated.exercises = exercises;
      setWorkout(updated);
      storage.saveWorkout(updated);
    },
    [workout, activeExIdx, storage]
  );

  return {
    workout,
    weekData,
    loading,
    programComplete,
    activeExIdx,
    activeSetIdx,
    showNotes,
    showAddExercise,
    setWorkout,
    setActiveExIdx,
    setActiveSetIdx,
    setShowNotes,
    setShowAddExercise,
    skipExercise,
    addExtraExercise,
    updateExerciseNotes,
  };
}
