import { useState } from 'react';
import { HeartPulse } from 'lucide-react';
import { RestPainSheet } from './RestPainSheet';
import { useStorage } from '../../../contexts/StorageContext';
import { painRegionLabels, restPainContextLabels } from '../../../domain/painRegions';
import type { RestPainLog } from '../../../types';

interface RestPainCardProps {
  programId: string;
  weekNumber: number;
}

/**
 * A porta do registro de dor sem treino, no Dashboard.
 *
 * Fica no Dashboard e não dentro do fluxo de treino porque o dia que este
 * registro existe para salvar é justamente o dia em que não se abre treino
 * nenhum. Mora aqui — e não em `Dashboard.tsx` — para que a página continue
 * sendo uma composição de cartões: o Dashboard não precisa saber o que é um
 * `RestPainLog`.
 */
export function RestPainCard({ programId, weekNumber }: RestPainCardProps) {
  const storage = useStorage();
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState<RestPainLog[]>(
    () => storage.listRestPainByWeek(programId, weekNumber),
  );

  const handleSubmit = (log: RestPainLog) => {
    storage.saveRestPainLog(log);
    setLogs(storage.listRestPainByWeek(programId, weekNumber));
    setOpen(false);
  };

  if (open) {
    return (
      <RestPainSheet
        programId={programId}
        weekNumber={weekNumber}
        onSubmit={handleSubmit}
        onCancel={() => setOpen(false)}
      />
    );
  }

  return (
    <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <HeartPulse size={14} className="text-text-muted flex-shrink-0" />
        <span className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">
          Dor fora de treino
        </span>
      </div>

      {logs.length > 0 ? (
        <div className="space-y-1.5">
          {logs.map((log) => (
            <div key={log.id} className="flex justify-between items-center text-xs font-display">
              <span className="text-text-secondary truncate pr-2">
                {log.date} — {restPainContextLabels[log.context]}
              </span>
              <span className="text-text-muted font-mono whitespace-nowrap">
                {log.painEntries
                  .map((p) => `${painRegionLabels[p.region]} ${p.intensity}/10`)
                  .join(' · ')}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-text-muted font-display leading-relaxed">
          Dor num dia sem treino não cabe na pesquisa pré nem na pós — sem registro
          aqui, a semana sai do app dizendo que não houve dor.
        </p>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full h-11 rounded border border-border text-text-secondary font-display font-semibold text-sm tracking-wide uppercase hover:bg-bg-tertiary transition-colors"
      >
        Registrar dor de hoje
      </button>
    </div>
  );
}
