import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Flame } from 'lucide-react';
import { useStorage } from '../contexts/StorageContext';
import { resolveReferenceMax } from '../domain/referenceMax';
import { roundToIncrement } from '../utils/calculations';
import {
  BARBELL_WEIGHT_KG,
  GENERAL_WARMUP,
  PYRAMID_STEPS,
  WARMUP_NOTES,
  WARMUP_RATIONALE,
  WARMUP_SOURCE,
} from '../data/program/powerbuilding2/warmup';
import type { PercentRef } from '../types';

const LIFTS: { ref: PercentRef; label: string }[] = [
  { ref: 'squat', label: 'Back Squat' },
  { ref: 'bench', label: 'Barbell Bench Press' },
  { ref: 'deadlift', label: 'Deadlift' },
  { ref: 'ohp', label: 'Barbell Overhead Press' },
];

export default function Warmup() {
  const navigate = useNavigate();
  const storage = useStorage();
  const profile = storage.getProfile();

  const [done, setDone] = useState<Record<number, boolean>>({});
  const [lift, setLift] = useState<PercentRef>('squat');

  const oneRM = useMemo(() => resolveReferenceMax(profile, lift), [lift, profile]);

  const completedCount = Object.values(done).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-lg mx-auto px-4 pt-4 pb-8 space-y-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-bg-card border border-border text-text-secondary"
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-display font-bold text-accent-gold uppercase tracking-wider flex items-center gap-2">
              <Flame size={18} /> Aquecimento
            </h1>
            <p className="text-[11px] font-mono text-text-muted">
              {completedCount}/{GENERAL_WARMUP.length} · 10-20 min no total
            </p>
          </div>
        </div>

        {/* Por que aquecer */}
        <section className="space-y-2">
          {WARMUP_RATIONALE.map((item) => (
            <div key={item.title} className="bg-bg-card border border-border rounded-lg p-3">
              <div className="text-xs font-display font-bold text-text-primary uppercase tracking-wider">
                {item.title}
              </div>
              <p className="text-xs font-display text-text-secondary leading-relaxed mt-1">
                {item.detail}
              </p>
            </div>
          ))}
        </section>

        {/* Parte 1 */}
        <section className="space-y-2">
          <h2 className="text-xs font-display font-bold text-text-muted uppercase tracking-wider">
            Parte 1 — Aquecimento geral (toda sessão)
          </h2>
          {GENERAL_WARMUP.map((drill, i) => {
            const checked = done[i] === true;
            return (
              <button
                key={drill.exercise}
                onClick={() => setDone((prev) => ({ ...prev, [i]: !prev[i] }))}
                className={`w-full text-left rounded-lg border p-3 transition-colors ${
                  checked
                    ? 'bg-accent-green/10 border-accent-green/40'
                    : 'bg-bg-card border-border hover:border-accent-gold/40'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border ${
                      checked ? 'bg-accent-green border-accent-green' : 'border-border-light'
                    }`}
                  >
                    {checked && <Check size={13} className="text-black" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-display font-semibold text-text-primary">
                        {drill.exercise}
                      </span>
                      {drill.optional && (
                        <span className="px-1.5 py-0.5 rounded bg-bg-tertiary text-text-muted text-[9px] font-display uppercase tracking-wider">
                          Optional
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-accent-gold mt-0.5">
                      {drill.sets !== 'N/A' ? `${drill.sets} × ` : ''}{drill.repsOrTime}
                    </div>
                    <p className="text-[11px] font-display text-text-muted leading-relaxed mt-1">
                      {drill.notes}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </section>

        {/* Parte 2 */}
        <section className="space-y-2">
          <h2 className="text-xs font-display font-bold text-text-muted uppercase tracking-wider">
            Parte 2 — Pirâmide (só antes dos exercícios primários)
          </h2>
          <p className="text-[11px] font-display text-text-secondary leading-relaxed">
            Antes do primeiro exercício de cada grupo muscular, suba em 3-4 séries progressivamente
            mais pesadas até as séries de trabalho. Só os exercícios primários precisam disso.
          </p>

          <div className="flex gap-1.5 flex-wrap">
            {LIFTS.map((l) => (
              <button
                key={l.ref}
                onClick={() => setLift(l.ref)}
                className={`px-2.5 py-1.5 rounded text-[11px] font-display font-semibold transition-colors ${
                  lift === l.ref
                    ? 'bg-accent-gold text-black'
                    : 'bg-bg-card text-text-secondary border border-border'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {oneRM > 0 ? (
            <div className="bg-bg-card border border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 gap-2 px-3 py-2 bg-bg-tertiary text-[9px] font-display uppercase tracking-wider text-text-muted">
                <span>Série</span>
                <span className="text-center">Carga</span>
                <span className="text-right">Reps</span>
              </div>
              {PYRAMID_STEPS.map((step, i) => (
                <div key={step.label} className="grid grid-cols-3 gap-2 px-3 py-2 border-t border-border text-xs">
                  <span className="font-mono text-text-muted">{i + 1}</span>
                  <span className="text-center font-mono font-bold text-text-primary">
                    {step.percent === null
                      ? `Barra (${BARBELL_WEIGHT_KG} kg)`
                      : `${roundToIncrement(oneRM * step.percent, 2.5)} kg`}
                    <span className="block text-[9px] font-display text-text-muted">{step.label}</span>
                  </span>
                  <span className="text-right font-mono text-text-secondary">{step.reps}</span>
                </div>
              ))}
              <div className="px-3 py-2 border-t border-accent-gold/30 bg-accent-gold/5 text-xs font-display font-semibold text-accent-gold uppercase tracking-wider text-center">
                Começar séries de trabalho
              </div>
            </div>
          ) : (
            <div className="bg-bg-card border border-border rounded-lg p-3 text-xs font-display text-text-muted">
              Cadastre o 1RM deste levantamento em Config para ver a pirâmide em kg.
            </div>
          )}
        </section>

        {/* Notas */}
        <section className="space-y-2">
          <h2 className="text-xs font-display font-bold text-text-muted uppercase tracking-wider">
            Observações
          </h2>
          {WARMUP_NOTES.map((note, i) => (
            <p key={i} className="text-[11px] font-display text-text-secondary leading-relaxed bg-bg-card border border-border rounded-lg p-3">
              {note}
            </p>
          ))}
          <p className="text-[10px] font-display text-text-muted italic">{WARMUP_SOURCE}</p>
        </section>
      </div>
    </div>
  );
}
