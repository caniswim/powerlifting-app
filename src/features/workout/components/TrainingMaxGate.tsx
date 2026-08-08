import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { REF_LABELS } from '../../../domain/trainingMaxGuard';
import type { PercentRef } from '../../../types';

interface TrainingMaxGateProps {
  /** Levantamentos da sessão que ainda não têm máximo técnico definido. */
  missing: PercentRef[];
}

/**
 * Aviso bloqueante: o programa ativo é prescrito em padrão de competição e o
 * máximo técnico não está definido. Enquanto isso, nenhuma carga é sugerida.
 *
 * Prefere-se falhar visível a prescrever contra o 1RM de academia, que neste
 * caso daria ~16% a mais no agachamento.
 */
export function TrainingMaxGate({ missing }: TrainingMaxGateProps) {
  if (missing.length === 0) return null;

  return (
    <div className="bg-accent-red/10 border border-accent-red/40 rounded-lg p-3 space-y-2">
      <div className="flex items-center gap-2">
        <AlertTriangle size={15} className="text-accent-red flex-shrink-0" />
        <span className="text-accent-red text-xs font-display font-semibold tracking-wider uppercase">
          Máximo técnico não definido
        </span>
      </div>
      <p className="text-[11px] font-display text-text-secondary leading-relaxed">
        Este programa é prescrito em <strong>padrão de competição</strong>, e ainda falta o
        máximo técnico de{' '}
        <strong className="text-text-primary">
          {missing.map((ref) => REF_LABELS[ref]).join(', ')}
        </strong>
        . Usar o 1RM de academia produziria carga alta demais — por isso nenhuma carga está
        sendo sugerida. Defina o máximo técnico antes de treinar.
      </p>
      <Link
        to="/settings"
        className="inline-flex items-center gap-1.5 bg-accent-red/20 border border-accent-red/40 rounded px-2.5 py-1.5 hover:bg-accent-red/30 transition-colors"
      >
        <span className="text-accent-red text-[11px] font-display font-semibold tracking-wider uppercase">
          Definir em Ajustes
        </span>
        <ArrowRight size={13} className="text-accent-red" />
      </Link>
    </div>
  );
}
