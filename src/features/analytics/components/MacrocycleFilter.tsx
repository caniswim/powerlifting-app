interface MacrocycleFilterProps {
  macroFilter: number | 'all';
  availableMacros: number[];
  onFilterChange: (value: number | 'all') => void;
}

export function MacrocycleFilter({ macroFilter, availableMacros, onFilterChange }: MacrocycleFilterProps) {
  const buttonClass = (active: boolean) =>
    `px-3 py-1.5 text-xs font-display font-semibold tracking-wider uppercase rounded border transition-colors whitespace-nowrap ${
      active
        ? 'bg-accent-gold/20 text-accent-gold border-accent-gold/30'
        : 'bg-bg-card text-text-muted border-border hover:text-text-secondary'
    }`;

  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-none pb-1">
      <button
        onClick={() => onFilterChange('all')}
        className={buttonClass(macroFilter === 'all')}
      >
        TODOS
      </button>
      {availableMacros.map((mc) => (
        <button
          key={mc}
          onClick={() => onFilterChange(mc)}
          className={buttonClass(macroFilter === mc)}
        >
          MACRO {mc}
        </button>
      ))}
      {availableMacros.length === 0 &&
        [1, 2, 3, 4].map((mc) => (
          <button
            key={mc}
            onClick={() => onFilterChange(mc)}
            className={buttonClass(macroFilter === mc)}
          >
            MACRO {mc}
          </button>
        ))}
    </div>
  );
}
