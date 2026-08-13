import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PainSelector } from './PainSelector';
import { localDateKey } from '../../../services/storage/bodyweightRepository';
import { restPainContextLabels, restPainContexts } from '../../../domain/painRegions';
import { PAIN_GATE } from '../../../domain/painGate';
import type { PainEntry, RestPainContext, RestPainLog } from '../../../types';

interface RestPainSheetProps {
  programId: string;
  weekNumber: number;
  onSubmit: (log: RestPainLog) => void;
  onCancel: () => void;
}

/**
 * Registro de dor SEM treino associado.
 *
 * As duas pesquisas de treino começam pelo `workoutId`, então a semana em que o
 * atleta sente dor e não treina saía do app afirmando que não houve dor nenhuma
 * — aconteceu, com o peitoral, na semana em que o supino foi pulado. Esta tela é
 * a porta que faltava, e o `PainSelector` é o mesmo das outras duas: a região, a
 * escala e a regra do bíceps do §1.2 são as mesmas em qualquer momento do dia.
 *
 * O que ela NÃO faz está escrito na própria tela, porque quem preenche precisa
 * saber: isto não entra na janela de 3 sessões, não dispara degrau e não muda
 * prescrição. Só para de perder o dado.
 */
export function RestPainSheet({ programId, weekNumber, onSubmit, onCancel }: RestPainSheetProps) {
  const [context, setContext] = useState<RestPainContext>(restPainContexts[0]);
  // Começa em SIM: ninguém abre esta tela para anunciar que está sem dor.
  const [hasPain, setHasPain] = useState(true);
  const [painEntries, setPainEntries] = useState<PainEntry[]>([]);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onSubmit({
      id: uuidv4(),
      date: localDateKey(),
      programId,
      weekNumber,
      context,
      painEntries,
      ...(notes.trim() ? { notes: notes.trim() } : {}),
      createdAt: new Date().toISOString(),
    });
  };

  return (
    // `z-[60]` porque a barra de navegação do app é `z-50` e continua montada
    // no Dashboard: sem isto, o botão "Registrar" fica atrás dela.
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-bg-primary">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-28 space-y-6">
        <h1 className="text-2xl font-display font-bold tracking-wide uppercase text-accent-gold text-center">
          Dor fora de treino
        </h1>

        <p className="text-[11px] leading-snug text-text-muted">
          Registro do dia parado. Ele aparece no documento semanal e na conversa da
          semana, e <strong>não</strong> entra na janela de sessões do gate {PAIN_GATE.secao}:
          não dispara degrau nem muda a prescrição desta semana.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
              Quando
            </label>
            <div className="grid grid-cols-3 gap-2">
              {restPainContexts.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setContext(option)}
                  className={`h-11 rounded border font-display text-xs font-semibold transition-all ${
                    context === option
                      ? 'bg-accent-gold/20 border-accent-gold/40 text-accent-gold'
                      : 'bg-bg-input border-border text-text-muted hover:bg-bg-tertiary'
                  }`}
                >
                  {restPainContextLabels[option]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
              Dor?
            </label>
            <PainSelector
              hasPain={hasPain}
              onHasPainChange={setHasPain}
              painEntries={painEntries}
              onPainEntriesChange={setPainEntries}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
              Notas
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="O que estava fazendo, há quanto tempo dói..."
              rows={3}
              className="w-full px-3 py-2 bg-bg-input border border-border-light rounded text-text-primary font-display text-sm placeholder:text-text-muted focus:border-accent-gold focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-bg-primary border-t border-border p-4">
        <div className="max-w-lg mx-auto flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-12 rounded bg-bg-card border border-border text-text-muted font-display font-semibold tracking-wide uppercase hover:bg-bg-tertiary transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            // Registro sem região nenhuma não é dado, é linha vazia no documento.
            disabled={painEntries.length === 0}
            className="flex-1 h-12 rounded bg-accent-gold text-black font-display font-bold tracking-wide uppercase hover:bg-accent-gold/90 disabled:opacity-40 disabled:hover:bg-accent-gold transition-colors"
          >
            Registrar
          </button>
        </div>
      </div>
    </div>
  );
}
