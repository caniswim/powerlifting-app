import { getRPEColor, getRIRText } from '../../../domain/rpe';
import type { LoadSuggestion, ReadinessRecommendation } from '../../../utils/calculations';
import type { ExerciseLog, PersonalRecord } from '../../../types';

const RPE_VALUES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

const readinessColors: Record<string, string> = {
  high: 'bg-accent-green/10 border-accent-green/30 text-accent-green',
  normal: 'bg-bg-tertiary border-border text-text-muted',
  reduced: 'bg-accent-gold/10 border-accent-gold/30 text-accent-gold',
  low: 'bg-accent-red/10 border-accent-red/30 text-accent-red',
};

interface SetInputFormProps {
  exercise: ExerciseLog;
  activeSetIdx: number;
  inputWeight: number;
  inputReps: number;
  inputRPE: number;
  suggestion: LoadSuggestion | null;
  currentE1RM: number;
  currentRecord: PersonalRecord | null;
  wouldBePR: boolean;
  readinessRec?: ReadinessRecommendation | null;
  onWeightChange: (w: number) => void;
  onRepsChange: (r: number) => void;
  onRPEChange: (rpe: number) => void;
  onCompleteSet: () => void;
}

export function SetInputForm({
  exercise,
  activeSetIdx,
  inputWeight,
  inputReps,
  inputRPE,
  suggestion,
  currentE1RM,
  currentRecord,
  wouldBePR,
  readinessRec,
  onWeightChange,
  onRepsChange,
  onRPEChange,
  onCompleteSet,
}: SetInputFormProps) {
  return (
    <div className={`bg-bg-card border rounded-lg p-4 space-y-4 ${
      wouldBePR ? 'border-accent-gold/50 pr-glow' : 'border-border'
    }`}>
      {/* Exercise header */}
      <div>
        <div className="flex items-center gap-2">
          {exercise.supersetGroup && (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-accent-purple/20 text-accent-purple text-xs font-mono font-bold flex-shrink-0">
              {exercise.supersetGroup}
            </span>
          )}
          <span className="text-lg font-display font-bold text-text-primary uppercase tracking-wider">
            {exercise.exerciseName}
          </span>
        </div>
        <div className="text-xs font-mono text-text-muted mt-0.5">
          Prescrito: {exercise.prescribedSets}x{exercise.prescribedReps} @ RPE{' '}
          {exercise.prescribedRPE}
        </div>
        {currentRecord && (
          <div className="text-xs font-mono text-accent-gold mt-0.5">
            PR: {currentRecord.e1rm.toFixed(1)} e1RM ({currentRecord.weight}x{currentRecord.reps} @{currentRecord.rpe})
          </div>
        )}
      </div>

      {/* Readiness banner — transparent, shown only on first set, only when not 'normal' */}
      {readinessRec && readinessRec.level !== 'normal' && activeSetIdx === 0 && (
        <div className={`rounded-md border px-3 py-2 ${readinessColors[readinessRec.level]}`}>
          <div className="text-[10px] font-display font-semibold tracking-wider uppercase">
            Prontidão {readinessRec.label}
          </div>
          <div className="text-xs font-display mt-0.5 opacity-90">
            {readinessRec.loadGuidance}
          </div>
        </div>
      )}

      {/* Set indicators */}
      <div className="flex gap-1.5">
        {exercise.sets.map((set, i) => (
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
        Série {activeSetIdx + 1} de {exercise.sets.length}
      </div>

      {/* Input area (only for incomplete sets) */}
      {exercise.sets[activeSetIdx] && !exercise.sets[activeSetIdx].completed && (
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
                onClick={() => onWeightChange(Math.max(0, inputWeight - 2.5))}
                className="w-12 h-14 bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border"
              >
                −
              </button>
              <input
                type="number"
                inputMode="decimal"
                value={inputWeight || ''}
                onChange={(e) => onWeightChange(parseFloat(e.target.value) || 0)}
                className="flex-1 h-14 bg-bg-input border border-border-light rounded-lg text-center font-mono font-bold text-3xl text-text-primary focus:border-accent-gold focus:outline-none"
                onFocus={(e) => e.target.select()}
              />
              <button
                type="button"
                onClick={() => onWeightChange(inputWeight + 2.5)}
                className="w-12 h-14 bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border"
              >
                +
              </button>
            </div>
          </div>

          {/* Reps input */}
          <div>
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted block mb-1">
              REPS (Alvo: {exercise.prescribedReps})
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onRepsChange(Math.max(1, inputReps - 1))}
                className="w-12 h-14 bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border"
              >
                −
              </button>
              <input
                type="number"
                inputMode="numeric"
                value={inputReps || ''}
                onChange={(e) => onRepsChange(parseInt(e.target.value) || 0)}
                className="flex-1 h-14 bg-bg-input border border-border-light rounded-lg text-center font-mono font-bold text-3xl text-text-primary focus:border-accent-gold focus:outline-none"
                onFocus={(e) => e.target.select()}
              />
              <button
                type="button"
                onClick={() => onRepsChange(inputReps + 1)}
                className="w-12 h-14 bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border"
              >
                +
              </button>
            </div>
          </div>

          {/* RPE selector */}
          <div>
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted block mb-1">
              RPE (Alvo: {exercise.prescribedRPE})
            </label>
            <div className="flex flex-wrap gap-1.5">
              {RPE_VALUES.map((rpe) => {
                const isSelected = inputRPE === rpe;
                return (
                  <button
                    key={rpe}
                    type="button"
                    onClick={() => onRPEChange(rpe)}
                    className={`min-w-[42px] h-11 rounded-lg font-mono text-sm font-bold transition-all ${
                      isSelected
                        ? `${getRPEColor(rpe)} ring-2 ring-white/30 scale-105`
                        : 'bg-bg-input text-text-muted hover:bg-bg-tertiary'
                    }`}
                  >
                    {rpe}
                  </button>
                );
              })}
            </div>
            <div className="text-xs font-mono text-text-muted mt-1.5 text-center">
              {getRIRText(inputRPE)}
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
            onClick={onCompleteSet}
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
      {exercise.sets.every((s) => s.completed) && (
        <div className="text-center py-3">
          <span className="text-sm font-display font-semibold text-accent-green uppercase tracking-wider">
            Exercício concluído
          </span>
        </div>
      )}
    </div>
  );
}
