import { ChartCard, EmptyChartMessage } from './ChartShared.tsx';
import type { VolumeData } from '../../../hooks/useVolumeTracking.ts';
import type { MuscleGroup } from '../../../types/index.ts';

const VOLUME_TARGETS: Partial<Record<MuscleGroup, number>> = {
  quads: 16,
  'glúteos': 10,
  erectors: 8,
  hamstrings: 10,
  peito: 16,
  'deltóide_anterior': 8,
  'deltóide_posterior': 14,
  'deltóide_lateral': 15,
  'tríceps': 17,
  'bíceps': 17,
  costas: 14,
  braquial: 6,
};

interface VolumeTargetBarsProps {
  volumeData: VolumeData[];
}

export function VolumeTargetBars({ volumeData }: VolumeTargetBarsProps) {
  return (
    <ChartCard title="VOLUME: REAL vs ALVO (ÚLTIMA SEMANA)">
      {volumeData.length > 0 ? (
        <div className="space-y-2">
          {volumeData
            .filter((v) => v.actual > 0 || (VOLUME_TARGETS[v.muscleGroup] ?? 0) > 0)
            .map((v) => {
              const target = VOLUME_TARGETS[v.muscleGroup] ?? 0;
              const ratio = target > 0 ? v.actual / target : 1;
              const isLow = ratio < 0.8;
              const isHigh = ratio > 1.2;
              const barWidth = target > 0 ? Math.min((v.actual / target) * 100, 150) : 0;

              return (
                <div key={v.muscleGroup} className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-display text-text-secondary">
                      {v.label}
                      {(isLow || isHigh) && (
                        <span
                          className={`ml-1.5 inline-block w-1.5 h-1.5 rounded-full ${
                            isLow ? 'bg-accent-red' : 'bg-accent-gold'
                          }`}
                          title={isLow ? 'Abaixo de 80% do alvo' : 'Acima de 120% do alvo'}
                        />
                      )}
                    </span>
                    <span className="text-xs font-mono text-text-muted">
                      {v.actual}
                      {target > 0 && (
                        <span className="text-text-muted"> / {target}</span>
                      )}
                    </span>
                  </div>
                  <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isLow
                          ? 'bg-accent-red'
                          : isHigh
                          ? 'bg-accent-gold'
                          : 'bg-accent-green'
                      }`}
                      style={{ width: `${Math.min(barWidth, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          <div className="flex items-center gap-4 pt-2 border-t border-border">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-red" />
              <span className="text-[10px] font-display text-text-muted">&lt;80% alvo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-green" />
              <span className="text-[10px] font-display text-text-muted">80-120%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-gold" />
              <span className="text-[10px] font-display text-text-muted">&gt;120% alvo</span>
            </div>
          </div>
        </div>
      ) : (
        <EmptyChartMessage text="Nenhum treino registrado no filtro selecionado" />
      )}
    </ChartCard>
  );
}
