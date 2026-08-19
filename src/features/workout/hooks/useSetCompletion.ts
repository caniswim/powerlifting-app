import { useState, useCallback } from 'react';
import { calculateE1RM } from '../../../utils/calculations';
import { useStorage } from '../../../contexts/StorageContext';
import { isExerciseDone } from './useWorkoutSession';
import { unlockRestAlert } from '../../../services/restAlert';
import type { ExerciseLog, SetCompliance, SetLog, SetSegmentLog, WorkoutLog } from '../../../types';

export interface SetInputValues {
  weight: number;
  reps: number;
  rpe: number;
  seconds: number;
  segments: SetSegmentLog[];
  compliance?: SetCompliance;
}

/**
 * Só grava `compliance` quando há de fato algo registrado. Um objeto vazio em
 * toda série inflaria o histórico e faria "não julgado" parecer "julgado".
 */
function meaningfulCompliance(c: SetCompliance | undefined): SetCompliance | undefined {
  if (!c) return undefined;
  const hasGear = c.equipment ? Object.values(c.equipment).some(Boolean) : false;
  const hasAny =
    c.validReps !== undefined || c.depth !== undefined || c.paused !== undefined
    || c.pauseSec !== undefined || c.deadStop !== undefined
    || c.bar !== undefined || c.plates !== undefined
    || c.video !== undefined || c.note !== undefined || hasGear;
  return hasAny ? c : undefined;
}

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

/** Aquecimento e isometria não entram no cálculo de e1RM nem geram PR. */
function countsForE1RM(set: SetLog): boolean {
  return set.setType !== 'warmup' && set.unit !== 'seconds';
}

/**
 * Próxima posição a focar. Em superset (A1/A2), alterna entre os exercícios do
 * grupo a cada série, como o programa prescreve — em vez de esgotar A1 antes
 * de começar A2.
 */
function nextPosition(
  exercises: ExerciseLog[],
  exIdx: number,
  setIdx: number,
): { exIdx: number; setIdx: number } | null {
  const current = exercises[exIdx];
  const group = current.supersetGroup;

  if (group) {
    const partners = exercises
      .map((ex, i) => ({ ex, i }))
      .filter(({ ex }) => ex.supersetGroup === group && !ex.skipped);
    const pos = partners.findIndex((p) => p.i === exIdx);

    for (let step = 1; step <= partners.length; step++) {
      const candidate = partners[(pos + step) % partners.length];
      const nextSet = candidate.ex.sets.findIndex((s) => !s.completed);
      if (nextSet >= 0) return { exIdx: candidate.i, setIdx: nextSet };
    }
  }

  if (setIdx < current.sets.length - 1) {
    const nextSet = current.sets.findIndex((s, i) => i > setIdx && !s.completed);
    if (nextSet >= 0) return { exIdx, setIdx: nextSet };
  }

  const nextExIdx = exercises.findIndex(
    (ex, i) => i > exIdx && !ex.skipped && ex.sets.some((s) => !s.completed),
  );
  if (nextExIdx >= 0) {
    const nextSet = exercises[nextExIdx].sets.findIndex((s) => !s.completed);
    return { exIdx: nextExIdx, setIdx: nextSet >= 0 ? nextSet : 0 };
  }

  return null;
}

