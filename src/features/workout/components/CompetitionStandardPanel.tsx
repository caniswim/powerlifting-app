import { useState } from 'react';
import { ChevronDown, ChevronUp, Video } from 'lucide-react';
import {
  barTypeLabels,
  equipmentFields,
  equipmentLabels,
  plateTypeLabels,
  squatDepthLabels,
  squatDepthOrder,
  videoAngleLabels,
} from '../../../domain/competitionStandard';
import type {
  BarType,
  PercentRef,
  PlateType,
  SetCompliance,
  SquatDepth,
  VideoAngle,
} from '../../../types';

interface Props {
  lift: PercentRef;
  /** Reps registradas na série — teto para "reps válidas". */
  reps: number;
  value: SetCompliance;
  onChange: (patch: Partial<SetCompliance>) => void;
}

const chip = 'px-2.5 h-9 rounded-lg text-xs font-display uppercase tracking-wider transition-colors border';
const chipOff = 'bg-bg-input border-border text-text-muted';
const chipOn = 'bg-accent-gold/20 border-accent-gold/50 text-accent-gold';
const chipWarn = 'bg-accent-red/20 border-accent-red/50 text-accent-red';
const label = 'text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted';

function Select<T extends string>({
  value, options, placeholder, onChange,
}: {
  value: T | undefined;
  options: Record<string, string>;
  placeholder: string;
  onChange: (v: T | undefined) => void;
}) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange((e.target.value || undefined) as T | undefined)}
      className="w-full h-9 bg-bg-input border border-border rounded-lg px-2 text-xs font-display text-text-primary focus:border-accent-gold focus:outline-none"
    >
      <option value="">{placeholder}</option>
      {Object.entries(options).map(([key, text]) => (
        <option key={key} value={key}>{text}</option>
      ))}
    </select>
  );
}

/**
 * Registro do padrão de competição de uma série.
 *
 * Só aparece nos três levantamentos. Fechado por padrão: quem não julgou a
 * série não é obrigado a tocar em nada, e a série fica gravada como "não
 * julgada" — que é o registro honesto.
 */
export function CompetitionStandardPanel({ lift, reps, value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const judged = value.validReps !== undefined;
  const invalid = judged && reps > 0 && (value.validReps ?? 0) < reps;
  const gear = value.equipment ?? {};

  const summary = judged
    ? `${value.validReps}/${reps || '—'} válidas`
    : 'não julgada';

  const toggleGear = (field: keyof typeof gear) => {
    onChange({ equipment: { ...gear, [field]: !gear[field] } });
  };

  const setValidReps = (n: number | undefined) => {
    onChange({
      validReps: n,
      ...(n !== undefined && !value.judgedBy ? { judgedBy: 'self' as const } : {}),
    });
  };

  return (
    <div className="border border-border rounded-lg bg-bg-tertiary/40">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 h-10"
      >
        <span className={label}>Padrão de competição</span>
        <span className="flex items-center gap-2">
          <span className={`text-[10px] font-mono ${invalid ? 'text-accent-red' : judged ? 'text-accent-green' : 'text-text-muted'}`}>
            {summary}
          </span>
          {value.video && <Video size={12} className="text-accent-blue" />}
          {open ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />}
        </span>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-3">
          {/* Reps válidas */}
          <div className="space-y-1">
            <div className={label}>Reps válidas (padrão IPF)</div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setValidReps(undefined)}
                className={`${chip} ${!judged ? chipOn : chipOff}`}
              >
                Não julguei
              </button>
              {Array.from({ length: Math.max(0, Math.min(reps, 12)) + 1 }, (_, i) => i).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setValidReps(n)}
                  className={`${chip} min-w-[38px] font-mono ${
                    value.validReps === n ? (n < reps ? chipWarn : chipOn) : chipOff
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Específico do levantamento */}
          {lift === 'squat' && (
            <div className="space-y-1">
              <div className={label}>Profundidade</div>
              <div className="flex flex-wrap gap-1.5">
                {squatDepthOrder.map((d: SquatDepth) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => onChange({ depth: value.depth === d ? undefined : d })}
                    className={`${chip} ${
                      value.depth === d
                        ? d === 'above_parallel' ? chipWarn : chipOn
                        : chipOff
                    }`}
                  >
                    {squatDepthLabels[d]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {lift === 'bench' && (
            <div className="space-y-1">
              <div className={label}>Pausa no peito</div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onChange({ paused: !value.paused })}
                  className={`${chip} ${value.paused ? chipOn : chipOff}`}
                >
                  Pausa real
                </button>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  placeholder="seg"
                  value={value.pauseSec ?? ''}
                  onChange={(e) => {
                    const n = parseFloat(e.target.value);
                    onChange({ pauseSec: Number.isFinite(n) ? n : undefined });
                  }}
                  className="w-20 h-9 bg-bg-input border border-border rounded-lg text-center font-mono text-xs text-text-primary focus:border-accent-gold focus:outline-none"
                />
                <span className="text-[10px] font-display text-text-muted">segundos</span>
              </div>
            </div>
          )}

          {lift === 'deadlift' && (
            <div className="space-y-1">
              <div className={label}>Execução</div>
              <button
                type="button"
                onClick={() => onChange({ deadStop: !value.deadStop })}
                className={`${chip} ${value.deadStop ? chipOn : chipOff}`}
              >
                Parada morta (sem touch-and-go)
              </button>
            </div>
          )}

          {/* Equipamento */}
          <div className="space-y-1">
            <div className={label}>Equipamento</div>
            <div className="flex flex-wrap gap-1.5">
              {equipmentFields.map((field) => (
                <button
                  key={field}
                  type="button"
                  onClick={() => toggleGear(field)}
                  className={`${chip} ${
                    gear[field] ? (field === 'straps' ? chipWarn : chipOn) : chipOff
                  }`}
                >
                  {equipmentLabels[field]}
                </button>
              ))}
            </div>
          </div>

          {/* Material */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className={label}>Barra</div>
              <Select<BarType>
                value={value.bar}
                options={barTypeLabels}
                placeholder="—"
                onChange={(bar) => onChange({ bar })}
              />
            </div>
            <div className="space-y-1">
              <div className={label}>Anilha</div>
              <Select<PlateType>
                value={value.plates}
                options={plateTypeLabels}
                placeholder="—"
                onChange={(plates) => onChange({ plates })}
              />
            </div>
          </div>

          {/* Vídeo */}
          <div className="space-y-1">
            <div className={label}>Vídeo da série</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="link ou arquivo"
                value={value.video?.url ?? ''}
                onChange={(e) => {
                  const url = e.target.value.trim();
                  onChange({ video: url ? { ...value.video, url } : undefined });
                }}
                className="h-9 bg-bg-input border border-border rounded-lg px-2 text-xs font-mono text-text-primary focus:border-accent-gold focus:outline-none"
              />
              <Select<VideoAngle>
                value={value.video?.angle}
                options={videoAngleLabels}
                placeholder="ângulo"
                onChange={(angle) => onChange({ video: { ...value.video, angle } })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
