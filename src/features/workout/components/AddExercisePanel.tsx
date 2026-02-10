import { exerciseNames } from '../../../data/exerciseMuscleMap';
import type { ExerciseLog } from '../../../types';

interface AddExercisePanelProps {
  currentExercises: ExerciseLog[];
  onAdd: (exerciseId: string) => void;
}

export function AddExercisePanel({ currentExercises, onAdd }: AddExercisePanelProps) {
  return (
    <div className="bg-bg-card border border-border rounded-lg p-4 animate-fade-in space-y-2">
      <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted block">
        Adicionar Exercício Extra
      </label>
      <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-none">
        {Object.entries(exerciseNames)
          .filter(
            ([id]) => !currentExercises.some((ex) => ex.exerciseId === id)
          )
          .map(([id, name]) => (
            <button
              key={id}
              onClick={() => onAdd(id)}
              className="w-full text-left px-3 py-2 rounded text-sm font-display text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors"
            >
              {name}
            </button>
          ))}
      </div>
    </div>
  );
}
