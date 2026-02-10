import { useState, useCallback } from 'react';
import { calculateE1RM } from '../../../utils/calculations';
import { useStorage } from '../../../contexts/StorageContext';
import type { WorkoutLog } from '../../../types';

export interface SetEditState {
  editingSet: { exIdx: number; setIdx: number } | null;
  editWeight: number;
  editReps: number;
  editRPE: number;
  setEditWeight: (w: number) => void;
  setEditReps: (r: number) => void;
  setEditRPE: (rpe: number) => void;
  openEditSet: (exIdx: number, setIdx: number) => void;
  closeEditSet: () => void;
}

export interface SetCompletionActions {
  prFlash: string | null;
  editState: SetEditState;
  completeSet: () => void;
  saveEditSet: () => void;
}

export function useSetCompletion(
  workout: WorkoutLog | null,
  setWorkout: (w: WorkoutLog) => void,
  activeExIdx: number,
  activeSetIdx: number,
  setActiveExIdx: (i: number) => void,
  setActiveSetIdx: (i: number) => void,
  inputWeight: number,
  inputReps: number,
  inputRPE: number,
  prefillInputs: (exercise: WorkoutLog['exercises'][number], setIdx: number) => void,
): SetCompletionActions {
  const storage = useStorage();

  const [prFlash, setPrFlash] = useState<string | null>(null);

  // Edit modal state
  const [editingSet, setEditingSet] = useState<{ exIdx: number; setIdx: number } | null>(null);
  const [editWeight, setEditWeight] = useState(0);
  const [editReps, setEditReps] = useState(0);
  const [editRPE, setEditRPE] = useState(7);

  const openEditSet = useCallback((exIdx: number, setIdx: number) => {
    if (!workout) return;
    const set = workout.exercises[exIdx].sets[setIdx];
    setEditWeight(set.weight);
    setEditReps(set.reps);
    setEditRPE(set.rpe);
    setEditingSet({ exIdx, setIdx });
  }, [workout]);

  const closeEditSet = useCallback(() => {
    setEditingSet(null);
  }, []);

  const saveEditSetFn = useCallback(() => {
    if (!workout || !editingSet) return;
    const { exIdx, setIdx } = editingSet;
    const exerciseId = workout.exercises[exIdx].exerciseId;
    const newE1rm = calculateE1RM(editWeight, editReps, editRPE);

    const updatedWorkout = { ...workout };
    const exercises = [...updatedWorkout.exercises];
    const exercise = { ...exercises[exIdx] };
    const sets = [...exercise.sets];

    sets[setIdx] = {
      ...sets[setIdx],
      weight: editWeight,
      reps: editReps,
      rpe: editRPE,
      e1rm: newE1rm,
      isPR: false,
    };

    exercise.sets = sets;
    exercises[exIdx] = exercise;
    updatedWorkout.exercises = exercises;

    storage.saveWorkout(updatedWorkout);
    storage.recalculateRecord(exerciseId);

    // Re-evaluate isPR flags for this exercise in current workout
    const otherWorkouts = storage.getWorkouts().filter((w) => w.id !== workout.id);
    let bestFromOthers = 0;
    for (const w of otherWorkouts) {
      for (const ex of w.exercises) {
        if (ex.exerciseId !== exerciseId) continue;
        for (const s of ex.sets) {
          if (s.completed && s.e1rm > bestFromOthers) bestFromOthers = s.e1rm;
        }
      }
    }

    let runningBest = bestFromOthers;
    for (let i = 0; i < sets.length; i++) {
      if (!sets[i].completed) continue;
      if (sets[i].e1rm > runningBest) {
        sets[i] = { ...sets[i], isPR: true };
        runningBest = sets[i].e1rm;
      } else {
        sets[i] = { ...sets[i], isPR: false };
      }
    }

    exercise.sets = sets;
    exercises[exIdx] = exercise;
    updatedWorkout.exercises = exercises;

    setWorkout(updatedWorkout);
    storage.saveWorkout(updatedWorkout);

    if (sets[setIdx].isPR) {
      setPrFlash(exerciseId);
      setTimeout(() => setPrFlash(null), 3000);
    }

    setEditingSet(null);
  }, [workout, editingSet, editWeight, editReps, editRPE, setWorkout, storage]);

  const completeSet = useCallback(() => {
    if (!workout) return;
    const e1rm = calculateE1RM(inputWeight, inputReps, inputRPE);
    const exerciseId = workout.exercises[activeExIdx].exerciseId;
    const currentRecord = storage.getRecordForExercise(exerciseId);
    const isPR = e1rm > (currentRecord?.e1rm || 0);

    const updatedWorkout = { ...workout };
    const exercises = [...updatedWorkout.exercises];
    const exercise = { ...exercises[activeExIdx] };
    const sets = [...exercise.sets];
    sets[activeSetIdx] = {
      setNumber: activeSetIdx + 1,
      weight: inputWeight,
      reps: inputReps,
      rpe: inputRPE,
      e1rm,
      completed: true,
      isPR,
    };
    exercise.sets = sets;
    exercises[activeExIdx] = exercise;
    updatedWorkout.exercises = exercises;

    if (isPR && inputWeight > 0) {
      storage.saveRecord({
        exerciseId,
        e1rm,
        weight: inputWeight,
        reps: inputReps,
        rpe: inputRPE,
        date: new Date().toISOString(),
      });
      setPrFlash(exerciseId);
      setTimeout(() => setPrFlash(null), 3000);
    }

    const allDone = exercises.every((ex) => ex.sets.every((s) => s.completed));
    if (allDone) {
      updatedWorkout.completed = true;
      updatedWorkout.completedAt = new Date().toISOString();
      storage.setSessionIndex(storage.getSessionIndex() + 1);
    }

    setWorkout(updatedWorkout);
    storage.saveWorkout(updatedWorkout);

    if (activeSetIdx < sets.length - 1) {
      setActiveSetIdx(activeSetIdx + 1);
      prefillInputs(exercise, activeSetIdx + 1);
    } else if (activeExIdx < exercises.length - 1) {
      setActiveExIdx(activeExIdx + 1);
      setActiveSetIdx(0);
      prefillInputs(exercises[activeExIdx + 1], 0);
    }
  }, [workout, activeExIdx, activeSetIdx, inputWeight, inputReps, inputRPE, setWorkout, setActiveExIdx, setActiveSetIdx, prefillInputs, storage]);

  return {
    prFlash,
    editState: {
      editingSet,
      editWeight,
      editReps,
      editRPE,
      setEditWeight,
      setEditReps,
      setEditRPE,
      openEditSet,
      closeEditSet,
    },
    completeSet,
    saveEditSet: saveEditSetFn,
  };
}
