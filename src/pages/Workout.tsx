import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, CheckCircle2, Pencil } from 'lucide-react';
import { calculateE1RM, estimateE1RMWeighted, suggestWeight } from '../utils/calculations';
import type { LoadSuggestion } from '../utils/calculations';
import {
  getCurrentWeek,
  getWorkouts,
  saveWorkout,
  getRecordForExercise,
  saveRecord,
  recalculateRecord,
  getRecentPerformances,
} from '../services/storage';
import { exerciseNames, exerciseEquipment, equipmentIncrement } from '../data/exerciseMuscleMap';
import type {
  PrescribedWeek,
  PrescribedDay,
  WorkoutLog,
  ExerciseLog,
  DayType,
} from '../types';

const RPE_VALUES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

const dayTypeLabels: Record<DayType, string> = {
  squat_emphasis: 'LOWER — Squat Emphasis',
  bench_emphasis: 'UPPER — Bench Emphasis',
  deadlift_emphasis: 'LOWER — Deadlift Emphasis',
  bench_volume: 'UPPER — Bench Volume',
};

function getTodayDayType(): DayType | null {
  const day = new Date().getDay();
  if (day === 1) return 'squat_emphasis';
  if (day === 2) return 'bench_emphasis';
  if (day === 4) return 'deadlift_emphasis';
  if (day === 5) return 'bench_volume';
  return null;
}

