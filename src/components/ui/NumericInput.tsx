import { useRef } from 'react';

interface NumericInputProps {
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
  large?: boolean;
  className?: string;
}

export function NumericInput({
  label,
  value,
  onChange,
  unit,
  step = 1,
  min = 0,
  max = 999,
  large = false,
  className = '',
}: NumericInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= min && val <= max) {
      onChange(val);
    } else if (e.target.value === '') {
      onChange(0);
    }
  };

  const increment = () => {
    const current = typeof value === 'string' ? parseFloat(value) || 0 : value;
    const next = Math.min(max, current + step);
    onChange(next);
  };

  const decrement = () => {
    const current = typeof value === 'string' ? parseFloat(value) || 0 : value;
    const next = Math.max(min, current - step);
    onChange(next);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
        {label}
      </label>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={decrement}
          className="w-10 h-10 bg-bg-tertiary border border-border rounded text-text-secondary font-bold text-lg active:bg-border transition-colors flex items-center justify-center"
        >
          −
        </button>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="number"
            inputMode="decimal"
            value={value}
            onChange={handleChange}
            step={step}
            min={min}
            max={max}
            className={`w-full bg-bg-input border border-border-light rounded text-center font-mono font-bold text-text-primary focus:border-accent-gold focus:outline-none transition-colors ${
              large ? 'h-14 text-2xl' : 'h-10 text-lg'
            }`}
            onFocus={() => inputRef.current?.select()}
          />
          {unit && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-text-muted font-display">
              {unit}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={increment}
          className="w-10 h-10 bg-bg-tertiary border border-border rounded text-text-secondary font-bold text-lg active:bg-border transition-colors flex items-center justify-center"
        >
          +
        </button>
      </div>
    </div>
  );
}
