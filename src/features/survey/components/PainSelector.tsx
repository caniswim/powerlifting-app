import { ScaleSelector } from '../../../components/ui';
import { painRegionLabels } from '../../../domain/painRegions';
import type { PainEntry, PainRegion } from '../../../types';

interface PainSelectorProps {
  hasPain: boolean;
  onHasPainChange: (value: boolean) => void;
  painEntries: PainEntry[];
  onPainEntriesChange: (entries: PainEntry[]) => void;
}

export function PainSelector({
  hasPain,
  onHasPainChange,
  painEntries,
  onPainEntriesChange,
}: PainSelectorProps) {
  const regions = Object.keys(painRegionLabels) as PainRegion[];

  const isRegionSelected = (region: PainRegion) =>
    painEntries.some((entry) => entry.region === region);

  const toggleRegion = (region: PainRegion) => {
    if (isRegionSelected(region)) {
      onPainEntriesChange(painEntries.filter((entry) => entry.region !== region));
    } else {
      onPainEntriesChange([...painEntries, { region, intensity: 5 }]);
    }
  };

  const updateIntensity = (region: PainRegion, intensity: number) => {
    onPainEntriesChange(
      painEntries.map((entry) =>
        entry.region === region ? { ...entry, intensity } : entry
      )
    );
  };

  const getRegionIntensity = (region: PainRegion) => {
    const entry = painEntries.find((e) => e.region === region);
    return entry?.intensity || 5;
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            onHasPainChange(false);
            onPainEntriesChange([]);
          }}
          className={`flex-1 h-11 rounded font-display font-semibold text-sm transition-all ${
            !hasPain
              ? 'bg-accent-gold text-black ring-2 ring-accent-gold/30'
              : 'bg-bg-input text-text-muted hover:bg-bg-tertiary'
          }`}
        >
          NÃO
        </button>
        <button
          type="button"
          onClick={() => onHasPainChange(true)}
          className={`flex-1 h-11 rounded font-display font-semibold text-sm transition-all ${
            hasPain
              ? 'bg-accent-gold text-black ring-2 ring-accent-gold/30'
              : 'bg-bg-input text-text-muted hover:bg-bg-tertiary'
          }`}
        >
          SIM
        </button>
      </div>

      {hasPain && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {regions.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => toggleRegion(region)}
                className={`h-10 rounded border font-display text-xs font-semibold transition-all ${
                  isRegionSelected(region)
                    ? 'bg-accent-gold/20 border-accent-gold/40 text-accent-gold'
                    : 'bg-bg-input border-border text-text-muted hover:bg-bg-tertiary'
                }`}
              >
                {painRegionLabels[region]}
              </button>
            ))}
          </div>

          {painEntries.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-border">
              {painEntries.map((entry) => (
                <div key={entry.region} className="space-y-2">
                  <div className="text-xs font-display font-semibold tracking-wider uppercase text-accent-gold">
                    {painRegionLabels[entry.region]} - Intensidade
                  </div>
                  <ScaleSelector
                    value={getRegionIntensity(entry.region)}
                    onChange={(intensity) => updateIntensity(entry.region, intensity)}
                    min={1}
                    max={10}
                    lowLabel="Leve"
                    highLabel="Forte"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
