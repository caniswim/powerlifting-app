import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStorage } from '../../../contexts/StorageContext';
import { exerciseNames } from '../../../data/exerciseMuscleMap';
import { getSessionData, getTotalSessions } from '../../../data/programData';
import { buildSetPlan } from '../../../domain/setPlan';
import { getExercise } from '../../../domain/exerciseRegistry';
import type {
  PrescribedWeek,
  PrescribedExercise,
  ProgramSession,
  SetLog,
  WorkoutLog,
  ExerciseLog,
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
  swapExerciseVariation: (exerciseId: string, exerciseName: string) => void;
}

/** Séries que precisam estar completas para o treino terminar (aquecimento é opcional). */
export function isRequiredSet(set: SetLog): boolean {
  return set.setType !== 'warmup';
}

export function isExerciseDone(ex: ExerciseLog): boolean {
  return ex.skipped === true || ex.sets.filter(isRequiredSet).every((s) => s.completed);
}

function emptySet(setNumber: number): SetLog {
  return { setNumber, weight: 0, reps: 0, rpe: 0, e1rm: 0, completed: false, isPR: false };
}

/** Converte um bloco de prescrição do programa no exercício executável da sessão. */
export function toExerciseLog(ex: PrescribedExercise): ExerciseLog {
  const setPlan = buildSetPlan(ex);
  const percentRef = ex.percentRef ?? getExercise(ex.exerciseId)?.percentRef;

  // A variação padrão fica na primeira posição para o atleta poder voltar a ela.
  const variations = ex.alternatives?.length
    ? [
        { exerciseId: ex.exerciseId, name: ex.exerciseName },
        ...ex.alternatives.map((name, i) => ({
          exerciseId: ex.alternativeIds?.[i] ?? ex.exerciseId,
          name,
        })),
      ]
    : undefined;

  return {
    exerciseId: ex.exerciseId,
    exerciseName: ex.exerciseName,
    prescribedSets: ex.sets,
    prescribedReps: ex.reps,
    prescribedRPE: ex.rpe,
    ...(ex.supersetGroup ? { supersetGroup: ex.supersetGroup } : {}),
    ...(ex.supersetOrder ? { supersetOrder: ex.supersetOrder } : {}),
    ...(ex.blockId ? { blockId: ex.blockId } : {}),
    ...(ex.rawLabel ? { rawLabel: ex.rawLabel } : {}),
    ...(ex.notes ? { prescribedNotes: ex.notes } : {}),
    ...(ex.warmupSets ? { warmupSets: ex.warmupSets } : {}),
    ...(ex.restSec !== undefined ? { restSec: ex.restSec, restLabel: ex.restLabel } : {}),
    ...(ex.percent1RM ? { percent1RM: ex.percent1RM } : {}),
    ...(percentRef ? { percentRef } : {}),
    ...(ex.perSide ? { perSide: true } : {}),
    ...(ex.optional ? { optional: true } : {}),
    ...(ex.unit ? { unit: ex.unit } : {}),
    ...(variations ? { variations } : {}),
    setPlan,
    sets: setPlan.map((p) => ({
      ...emptySet(p.setNumber),
      setType: p.type,
      ...(p.unit !== 'reps' ? { unit: p.unit } : {}),
      ...(p.perSide ? { perSide: true } : {}),
      prescribed: p,
    })),
  };
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadWorkout() {
    try {
      const programId = storage.getActiveProgramId();
      const sessionIndex = storage.getSessionIndex(programId);

      if (sessionIndex >= getTotalSessions(programId)) {
        setProgramComplete(true);
        setLoading(false);
        return;
      }

      const session = getSessionData(sessionIndex, programId);
      if (!session) {
        setLoading(false);
        return;
      }

      setWeekData(session.week);

      // Sessão em andamento: casada pela posição no programa, não por
      // heurística de tipo de dia (o mesmo dayType pode repetir na semana).
      const existingToday = storage.getWorkouts().find(
        (w) => !w.completed
          && (w.programId ?? programId) === programId
          && (w.sessionIndex !== undefined
            ? w.sessionIndex === sessionIndex
            : w.weekNumber === session.weekNumber && w.dayType === session.day.dayType),
      );

      if (existingToday) {
        setWorkout(existingToday);
        const exIdx = existingToday.exercises.findIndex(
          (ex) => !ex.skipped && ex.sets.some((s) => !s.completed),
        );
        if (exIdx >= 0) {
          setActiveExIdx(exIdx);
          const setIdx = existingToday.exercises[exIdx].sets.findIndex((s) => !s.completed);
          setActiveSetIdx(setIdx >= 0 ? setIdx : 0);
          prefillInputs(existingToday.exercises[exIdx], setIdx >= 0 ? setIdx : 0);
        }
      } else {
        const newWorkout = createWorkoutFromPlan(session, programId);
        setWorkout(newWorkout);
        prefillInputs(newWorkout.exercises[0], 0);
      }
    } catch {
      // Fallback: no workout available
    }
    setLoading(false);
  }

  function createWorkoutFromPlan(session: ProgramSession, programId: string): WorkoutLog {
    const { week, day } = session;
    return {
      id: uuidv4(),
      date: new Date().toISOString(),
      programId,
      weekNumber: session.weekNumber,
      macrocycle: week.macrocycle,
      blockName: week.blockName,
      blockType: week.blockType,
      dayType: day.dayType,
      dayIndex: session.dayIndex,
      sessionIndex: session.sessionIndex,
      exercises: day.exercises.map(toExerciseLog),
      completed: false,
      startedAt: new Date().toISOString(),
    };
  }

  const skipExercise = useCallback(() => {
    if (!workout) return;
    const exercises = [...workout.exercises];
    exercises[activeExIdx] = { ...exercises[activeExIdx], skipped: true };
    const updatedWorkout: WorkoutLog = { ...workout, exercises };

    const allDone = exercises.every(isExerciseDone);
    if (allDone) {
      updatedWorkout.completed = true;
      updatedWorkout.completedAt = new Date().toISOString();
      storage.setSessionIndex(storage.getSessionIndex() + 1);
    }

    setWorkout(updatedWorkout);
    storage.saveWorkout(updatedWorkout);

    if (!allDone) {
      const nextIdx = exercises.findIndex(
        (ex, i) => i > activeExIdx && !ex.skipped && ex.sets.some((s) => !s.completed),
      );
      if (nextIdx >= 0) {
        setActiveExIdx(nextIdx);
        setActiveSetIdx(0);
        prefillInputs(exercises[nextIdx], 0);
      }
    }
  }, [workout, activeExIdx, prefillInputs, storage]);

  const addExtraExercise = useCallback(
    (exerciseId: string) => {
      if (!workout) return;
      const extra: PrescribedExercise = {
        exerciseId,
        exerciseName: exerciseNames[exerciseId] || exerciseId,
        sets: 3,
        reps: '8-12',
        rpe: '8',
        warmupSets: 0,
        blockId: `extra-${uuidv4().slice(0, 8)}`,
      };
      const updatedWorkout = {
        ...workout,
        exercises: [...workout.exercises, toExerciseLog(extra)],
      };
      setWorkout(updatedWorkout);
      storage.saveWorkout(updatedWorkout);
      setShowAddExercise(false);
    },
    [workout, storage],
  );

  const updateExerciseNotes = useCallback(
    (notes: string) => {
      if (!workout) return;
      const exercises = [...workout.exercises];
      exercises[activeExIdx] = { ...exercises[activeExIdx], notes };
      const updated = { ...workout, exercises };
      setWorkout(updated);
      storage.saveWorkout(updated);
    },
    [workout, activeExIdx, storage],
  );

  /** Troca o exercício por uma das variações que o programa permite. */
  const swapExerciseVariation = useCallback(
    (exerciseId: string, exerciseName: string) => {
      if (!workout) return;
      const exercises = [...workout.exercises];
      exercises[activeExIdx] = { ...exercises[activeExIdx], exerciseId, exerciseName };
      const updated = { ...workout, exercises };
      setWorkout(updated);
      storage.saveWorkout(updated);
    },
    [workout, activeExIdx, storage],
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
    swapExerciseVariation,
  };
}
