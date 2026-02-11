import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Trophy, AlertTriangle } from 'lucide-react';
import { calculateE1RM } from '../utils/calculations';
import { useStorage } from '../contexts/StorageContext';
import { useWorkoutSession } from '../features/workout/hooks/useWorkoutSession';
import { useLoadSuggestion } from '../features/workout/hooks/useLoadSuggestion';
import { useSetCompletion } from '../features/workout/hooks/useSetCompletion';
import { useRestWarning } from '../features/workout/hooks/useRestWarning';
import { WorkoutHeader } from '../features/workout/components/WorkoutHeader';
import { PRFlashBanner } from '../features/workout/components/PRFlashBanner';
import { CompletedSetsList } from '../features/workout/components/CompletedSetsList';
import { SetInputForm } from '../features/workout/components/SetInputForm';
import { SetEditSheet } from '../features/workout/components/SetEditSheet';
import { AddExercisePanel } from '../features/workout/components/AddExercisePanel';
import { useWorkoutSurveys } from '../features/workout/hooks/useWorkoutSurveys';
import { PreWorkoutSurveySheet } from '../features/survey/components/PreWorkoutSurveySheet';
import { PostWorkoutSurveySheet } from '../features/survey/components/PostWorkoutSurveySheet';
import { TOTAL_SESSIONS } from '../services/scheduling';