export function useSetCompletion(
  workout: WorkoutLog | null,
  setWorkout: (w: WorkoutLog) => void,
  activeExIdx: number,
  activeSetIdx: number,
  setActiveExIdx: (i: number) => void,
  setActiveSetIdx: (i: number) => void,
  input: SetInputValues,
  prefillInputs: (exercise: ExerciseLog, setIdx: number) => void,
  onSetCompleted?: (restSec: number) => void,
): SetCompletionActions {
  const storage = useStorage();

  const [prFlash, setPrFlash] = useState<string | null>(null);

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

    const exercises = [...workout.exercises];
    const exercise = { ...exercises[exIdx] };
    const sets = [...exercise.sets];
    const eligible = countsForE1RM(sets[setIdx]);
    const newE1rm = eligible ? calculateE1RM(editWeight, editReps, editRPE) : 0;

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
    const updatedWorkout: WorkoutLog = { ...workout, exercises };

    storage.saveWorkout(updatedWorkout);
    storage.recalculateRecord(exerciseId);

    // Reavalia as flags de PR deste exercício contra o resto do histórico.
    const otherWorkouts = storage.getWorkouts().filter((w) => w.id !== workout.id);
    let bestFromOthers = 0;
    for (const w of otherWorkouts) {
      for (const ex of w.exercises) {
        if (ex.exerciseId !== exerciseId) continue;
        for (const s of ex.sets) {
          if (s.completed && countsForE1RM(s) && s.e1rm > bestFromOthers) bestFromOthers = s.e1rm;
        }
      }
    }

    let runningBest = bestFromOthers;
    for (let i = 0; i < sets.length; i++) {
      if (!sets[i].completed || !countsForE1RM(sets[i])) continue;
      if (sets[i].e1rm > runningBest) {
        sets[i] = { ...sets[i], isPR: true };
        runningBest = sets[i].e1rm;
      } else {
        sets[i] = { ...sets[i], isPR: false };
      }
    }

    exercise.sets = sets;
    exercises[exIdx] = exercise;
    const finalWorkout: WorkoutLog = { ...workout, exercises };

    setWorkout(finalWorkout);
    storage.saveWorkout(finalWorkout);

    if (sets[setIdx].isPR) {
      setPrFlash(exerciseId);
      setTimeout(() => setPrFlash(null), 3000);
    }

    setEditingSet(null);
  }, [workout, editingSet, editWeight, editReps, editRPE, setWorkout, storage]);

  const completeSet = useCallback(() => {
    // Destrava o áudio DENTRO do gesto — é a única janela em que o iOS deixa.
    // Este toque é o mesmo que abre o cronômetro, então o alerta que ele vai
    // disparar daqui a 3 min já nasce com som. Idempotente e barato.
    unlockRestAlert();
    if (!workout) return;

    const exercises = [...workout.exercises];
    const exercise = { ...exercises[activeExIdx] };
    const sets = [...exercise.sets];
    const previous = sets[activeSetIdx];
    const exerciseId = exercise.exerciseId;

    const hasSegments = input.segments.length > 0;
    const isTimed = previous.unit === 'seconds';
    // Em séries segmentadas (dropset, 21s, unilateral) as reps registradas são
    // a soma das sub-séries; o detalhe fica em `segments`.
    const reps = hasSegments
      ? input.segments.reduce((sum, s) => sum + (s.reps || 0), 0)
      : input.reps;
    const seconds = hasSegments
      ? input.segments.reduce((sum, s) => sum + (s.seconds || 0), 0)
      : input.seconds;
    const weight = hasSegments ? (input.segments[0]?.weight ?? input.weight) : input.weight;

    const eligible = countsForE1RM(previous);
    const e1rm = eligible ? calculateE1RM(weight, reps, input.rpe) : 0;
    const currentRecord = storage.getRecordForExercise(exerciseId);
    const isPR = eligible && e1rm > 0 && e1rm > (currentRecord?.e1rm || 0);

    const compliance = meaningfulCompliance(input.compliance);

    sets[activeSetIdx] = {
      ...previous,
      weight,
      reps,
      rpe: input.rpe,
      e1rm,
      completed: true,
      isPR,
      // Hora REAL do esforço. Sem isto, a única testemunha de quando o treino
      // aconteceu era o PR — e só para quem bateu recorde. Ver `workoutTime.ts`.
      completedAt: new Date().toISOString(),
      ...(isTimed || seconds > 0 ? { durationSec: seconds } : {}),
      ...(hasSegments ? { segments: input.segments } : {}),
      ...(compliance ? { compliance } : {}),
    };
    exercise.sets = sets;
    exercises[activeExIdx] = exercise;
    const updatedWorkout: WorkoutLog = { ...workout, exercises };

    if (isPR && weight > 0) {
      storage.saveRecord({
        exerciseId,
        e1rm,
        weight,
        reps,
        rpe: input.rpe,
        date: new Date().toISOString(),
      });
      setPrFlash(exerciseId);
      setTimeout(() => setPrFlash(null), 3000);
    }

    const allDone = exercises.every(isExerciseDone);
    if (allDone) {
      updatedWorkout.completed = true;
      updatedWorkout.completedAt = new Date().toISOString();
      storage.setSessionIndex(storage.getSessionIndex() + 1);
    }

    setWorkout(updatedWorkout);
    storage.saveWorkout(updatedWorkout);

    if (!allDone) {
      onSetCompleted?.(previous.prescribed?.restSec ?? exercise.restSec ?? 0);
      const next = nextPosition(exercises, activeExIdx, activeSetIdx);
      if (next) {
        setActiveExIdx(next.exIdx);
        setActiveSetIdx(next.setIdx);
        prefillInputs(exercises[next.exIdx], next.setIdx);
      }
    }
  }, [
    workout, activeExIdx, activeSetIdx, input,
    setWorkout, setActiveExIdx, setActiveSetIdx, prefillInputs, storage, onSetCompleted,
  ]);

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