export default function Workout() {
  const navigate = useNavigate();
  const [weekData, setWeekData] = useState<PrescribedWeek | null>(null);
  const [, setTodayPlan] = useState<PrescribedDay | null>(null);
  const [workout, setWorkout] = useState<WorkoutLog | null>(null);
  const [activeExIdx, setActiveExIdx] = useState(0);
  const [activeSetIdx, setActiveSetIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [prFlash, setPrFlash] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<LoadSuggestion | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Input state for current set
  const [inputWeight, setInputWeight] = useState(0);
  const [inputReps, setInputReps] = useState(0);
  const [inputRPE, setInputRPE] = useState(7);

  // Edit modal state
  const [editingSet, setEditingSet] = useState<{ exIdx: number; setIdx: number } | null>(null);
  const [editWeight, setEditWeight] = useState(0);
  const [editReps, setEditReps] = useState(0);
  const [editRPE, setEditRPE] = useState(7);

  useEffect(() => {
    loadWorkout();
  }, []);

  async function loadWorkout() {
    try {
      const mod = await import('../data/programData');
      const currentWeek = getCurrentWeek();
      const week = mod.programData.find((w: PrescribedWeek) => w.weekNumber === currentWeek);
      setWeekData(week || null);

      const dayType = getTodayDayType();
      const existingWorkouts = getWorkouts();
      const existingToday = existingWorkouts.find(
        (w) => w.weekNumber === currentWeek && w.dayType === dayType
      );

      if (existingToday) {
        setWorkout(existingToday);
        setTodayPlan(week?.days.find((d) => d.dayType === dayType) || null);
        // Find first incomplete exercise/set
        const exIdx = existingToday.exercises.findIndex(
          (ex) => ex.sets.some((s) => !s.completed)
        );
        if (exIdx >= 0) {
          setActiveExIdx(exIdx);
          const setIdx = existingToday.exercises[exIdx].sets.findIndex((s) => !s.completed);
          setActiveSetIdx(setIdx >= 0 ? setIdx : 0);
          prefillInputs(existingToday.exercises[exIdx], setIdx >= 0 ? setIdx : 0);
        }
      } else if (week && dayType) {
        const plan = week.days.find((d) => d.dayType === dayType);
        if (plan) {
          setTodayPlan(plan);
          const newWorkout = createWorkoutFromPlan(plan, week, currentWeek, dayType);
          setWorkout(newWorkout);
          prefillInputs(newWorkout.exercises[0], 0);
        } else {
          setShowDayPicker(true);
        }
      } else {
        setShowDayPicker(true);
      }
    } catch {
      setShowDayPicker(true);
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

  function prefillInputs(exercise: ExerciseLog, setIdx: number) {
    // Parse prescribed reps (take lower bound for conservative suggestion)
    const repRange = exercise.prescribedReps.split('-');
    const targetReps = parseInt(repRange[0]) || 0;
    setInputReps(targetReps);

    // Parse prescribed RPE (take lower bound)
    const rpeRange = exercise.prescribedRPE.split('-');
    const targetRPE = parseFloat(rpeRange[0]) || 7;
    setInputRPE(targetRPE);

    // Set 2+: use previous set's weight (straight sets)
    const prevSet = setIdx > 0 ? exercise.sets[setIdx - 1] : null;
    if (prevSet?.completed) {
      setInputWeight(prevSet.weight);
      setSuggestion(null);
      return;
    }

    // Set 1: smart suggestion from e1RM back-calculation
    const performances = getRecentPerformances(exercise.exerciseId, 3);
    if (performances.length > 0) {
      const estimatedE1RM = estimateE1RMWeighted(performances);
      const equipment = exerciseEquipment[exercise.exerciseId] || 'barbell';
      const increment = equipmentIncrement[equipment];
      const suggested = suggestWeight(estimatedE1RM, targetReps, targetRPE, increment);

      if (suggested > 0) {
        setInputWeight(suggested);
        setSuggestion({
          weight: suggested,
          basedOnE1RM: Math.round(estimatedE1RM * 10) / 10,
          sessionsUsed: performances.length,
        });
        return;
      }
    }

    // Fallback: no history
    setInputWeight(0);
    setSuggestion(null);
  }

  function openEditSet(exIdx: number, setIdx: number) {
    const set = workout!.exercises[exIdx].sets[setIdx];
    setEditWeight(set.weight);
    setEditReps(set.reps);
    setEditRPE(set.rpe);
    setEditingSet({ exIdx, setIdx });
  }

  const saveEditSet = useCallback(() => {
    if (!workout || !editingSet) return;
    const { exIdx, setIdx } = editingSet;
    const exerciseId = workout.exercises[exIdx].exerciseId;
    const newE1rm = calculateE1RM(editWeight, editReps, editRPE);

    // Build updated workout with edited set
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

    // Save so recalculateRecord sees updated data
    saveWorkout(updatedWorkout);
    recalculateRecord(exerciseId);

    // Re-evaluate isPR flags for this exercise in current workout
    const otherWorkouts = getWorkouts().filter((w) => w.id !== workout.id);
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
    saveWorkout(updatedWorkout);

    // Flash if edited set is now a PR
    if (sets[setIdx].isPR) {
      setPrFlash(exerciseId);
      setTimeout(() => setPrFlash(null), 3000);
    }

    setEditingSet(null);
  }, [workout, editingSet, editWeight, editReps, editRPE]);

  function selectDay(dayType: DayType) {
    if (!weekData) return;
    const plan = weekData.days.find((d) => d.dayType === dayType);
    if (!plan) return;
    setTodayPlan(plan);
    const currentWeek = getCurrentWeek();
    const newWorkout = createWorkoutFromPlan(plan, weekData, currentWeek, dayType);
    setWorkout(newWorkout);
    prefillInputs(newWorkout.exercises[0], 0);
    setShowDayPicker(false);
  }

  const completeSet = useCallback(() => {
    if (!workout) return;
    const e1rm = calculateE1RM(inputWeight, inputReps, inputRPE);
    const exerciseId = workout.exercises[activeExIdx].exerciseId;
    const currentRecord = getRecordForExercise(exerciseId);
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

    // Save PR
    if (isPR && inputWeight > 0) {
      saveRecord({
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

    // Check if all exercises are done
    const allDone = exercises.every((ex) => ex.sets.every((s) => s.completed));
    if (allDone) {
      updatedWorkout.completed = true;
      updatedWorkout.completedAt = new Date().toISOString();
    }

    setWorkout(updatedWorkout);
    saveWorkout(updatedWorkout);

    // Advance to next set/exercise
    if (activeSetIdx < sets.length - 1) {
      setActiveSetIdx(activeSetIdx + 1);
      prefillInputs(exercise, activeSetIdx + 1);
    } else if (activeExIdx < exercises.length - 1) {
      setActiveExIdx(activeExIdx + 1);
      setActiveSetIdx(0);
      prefillInputs(exercises[activeExIdx + 1], 0);
    }
  }, [workout, activeExIdx, activeSetIdx, inputWeight, inputReps, inputRPE]);

  const skipExercise = useCallback(() => {
    if (!workout) return;
    const updatedWorkout = { ...workout };
    const exercises = [...updatedWorkout.exercises];
    exercises[activeExIdx] = { ...exercises[activeExIdx], skipped: true };
    updatedWorkout.exercises = exercises;
    setWorkout(updatedWorkout);
    saveWorkout(updatedWorkout);

    if (activeExIdx < exercises.length - 1) {
      setActiveExIdx(activeExIdx + 1);
      setActiveSetIdx(0);
      prefillInputs(exercises[activeExIdx + 1], 0);
    }
  }, [workout, activeExIdx]);

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
      saveWorkout(updatedWorkout);
      setShowAddExercise(false);
    },
    [workout]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Day picker when no workout for today
  if (showDayPicker && !workout) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
          <h1 className="text-xl font-display font-bold text-accent-gold uppercase tracking-wider">
            Selecionar Treino
          </h1>
          <p className="text-sm text-text-muted font-display">
            Hoje não é dia de treino programado. Selecione um treino:
          </p>
          <div className="space-y-2">
            {(
              ['squat_emphasis', 'bench_emphasis', 'deadlift_emphasis', 'bench_volume'] as DayType[]
            ).map((dt) => (
              <button
                key={dt}
                onClick={() => selectDay(dt)}
                className="w-full h-14 bg-bg-card border border-border rounded-lg text-left px-4 font-display font-semibold text-text-primary uppercase tracking-wider hover:border-accent-gold transition-colors"
              >
                {dayTypeLabels[dt]}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full h-11 bg-bg-tertiary border border-border rounded-lg font-display text-sm text-text-muted uppercase tracking-wider"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-text-muted font-display">Nenhum treino disponível.</p>
      </div>
    );
  }

  const currentExercise = workout.exercises[activeExIdx];
  const currentSet = currentExercise?.sets[activeSetIdx];
  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
    0
  );
  const progressPercent = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  const currentE1RM = inputWeight > 0 && inputReps > 0 ? calculateE1RM(inputWeight, inputReps, inputRPE) : 0;
  const currentRecord = getRecordForExercise(currentExercise?.exerciseId || '');
  const wouldBePR = currentE1RM > (currentRecord?.e1rm || 0) && currentE1RM > 0;

  return (
    <div ref={containerRef} className="min-h-screen bg-bg-primary pb-4">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-bg-secondary border-b border-border" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-lg mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="text-text-muted font-display text-sm"
            >
              <ArrowLeft size={16} className="inline mr-1" />Voltar
            </button>
            <div className="text-xs font-mono text-text-muted">
              {completedSets}/{totalSets} séries
            </div>
            {workout.completed && (
              <span className="text-xs font-display font-semibold text-accent-green uppercase tracking-wider">
                Concluído
              </span>
            )}
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-bg-tertiary rounded-full mt-2">
            <div
              className="h-1 bg-accent-gold rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Workout header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs font-display text-text-muted uppercase tracking-wider">
              S{workout.weekNumber} — {workout.blockName}
            </div>
            <div className="text-lg font-display font-bold text-text-primary uppercase tracking-wider">
              {dayTypeLabels[workout.dayType]}
            </div>
          </div>
          {weekData?.isDeload && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-display font-semibold tracking-wider uppercase border rounded bg-accent-blue/20 text-accent-blue border-accent-blue/30">
              DELOAD
            </span>
          )}
        </div>

        {/* Exercise nav tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-none -mx-4 px-4">
          {workout.exercises.map((ex, i) => {
            const allComplete = ex.sets.every((s) => s.completed);
            const isActive = i === activeExIdx;
            return (
              <button
                key={i}
                onClick={() => {
                  setActiveExIdx(i);
                  const nextSet = ex.sets.findIndex((s) => !s.completed);
                  setActiveSetIdx(nextSet >= 0 ? nextSet : 0);
                  prefillInputs(ex, nextSet >= 0 ? nextSet : 0);
                }}
                className={`flex-shrink-0 px-3 py-1.5 rounded text-xs font-display font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  ex.skipped
                    ? 'bg-bg-tertiary text-text-muted line-through'
                    : isActive
                    ? 'bg-accent-gold text-black'
                    : allComplete
                    ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                    : 'bg-bg-card text-text-secondary border border-border'
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* PR Flash */}
        {prFlash && (
          <div className="bg-accent-gold/20 border border-accent-gold/40 rounded-lg p-3 text-center animate-fade-in pr-glow">
            <div className="text-lg font-display font-bold text-accent-gold uppercase tracking-wider">
              NOVO PR!
            </div>
            <div className="text-sm font-mono text-accent-gold-bright">
              {exerciseNames[prFlash]} — {currentE1RM.toFixed(1)} e1RM
            </div>
          </div>
        )}

        {/* Active Exercise Card */}
        {currentExercise && !currentExercise.skipped && (
          <div className={`bg-bg-card border rounded-lg p-4 space-y-4 ${
            wouldBePR ? 'border-accent-gold/50 pr-glow' : 'border-border'
          }`}>
            {/* Exercise header */}
            <div>
              <div className="text-lg font-display font-bold text-text-primary uppercase tracking-wider">
                {currentExercise.exerciseName}
              </div>
              <div className="text-xs font-mono text-text-muted mt-0.5">
                Prescrito: {currentExercise.prescribedSets}×{currentExercise.prescribedReps} @ RPE{' '}
                {currentExercise.prescribedRPE}
              </div>
              {currentRecord && (
                <div className="text-xs font-mono text-accent-gold mt-0.5">
                  PR: {currentRecord.e1rm.toFixed(1)} e1RM ({currentRecord.weight}×{currentRecord.reps} @{currentRecord.rpe})
                </div>
              )}
            </div>

            {/* Set indicators */}
            <div className="flex gap-1.5">
              {currentExercise.sets.map((set, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full ${
                    set.completed
                      ? set.isPR
                        ? 'bg-accent-gold'
                        : 'bg-accent-green'
                      : i === activeSetIdx
                      ? 'bg-text-secondary'
                      : 'bg-bg-tertiary'
                  }`}
                />
              ))}
            </div>

            {/* Current set label */}
            <div className="text-center text-xs font-display font-semibold text-text-muted uppercase tracking-wider">
              Série {activeSetIdx + 1} de {currentExercise.sets.length}
            </div>

            {/* Completed sets table */}
            {currentExercise.sets.some((s) => s.completed) && (
              <div className="space-y-1">
                {currentExercise.sets.map((set, i) =>
                  set.completed ? (
                    <button
                      key={i}
                      onClick={() => openEditSet(activeExIdx, i)}
                      className={`flex justify-between items-center w-full px-2 py-1.5 rounded text-xs transition-colors ${
                        set.isPR
                          ? 'bg-accent-gold/10 text-accent-gold active:bg-accent-gold/20'
                          : 'text-text-muted active:bg-bg-tertiary'
                      }`}
                    >
                      <span className="font-mono">S{set.setNumber}</span>
                      <span className="font-mono font-bold">
                        {set.weight}kg × {set.reps} @{set.rpe}
                      </span>
                      <span className="font-mono flex items-center gap-1.5">
                        {set.e1rm.toFixed(1)}{set.isPR ? ' PR' : ''}
                        <Pencil size={10} className="opacity-40" />
                      </span>
                    </button>
                  ) : null
                )}
              </div>
            )}

            {/* Input area */}
            {currentSet && !currentSet.completed && (
              <div className="space-y-4 border-t border-border pt-4">
                {/* Weight input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
                      PESO (KG)
                    </label>
                    {suggestion && activeSetIdx === 0 && (
                      <span className="text-[10px] font-mono text-accent-blue">
                        e1RM {suggestion.basedOnE1RM} · {suggestion.sessionsUsed}
                        {suggestion.sessionsUsed === 1 ? ' sessão' : ' sessões'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInputWeight(Math.max(0, inputWeight - 2.5))}
                      className="w-12 h-14 bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={inputWeight || ''}
                      onChange={(e) => setInputWeight(parseFloat(e.target.value) || 0)}
                      className="flex-1 h-14 bg-bg-input border border-border-light rounded-lg text-center font-mono font-bold text-3xl text-text-primary focus:border-accent-gold focus:outline-none"
                      onFocus={(e) => e.target.select()}
                    />
                    <button
                      type="button"
                      onClick={() => setInputWeight(inputWeight + 2.5)}
                      className="w-12 h-14 bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Reps input */}
                <div>
                  <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted block mb-1">
                    REPS (Alvo: {currentExercise.prescribedReps})
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInputReps(Math.max(1, inputReps - 1))}
                      className="w-12 h-14 bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={inputReps || ''}
                      onChange={(e) => setInputReps(parseInt(e.target.value) || 0)}
                      className="flex-1 h-14 bg-bg-input border border-border-light rounded-lg text-center font-mono font-bold text-3xl text-text-primary focus:border-accent-gold focus:outline-none"
                      onFocus={(e) => e.target.select()}
                    />
                    <button
                      type="button"
                      onClick={() => setInputReps(inputReps + 1)}
                      className="w-12 h-14 bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* RPE selector */}
                <div>
                  <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted block mb-1">
                    RPE (Alvo: {currentExercise.prescribedRPE})
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {RPE_VALUES.map((rpe) => {
                      const isSelected = inputRPE === rpe;
                      const color =
                        rpe >= 9.5
                          ? 'bg-accent-red text-white'
                          : rpe >= 9
                          ? 'bg-accent-red-dim text-white'
                          : rpe >= 8
                          ? 'bg-accent-gold text-black'
                          : rpe >= 7
                          ? 'bg-accent-green-dim text-white'
                          : 'bg-bg-tertiary text-text-secondary';
                      return (
                        <button
                          key={rpe}
                          type="button"
                          onClick={() => setInputRPE(rpe)}
                          className={`min-w-[42px] h-11 rounded-lg font-mono text-sm font-bold transition-all ${
                            isSelected
                              ? `${color} ring-2 ring-white/30 scale-105`
                              : 'bg-bg-input text-text-muted hover:bg-bg-tertiary'
                          }`}
                        >
                          {rpe}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* e1RM preview */}
                {currentE1RM > 0 && (
                  <div className={`text-center py-2 rounded-lg ${
                    wouldBePR ? 'bg-accent-gold/10 border border-accent-gold/30' : 'bg-bg-tertiary'
                  }`}>
                    <span className="text-xs font-display text-text-muted uppercase tracking-wider">
                      e1RM:{' '}
                    </span>
                    <span className={`text-xl font-mono font-bold ${
                      wouldBePR ? 'text-accent-gold' : 'text-text-primary'
                    }`}>
                      {currentE1RM.toFixed(1)}
                    </span>
                    {wouldBePR && (
                      <span className="text-xs font-display text-accent-gold ml-2 uppercase tracking-wider">
                        NOVO PR!
                      </span>
                    )}
                  </div>
                )}

                {/* Complete set button */}
                <button
                  onClick={completeSet}
                  disabled={inputWeight <= 0 || inputReps <= 0}
                  className={`w-full h-14 rounded-lg font-display font-bold text-lg uppercase tracking-wider transition-all ${
                    inputWeight <= 0 || inputReps <= 0
                      ? 'bg-bg-tertiary text-text-muted'
                      : wouldBePR
                      ? 'bg-accent-gold text-black hover:bg-accent-gold-bright active:scale-[0.98] pr-glow'
                      : 'bg-accent-gold text-black hover:bg-accent-gold-bright active:scale-[0.98]'
                  }`}
                >
                  Completar Série {activeSetIdx + 1}
                </button>
              </div>
            )}

            {/* All sets complete for this exercise */}
            {currentExercise.sets.every((s) => s.completed) && (
              <div className="text-center py-3">
                <span className="text-sm font-display font-semibold text-accent-green uppercase tracking-wider">
                  Exercício concluído
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="flex-1 h-11 bg-bg-card border border-border rounded-lg font-display text-xs text-text-muted uppercase tracking-wider hover:border-accent-gold transition-colors"
          >
            Notas
          </button>
          <button
            onClick={skipExercise}
            disabled={!currentExercise || currentExercise.sets.every((s) => s.completed)}
            className="flex-1 h-11 bg-bg-card border border-border rounded-lg font-display text-xs text-text-muted uppercase tracking-wider hover:border-accent-red transition-colors disabled:opacity-30"
          >
            Pular
          </button>
          <button
            onClick={() => setShowAddExercise(!showAddExercise)}
            className="flex-1 h-11 bg-bg-card border border-border rounded-lg font-display text-xs text-text-muted uppercase tracking-wider hover:border-accent-gold transition-colors"
          >
            + Extra
          </button>
        </div>

        {/* Notes panel */}
        {showNotes && currentExercise && (
          <div className="bg-bg-card border border-border rounded-lg p-4 animate-fade-in">
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted block mb-2">
              Notas — {currentExercise.exerciseName}
            </label>
            <textarea
              value={currentExercise.notes || ''}
              onChange={(e) => {
                if (!workout) return;
                const updated = { ...workout };
                const exercises = [...updated.exercises];
                exercises[activeExIdx] = {
                  ...exercises[activeExIdx],
                  notes: e.target.value,
                };
                updated.exercises = exercises;
                setWorkout(updated);
                saveWorkout(updated);
              }}
              className="w-full h-20 bg-bg-input border border-border-light rounded-lg p-2 text-sm font-display text-text-primary focus:border-accent-gold focus:outline-none resize-none"
              placeholder="Observações técnicas, sensação, ajustes..."
            />
          </div>
        )}

        {/* Add exercise panel */}
        {showAddExercise && (
          <div className="bg-bg-card border border-border rounded-lg p-4 animate-fade-in space-y-2">
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted block">
              Adicionar Exercício Extra
            </label>
            <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-none">
              {Object.entries(exerciseNames)
                .filter(
                  ([id]) => !workout?.exercises.some((ex) => ex.exerciseId === id)
                )
                .map(([id, name]) => (
                  <button
                    key={id}
                    onClick={() => addExtraExercise(id)}
                    className="w-full text-left px-3 py-2 rounded text-sm font-display text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors"
                  >
                    {name}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Edit Set Modal */}
        {editingSet && (() => {
          const editE1RM = editWeight > 0 && editReps > 0 ? calculateE1RM(editWeight, editReps, editRPE) : 0;
          const editExercise = workout.exercises[editingSet.exIdx];
          const editRecord = getRecordForExercise(editExercise.exerciseId);
          const editWouldBePR = editE1RM > (editRecord?.e1rm || 0) && editE1RM > 0;

          return (
            <div className="fixed inset-0 z-50 flex items-end justify-center">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setEditingSet(null)}
              />

              {/* Sheet */}
              <div
                className="relative w-full max-w-lg bg-bg-card border-t border-border rounded-t-2xl p-4 space-y-4 animate-slide-up"
                style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
              >
                {/* Handle */}
                <div className="flex justify-center">
                  <div className="w-10 h-1 bg-border rounded-full" />
                </div>

                {/* Header */}
                <div className="text-center">
                  <div className="text-xs font-display font-semibold text-text-muted uppercase tracking-wider">
                    Editar Série {editingSet.setIdx + 1}
                  </div>
                  <div className="text-sm font-display font-bold text-text-primary uppercase tracking-wider">
                    {editExercise.exerciseName}
                  </div>
                </div>

                {/* Weight input */}
                <div>
                  <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted block mb-1">
                    PESO (KG)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditWeight(Math.max(0, editWeight - 2.5))}
                      className="w-12 h-14 bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={editWeight || ''}
                      onChange={(e) => setEditWeight(parseFloat(e.target.value) || 0)}
                      className="flex-1 h-14 bg-bg-input border border-border-light rounded-lg text-center font-mono font-bold text-3xl text-text-primary focus:border-accent-gold focus:outline-none"
                      onFocus={(e) => e.target.select()}
                    />
                    <button
                      type="button"
                      onClick={() => setEditWeight(editWeight + 2.5)}
                      className="w-12 h-14 bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Reps input */}
                <div>
                  <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted block mb-1">
                    REPS
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditReps(Math.max(1, editReps - 1))}
                      className="w-12 h-14 bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={editReps || ''}
                      onChange={(e) => setEditReps(parseInt(e.target.value) || 0)}
                      className="flex-1 h-14 bg-bg-input border border-border-light rounded-lg text-center font-mono font-bold text-3xl text-text-primary focus:border-accent-gold focus:outline-none"
                      onFocus={(e) => e.target.select()}
                    />
                    <button
                      type="button"
                      onClick={() => setEditReps(editReps + 1)}
                      className="w-12 h-14 bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* RPE selector */}
                <div>
                  <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted block mb-1">
                    RPE
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {RPE_VALUES.map((rpe) => {
                      const isSelected = editRPE === rpe;
                      const color =
                        rpe >= 9.5
                          ? 'bg-accent-red text-white'
                          : rpe >= 9
                          ? 'bg-accent-red-dim text-white'
                          : rpe >= 8
                          ? 'bg-accent-gold text-black'
                          : rpe >= 7
                          ? 'bg-accent-green-dim text-white'
                          : 'bg-bg-tertiary text-text-secondary';
                      return (
                        <button
                          key={rpe}
                          type="button"
                          onClick={() => setEditRPE(rpe)}
                          className={`min-w-[42px] h-11 rounded-lg font-mono text-sm font-bold transition-all ${
                            isSelected
                              ? `${color} ring-2 ring-white/30 scale-105`
                              : 'bg-bg-input text-text-muted hover:bg-bg-tertiary'
                          }`}
                        >
                          {rpe}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* e1RM preview */}
                {editE1RM > 0 && (
                  <div className={`text-center py-2 rounded-lg ${
                    editWouldBePR ? 'bg-accent-gold/10 border border-accent-gold/30' : 'bg-bg-tertiary'
                  }`}>
                    <span className="text-xs font-display text-text-muted uppercase tracking-wider">
                      e1RM:{' '}
                    </span>
                    <span className={`text-xl font-mono font-bold ${
                      editWouldBePR ? 'text-accent-gold' : 'text-text-primary'
                    }`}>
                      {editE1RM.toFixed(1)}
                    </span>
                    {editWouldBePR && (
                      <span className="text-xs font-display text-accent-gold ml-2 uppercase tracking-wider">
                        NOVO PR!
                      </span>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingSet(null)}
                    className="flex-1 h-12 bg-bg-tertiary border border-border rounded-lg font-display font-semibold text-sm text-text-muted uppercase tracking-wider active:bg-border transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveEditSet}
                    disabled={editWeight <= 0 || editReps <= 0}
                    className={`flex-1 h-12 rounded-lg font-display font-bold text-sm uppercase tracking-wider transition-all ${
                      editWeight <= 0 || editReps <= 0
                        ? 'bg-bg-tertiary text-text-muted'
                        : 'bg-accent-gold text-black active:scale-[0.98]'
                    }`}
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Workout complete */}
        {workout.completed && (
          <div className="bg-accent-green/10 border border-accent-green/30 rounded-lg p-6 text-center space-y-3 animate-fade-in">
            <CheckCircle2 size={32} className="text-accent-green" />
            <div className="text-lg font-display font-bold text-accent-green uppercase tracking-wider">
              Treino Concluído
            </div>
            <div className="text-xs font-mono text-text-muted">
              {completedSets} séries completadas
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full h-12 bg-accent-green text-white rounded-lg font-display font-bold uppercase tracking-wider hover:bg-accent-green/90 active:scale-[0.98] transition-all"
            >
              Voltar ao Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
