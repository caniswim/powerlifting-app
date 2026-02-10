import { ArrowLeft } from 'lucide-react';
import { dayTypeLabels } from '../../../domain/dayTypeLabels';
import type { WorkoutLog, PrescribedWeek } from '../../../types';

interface WorkoutHeaderProps {
  workout: WorkoutLog;
  weekData: PrescribedWeek | null;
  sessionIndex: number;
  completedSets: number;
  totalSets: number;
  progressPercent: number;
  onBack: () => void;
}

export function WorkoutHeader({
  workout,
  weekData,
  sessionIndex,
  completedSets,
  totalSets,
  progressPercent,
  onBack,
}: WorkoutHeaderProps) {
  return (
    <>
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-bg-secondary border-b border-border" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-lg mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <button
              onClick={onBack}
              className="text-text-muted font-display text-sm"
            >
              <ArrowLeft size={16} className="inline mr-1" />Voltar
            </button>
            <div className="text-xs font-mono text-text-muted">
              Sessão {sessionIndex + 1}/208 · {completedSets}/{totalSets} séries
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

      {/* Workout info */}
      <div className="max-w-lg mx-auto px-4 pt-4">
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
      </div>
    </>
  );
}
