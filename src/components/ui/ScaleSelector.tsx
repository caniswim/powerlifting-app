interface ScaleSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  lowLabel?: string;
  highLabel?: string;
}

export function ScaleSelector({
  value,
  onChange,
  min = 1,
  max = 10,
  lowLabel,
  highLabel,
}: ScaleSelectorProps) {
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="flex flex-wrap gap-1">
      {values.map((v, idx) => (
        <div key={v} className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={() => onChange(v)}
            className={`min-w-[36px] h-11 rounded font-mono text-sm font-bold transition-all ${
              value === v
                ? 'bg-accent-gold text-black scale-105 ring-2 ring-accent-gold/30'
                : 'bg-bg-input text-text-muted hover:bg-bg-tertiary'
            }`}
          >
            {v}
          </button>
          {idx === 0 && lowLabel && (
            <span className="text-[10px] text-text-muted font-display">{lowLabel}</span>
          )}
          {idx === values.length - 1 && highLabel && (
            <span className="text-[10px] text-text-muted font-display">{highLabel}</span>
          )}
        </div>
      ))}
    </div>
  );
}
