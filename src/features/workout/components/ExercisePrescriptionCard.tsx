import { Info, Repeat } from 'lucide-react';
import type { ExerciseLog } from '../../../types';

interface ExercisePrescriptionCardProps {
  exercise: ExerciseLog;
  /** Variações que o programa permite, com os ids correspondentes. */
  alternatives?: { name: string; exerciseId: string }[];
  onSwapVariation?: (exerciseId: string, exerciseName: string) => void;
}

/**
 * Mostra a linha do programa exatamente como está no material de origem:
 * séries de aquecimento, séries de trabalho, reps, %1RM, RPE, descanso e a
 * nota completa. É a parte que garante que nada da prescrição se perca.
 */
export function ExercisePrescriptionCard({
  exercise,
  alternatives,
  onSwapVariation,
}: ExercisePrescriptionCardProps) {
  const chips: { label: string; value: string }[] = [];

  if (exercise.warmupSets) chips.push({ label: 'Aquec.', value: `${exercise.warmupSets}` });
  chips.push({
    label: 'Séries',
    value: `${exercise.prescribedSets}${exercise.perSide ? ' /lado' : ''}`,
  });
  chips.push({ label: 'Reps', value: exercise.prescribedReps });
  if (exercise.percent1RM) chips.push({ label: '%1RM', value: exercise.percent1RM });
  chips.push({ label: 'RPE', value: exercise.prescribedRPE });
  if (exercise.restLabel) chips.push({ label: 'Descanso', value: exercise.restLabel });

  return (
    <div className="bg-bg-card border border-border rounded-lg p-3 space-y-2">
      <div className="grid grid-cols-3 gap-1.5">
        {chips.map((chip) => (
          <div key={chip.label} className="bg-bg-tertiary rounded px-2 py-1.5 text-center">
            <div className="text-[9px] font-display uppercase tracking-wider text-text-muted">
              {chip.label}
            </div>
            <div className="text-sm font-mono font-bold text-text-primary">{chip.value}</div>
          </div>
        ))}
      </div>

      {exercise.prescribedNotes && (
        <div className="flex gap-2 items-start bg-accent-blue/5 border border-accent-blue/20 rounded px-2 py-1.5">
          <Info size={13} className="text-accent-blue flex-shrink-0 mt-0.5" />
          <p className="text-xs font-display text-text-secondary leading-relaxed">
            {exercise.prescribedNotes}
          </p>
        </div>
      )}

      {alternatives && alternatives.length > 0 && onSwapVariation && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Repeat size={12} className="text-text-muted" />
          <span className="text-[10px] font-display uppercase tracking-wider text-text-muted">
            Variação:
          </span>
          {alternatives.map((alt) => {
            const active = exercise.exerciseId === alt.exerciseId;
            return (
              <button
                key={`${alt.exerciseId}-${alt.name}`}
                type="button"
                onClick={() => onSwapVariation(alt.exerciseId, alt.name)}
                className={`px-2 py-1 rounded text-[11px] font-display transition-colors ${
                  active
                    ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/40'
                    : 'bg-bg-tertiary text-text-secondary border border-border hover:border-accent-gold/40'
                }`}
              >
                {alt.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
