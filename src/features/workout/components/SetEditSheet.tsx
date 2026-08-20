import { RPE_SCALE, getRPEColor, getRIRText } from '../../../domain/rpe';
import { calculateE1RM } from '../../../utils/calculations';
import { useStorage } from '../../../contexts/StorageContext';
import type { ExerciseLog } from '../../../types';

interface SetEditSheetProps {
  exercise: ExerciseLog;
  setIdx: number;
  editWeight: number;
  editReps: number;
  editRPE: number;
  onWeightChange: (w: number) => void;
  onRepsChange: (r: number) => void;
  onRPEChange: (rpe: number) => void;
  onSave: () => void;
  onClose: () => void;
}

export function SetEditSheet({
  exercise,
  setIdx,
  editWeight,
  editReps,
  editRPE,
  onWeightChange,
  onRepsChange,
  onRPEChange,
  onSave,
  onClose,
}: SetEditSheetProps) {
  const storage = useStorage();
  const editE1RM = editWeight > 0 && editReps > 0 ? calculateE1RM(editWeight, editReps, editRPE) : 0;
  const editRecord = storage.getRecordForExercise(exercise.exerciseId);
  const editWouldBePR = editE1RM > (editRecord?.e1rm || 0) && editE1RM > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
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
            Editar Série {setIdx + 1}
          </div>
          <div className="text-sm font-display font-bold text-text-primary uppercase tracking-wider">
            {exercise.exerciseName}
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
              onClick={() => onWeightChange(Math.max(0, editWeight - 2.5))}
              className="w-12 h-14 bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border"
            >
              −
            </button>
            <input
              type="number"
              inputMode="decimal"
              value={editWeight || ''}
              onChange={(e) => onWeightChange(parseFloat(e.target.value) || 0)}
              className="flex-1 h-14 bg-bg-input border border-border-light rounded-lg text-center font-mono font-bold text-3xl text-text-primary focus:border-accent-gold focus:outline-none"
              onFocus={(e) => e.target.select()}
            />
            <button
              type="button"
              onClick={() => onWeightChange(editWeight + 2.5)}
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
              onClick={() => onRepsChange(Math.max(1, editReps - 1))}
              className="w-12 h-14 bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border"
            >
              −
            </button>
            <input
              type="number"
              inputMode="numeric"
              value={editReps || ''}
              onChange={(e) => onRepsChange(parseInt(e.target.value) || 0)}
              className="flex-1 h-14 bg-bg-input border border-border-light rounded-lg text-center font-mono font-bold text-3xl text-text-primary focus:border-accent-gold focus:outline-none"
              onFocus={(e) => e.target.select()}
            />
            <button
              type="button"
              onClick={() => onRepsChange(editReps + 1)}
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
            {RPE_SCALE.map((rpe) => {
              const isSelected = editRPE === rpe;
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
            {getRIRText(editRPE)}
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
            onClick={onClose}
            className="flex-1 h-12 bg-bg-tertiary border border-border rounded-lg font-display font-semibold text-sm text-text-muted uppercase tracking-wider active:bg-border transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
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
}