export default function Workout() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const storage = useStorage();

  const loadSuggestion = useLoadSuggestion();
  const {
    inputWeight, inputReps, inputRPE,
    suggestion,
    setInputWeight, setInputReps, setInputRPE,
    prefillInputs,
  } = loadSuggestion;

  const session = useWorkoutSession(prefillInputs);
  const {
    workout, weekData, loading, programComplete,
    activeExIdx, activeSetIdx,
    showNotes, showAddExercise,
    setWorkout, setActiveExIdx, setActiveSetIdx,
    setShowNotes, setShowAddExercise,
    skipExercise, addExtraExercise, updateExerciseNotes,
  } = session;

  const { prFlash, editState, completeSet, saveEditSet } = useSetCompletion(
    workout, setWorkout,
    activeExIdx, activeSetIdx,
    setActiveExIdx, setActiveSetIdx,
    inputWeight, inputReps, inputRPE,
    prefillInputs,
  );

  const restWarning = useRestWarning();
  const surveys = useWorkoutSurveys(workout);

  // --- Loading ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // --- Program Complete ---
  if (programComplete) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center space-y-4">
          <Trophy size={48} className="text-accent-gold mx-auto" />
          <h1 className="text-2xl font-display font-bold text-accent-gold uppercase tracking-wider">
            Programa Completo!
          </h1>
          <p className="text-sm text-text-secondary font-display">
            Todas as {TOTAL_SESSIONS} sessões do programa de 52 semanas foram concluídas.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full h-12 bg-accent-gold text-black rounded-lg font-display font-bold uppercase tracking-wider hover:bg-accent-gold-bright active:scale-[0.98] transition-all"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- Rest Warning ---
  if (
    restWarning.showRestWarning &&
    !restWarning.restWarningDismissed &&
    !workout?.exercises.some(ex => ex.sets.some(s => s.completed))
  ) {
    const formatDate = (d: Date) => {
      const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      return `${days[d.getDay()]}, ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    };

    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
          <div className="bg-accent-gold/10 border border-accent-gold/40 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle size={24} className="text-accent-gold flex-shrink-0" />
              <h2 className="text-lg font-display font-bold text-accent-gold uppercase tracking-wider">
                Período de Descanso
              </h2>
            </div>
            <p className="text-sm text-text-secondary font-display leading-relaxed">
              O próximo treino está recomendado para{' '}
              <span className="text-text-primary font-semibold">
                {restWarning.recommendedDate ? formatDate(restWarning.recommendedDate) : '—'}
              </span>
              . Treinar antes pode comprometer a recuperação.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/')}
                className="flex-1 h-12 bg-bg-card border border-border rounded-lg font-display font-semibold text-sm text-text-secondary uppercase tracking-wider"
              >
                Voltar
              </button>
              <button
                onClick={restWarning.dismissRestWarning}
                className="flex-1 h-12 bg-accent-gold/20 border border-accent-gold/40 rounded-lg font-display font-semibold text-sm text-accent-gold uppercase tracking-wider"
              >
                Treinar mesmo assim
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- No Workout ---
  if (!workout) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-text-muted font-display">Nenhum treino disponível.</p>
      </div>
    );
  }

  // --- Pre-workout Survey ---
  if (surveys.phase === 'pre' && workout) {
    return <PreWorkoutSurveySheet workoutId={workout.id} onSubmit={surveys.submitPreSurvey} onSkip={surveys.skipPreSurvey} />;
  }

  // --- Derived state ---
  const currentExercise = workout.exercises[activeExIdx];
  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
    0
  );
  const progressPercent = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  const currentE1RM = inputWeight > 0 && inputReps > 0 ? calculateE1RM(inputWeight, inputReps, inputRPE) : 0;
  const currentRecord = storage.getRecordForExercise(currentExercise?.exerciseId || '') ?? null;
  const wouldBePR = currentE1RM > (currentRecord?.e1rm || 0) && currentE1RM > 0;
  const sessionIndex = storage.getSessionIndex();

  return (
    <div ref={containerRef} className="min-h-screen bg-bg-primary pb-4">
      <WorkoutHeader
        workout={workout}
        weekData={weekData}
        sessionIndex={sessionIndex}
        completedSets={completedSets}
        totalSets={totalSets}
        progressPercent={progressPercent}
        onBack={() => navigate('/')}
      />

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
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
                {ex.supersetGroup ? (
                  <span className="flex items-center gap-0.5">
                    <span className="text-[9px] text-accent-purple font-mono">{ex.supersetGroup}</span>
                    {i + 1}
                  </span>
                ) : (
                  i + 1
                )}
              </button>
            );
          })}
        </div>

        {/* Mini-session rest tip */}
        {workout.dayType === 'arms_shoulders' && !workout.completed && (
          <div className="bg-accent-purple/10 border border-accent-purple/20 rounded-lg px-3 py-2 flex items-center gap-2">
            <span className="text-accent-purple text-xs font-display font-semibold tracking-wider uppercase">
              Descanso: 60-90s entre supersets
            </span>
          </div>
        )}

        {/* PR Flash */}
        {prFlash && <PRFlashBanner exerciseId={prFlash} e1rm={currentE1RM} />}

        {/* Active Exercise Card */}
        {currentExercise && !currentExercise.skipped && (
          <>
            <CompletedSetsList
              sets={currentExercise.sets}
              exIdx={activeExIdx}
              onEditSet={editState.openEditSet}
            />
            <SetInputForm
              exercise={currentExercise}
              activeSetIdx={activeSetIdx}
              inputWeight={inputWeight}
              inputReps={inputReps}
              inputRPE={inputRPE}
              suggestion={suggestion}
              currentE1RM={currentE1RM}
              currentRecord={currentRecord}
              wouldBePR={wouldBePR}
              onWeightChange={setInputWeight}
              onRepsChange={setInputReps}
              onRPEChange={setInputRPE}
              onCompleteSet={completeSet}
            />
          </>
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
              onChange={(e) => updateExerciseNotes(e.target.value)}
              className="w-full h-20 bg-bg-input border border-border-light rounded-lg p-2 text-sm font-display text-text-primary focus:border-accent-gold focus:outline-none resize-none"
              placeholder="Observações técnicas, sensação, ajustes..."
            />
          </div>
        )}

        {/* Add exercise panel */}
        {showAddExercise && (
          <AddExercisePanel
            currentExercises={workout.exercises}
            onAdd={addExtraExercise}
          />
        )}

        {/* Edit Set Modal */}
        {editState.editingSet && (
          <SetEditSheet
            exercise={workout.exercises[editState.editingSet.exIdx]}
            setIdx={editState.editingSet.setIdx}
            editWeight={editState.editWeight}
            editReps={editState.editReps}
            editRPE={editState.editRPE}
            onWeightChange={editState.setEditWeight}
            onRepsChange={editState.setEditReps}
            onRPEChange={editState.setEditRPE}
            onSave={saveEditSet}
            onClose={editState.closeEditSet}
          />
        )}

        {/* Post-workout Survey */}
        {workout.completed && surveys.phase === 'post' && (
          <PostWorkoutSurveySheet workoutId={workout.id} onSubmit={surveys.submitPostSurvey} onSkip={surveys.skipPostSurvey} />
        )}

        {/* Workout complete */}
        {workout.completed && surveys.phase === 'done' && (
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
