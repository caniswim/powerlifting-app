import { getRPEColor } from '../../domain/rpe';

const RPE_VALUES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

interface RPESelectorProps {
  value: number;
  onChange: (value: number) => void;
  target?: string;
}

export function RPESelector({ value, onChange, target }: RPESelectorProps) {
  return (
    <div>
      {target && (
        <div className="text-xs text-text-muted mb-1 font-display">
          ALVO: RPE {target}
        </div>
      )}
      <div className="flex flex-wrap gap-1">
        {RPE_VALUES.map((rpe) => (
          <button
            key={rpe}
            type="button"
            onClick={() => onChange(rpe)}
            className={`min-w-[40px] h-10 rounded font-mono text-sm font-bold transition-all ${
              value === rpe
                ? `${getRPEColor(rpe)} ring-2 ring-white/30 scale-105`
                : 'bg-bg-input text-text-muted hover:bg-bg-tertiary'
            }`}
          >
            {rpe}
          </button>
        ))}
      </div>
    </div>
  );
}
