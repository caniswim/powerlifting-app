import { Pencil } from 'lucide-react';
import type { SetLog } from '../../types';

interface CompletedSetsListProps {
  sets: SetLog[];
  exIdx: number;
  onEditSet: (exIdx: number, setIdx: number) => void;
}

export function CompletedSetsList({ sets, exIdx, onEditSet }: CompletedSetsListProps) {
  const hasCompleted = sets.some((s) => s.completed);
  if (!hasCompleted) return null;

  return (
    <div className="space-y-1">
      {sets.map((set, i) =>
        set.completed ? (
          <button
            key={i}
            onClick={() => onEditSet(exIdx, i)}
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
  );
}
