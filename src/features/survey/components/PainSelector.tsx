import { ScaleSelector } from '../../../components/ui';
import { painRegionLabels } from '../../../domain/painRegions';
import { PAIN_GATE, painGateScope } from '../../../domain/painGate';
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

          {/*
            O programa manda logar dor referida de bíceps COMO peitoral
            (PROGRAMA.md §1.2, [R95 @03:10]) — o tendão do peitoral se insere
            perto do bíceps. Sem esta linha, o registro correto depende de o
            atleta lembrar da claim na hora de apertar o botão.
          */}
          <p className="text-[11px] leading-snug text-text-muted">
            Fisgada ou dor no bíceps entra como <strong>peitoral</strong> até prova em
            contrário. Na dúvida sobre a região, registre peitoral, não "Outro".
          </p>

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
                  {painGateScope(entry.region) === 'peitoral' &&
                    getRegionIntensity(entry.region) >= PAIN_GATE.limiarMinimo && (
                      <p className="text-[11px] leading-snug text-accent-red">
                        Gate {PAIN_GATE.secao} disparado a partir de {PAIN_GATE.limiarMinimo}/10:
                        o supino não sobe carga nem degrau de exposição esta semana.
                      </p>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
