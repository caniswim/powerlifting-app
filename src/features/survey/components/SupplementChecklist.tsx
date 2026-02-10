import { supplementLabels } from '../../../domain/surveyConfig';

interface SupplementChecklistProps {
  supplements: {
    creatine: boolean;
    protein: boolean;
    preWorkoutMeal: boolean;
  };
  onChange: (supplements: {
    creatine: boolean;
    protein: boolean;
    preWorkoutMeal: boolean;
  }) => void;
}

export function SupplementChecklist({ supplements, onChange }: SupplementChecklistProps) {
  const toggle = (key: keyof typeof supplements) => {
    onChange({ ...supplements, [key]: !supplements[key] });
  };

  return (
    <div className="flex gap-2">
      {(Object.keys(supplementLabels) as Array<keyof typeof supplementLabels>).map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => toggle(key)}
          className={`flex-1 h-11 rounded border font-display text-xs font-semibold transition-all ${
            supplements[key]
              ? 'bg-accent-gold/20 border-accent-gold/40 text-accent-gold'
              : 'bg-bg-input border-border text-text-muted hover:bg-bg-tertiary'
          }`}
        >
          {supplementLabels[key]}
        </button>
      ))}
    </div>
  );
}
