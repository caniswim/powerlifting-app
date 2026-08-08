import { useCallback, useState } from 'react';
import { useStorage } from '../../../contexts/StorageContext';
import { localDateKey } from '../../../services/storage/bodyweightRepository';
import type { BodyweightEntry } from '../../../types';

const HISTORY_SIZE = 6;

/**
 * Pesagem do dia + histórico curto.
 *
 * O peso corporal vira série temporal porque o DOTS ao longo do tempo é o
 * árbitro nutricional do bloco: peso caindo com DOTS subindo é a direção certa.
 */
export function BodyweightSection() {
  const storage = useStorage();

  const [entries, setEntries] = useState<BodyweightEntry[]>(() => storage.getBodyweightEntries());
  const [weight, setWeight] = useState<string>(() => {
    const latest = storage.getLatestBodyweight();
    return latest ? String(latest.weightKg) : '';
  });
  const [saved, setSaved] = useState(false);

  const record = useCallback(() => {
    const value = parseFloat(weight.replace(',', '.'));
    if (!Number.isFinite(value) || value <= 0) return;

    storage.saveBodyweightEntry({ date: localDateKey(), weightKg: value });
    setEntries(storage.getBodyweightEntries());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [weight, storage]);

  const history = entries.slice(-HISTORY_SIZE).reverse();
  const first = history[history.length - 1];
  const last = history[0];
  const deltaDots =
    first?.dots != null && last?.dots != null && first.date !== last.date
      ? Math.round((last.dots - first.dots) * 10) / 10
      : null;

  return (
    <section className="bg-bg-card border border-border rounded-lg p-4 space-y-4">
      <h2 className="text-xs font-display font-semibold text-accent-gold uppercase tracking-wider">
        Peso Corporal
      </h2>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="text-[10px] font-display text-text-muted uppercase tracking-wider block mb-1">
            Pesagem de hoje (kg)
          </label>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full h-11 bg-bg-input border border-border-light rounded-md px-3
                       font-mono text-sm text-text-primary focus:outline-none focus:border-accent-gold"
          />
        </div>
        <button
          type="button"
          onClick={record}
          className={`h-11 px-4 rounded-md font-display font-semibold text-xs uppercase tracking-wider transition-colors ${
            saved ? 'bg-accent-green text-white' : 'bg-accent-gold text-bg-primary'
          }`}
        >
          {saved ? 'Salvo' : 'Registrar'}
        </button>
      </div>

      {history.length > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-display text-text-muted uppercase tracking-wider">
            <span>Últimas pesagens</span>
            {deltaDots !== null && (
              <span className={deltaDots >= 0 ? 'text-accent-green' : 'text-accent-red'}>
                DOTS {deltaDots >= 0 ? '+' : ''}{deltaDots}
              </span>
            )}
          </div>
          {history.map((entry) => (
            <div key={entry.date} className="flex justify-between text-xs font-mono text-text-secondary">
              <span className="text-text-muted">{entry.date}</span>
              <span>{entry.weightKg} kg</span>
              <span className="text-accent-gold">{entry.dots != null ? entry.dots.toFixed(1) : '—'}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
