import { useEffect, useRef, useState } from 'react';
import { Timer, X } from 'lucide-react';
import { formatDuration } from '../../../domain/setTypeLabels';
import { fireRestDoneAlert } from '../../../services/restAlert';
import { useWakeLock } from '../../../hooks/useWakeLock';

interface RestTimerProps {
  /** Descanso prescrito, em segundos. */
  targetSec: number;
  /** Rótulo verbatim do programa ("3-4 MIN"). */
  label?: string;
  startedAt: number;
  onDismiss: () => void;
}

/**
 * Cronômetro de descanso disparado ao completar uma série. O alvo vem da
 * coluna "Rest" do programa; supersets prescrevem 0 MIN e não abrem timer.
 */
export function RestTimer({ targetSec, label, startedAt, onDismiss }: RestTimerProps) {
  const [elapsed, setElapsed] = useState(() => Math.floor((Date.now() - startedAt) / 1000));

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  const remaining = targetSec - elapsed;
  const done = remaining <= 0;

  /**
   * O alerta dispara UMA vez, no cruzamento do zero.
   *
   * `done` é recalculado a cada tick, então avisar sempre que ele for verdadeiro
   * bipa de segundo em segundo. E o ref nasce com o estado do PRIMEIRO render:
   * um cronômetro que já venceu enquanto o app estava fechado remonta vencido, e
   * bipar aí seria avisar de um descanso que terminou há dez minutos.
   */
  const alerted = useRef(done);
  useEffect(() => {
    if (done && !alerted.current) {
      alerted.current = true;
      fireRestDoneAlert();
    }
  }, [done]);

  // Tela acesa só ENQUANTO descansa. Depois do bipe não há mais o que esperar, e
  // segurar o lock à toa é bateria queimada no meio de um treino.
  useWakeLock(!done);
  const progress = Math.min(100, (elapsed / targetSec) * 100);

  return (
    <div
      className={`rounded-lg border px-3 py-2 ${
        done
          ? 'bg-accent-green/10 border-accent-green/40'
          : 'bg-accent-blue/10 border-accent-blue/30'
      }`}
    >
      <div className="flex items-center gap-2">
        <Timer size={16} className={done ? 'text-accent-green' : 'text-accent-blue'} />
        <span className={`font-mono text-lg font-bold ${done ? 'text-accent-green' : 'text-accent-blue'}`}>
          {done ? `+${formatDuration(-remaining)}` : formatDuration(remaining)}
        </span>
        <span className="text-[10px] font-display uppercase tracking-wider text-text-muted">
          {done ? 'descanso completo' : `descanso ${label ?? formatDuration(targetSec)}`}
        </span>
        <button
          type="button"
          onClick={onDismiss}
          className="ml-auto text-text-muted hover:text-text-primary"
          aria-label="Fechar cronômetro"
        >
          <X size={16} />
        </button>
      </div>
      <div className="mt-1.5 h-1 bg-bg-tertiary rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${done ? 'bg-accent-green' : 'bg-accent-blue'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
