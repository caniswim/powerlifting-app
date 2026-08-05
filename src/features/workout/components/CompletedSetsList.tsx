import { Pencil } from 'lucide-react';
import type { SetLog } from '../../../types';

interface CompletedSetsListProps {
  sets: SetLog[];
  exIdx: number;
  onEditSet: (exIdx: number, setIdx: number) => void;
}

function describe(set: SetLog): string {
  if (set.segments?.length) {
    return set.segments
      .map((seg) => `${seg.label} ${seg.weight}kg×${seg.seconds ? `${seg.seconds}s` : seg.reps}`)
      .join(' · ');
  }
  if (set.unit === 'seconds') {
    return `${set.weight > 0 ? `${set.weight}kg × ` : ''}${set.durationSec ?? 0}s @${set.rpe}`;
  }
  return `${set.weight}kg × ${set.reps} @${set.rpe}`;
}

export function CompletedSetsList({ sets, exIdx, onEditSet }: CompletedSetsListProps) {
  if (!sets.some((s) => s.completed)) return null;

  let warmupCount = 0;
  let workingCount = 0;

  return (
    <div className="space-y-1">
      {sets.map((set, i) => {
        const isWarmup = set.setType === 'warmup';
        if (isWarmup) warmupCount++;
        else workingCount++;
        const label = isWarmup ? `A${warmupCount}` : `S${workingCount}`;
        if (!set.completed) return null;

        return (
          <button
            key={i}
            onClick={() => onEditSet(exIdx, i)}
            className={`flex justify-between items-center w-full px-2 py-1.5 rounded text-xs transition-colors ${
              set.isPR
                ? 'bg-accent-gold/10 text-accent-gold active:bg-accent-gold/20'
                : isWarmup
                ? 'text-text-muted/60 active:bg-bg-tertiary'
                : 'text-text-muted active:bg-bg-tertiary'
            }`}
          >
            <span className="font-mono">{label}</span>
            <span className="font-mono font-bold">{describe(set)}</span>
            <span className="font-mono flex items-center gap-1.5">
              {set.e1rm > 0 ? set.e1rm.toFixed(1) : '—'}{set.isPR ? ' PR' : ''}
              <Pencil size={10} className="opacity-40" />
            </span>
          </button>
        );
      })}
    </div>
  );
}
