import { useState } from 'react';
import { ChevronDown, Ruler } from 'lucide-react';
import { ANTHROPOMETRY, ANTHROPOMETRY_READING, MEASURED_ON } from '../../../data/anthropometry';

/**
 * Antropometria medida, na seção Sobre.
 *
 * Fica recolhida por padrão: são vinte e poucas linhas que ninguém precisa ver
 * todo dia, mas que não podem depender de a pessoa lembrar onde anotou.
 */
export function AnthropometrySection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 text-left"
      >
        <span className="flex items-center gap-2">
          <Ruler size={14} className="text-text-muted" aria-hidden />
          <span className="text-sm font-display text-text-secondary">Antropometria</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-sm font-mono text-text-muted">{MEASURED_ON}</span>
          <ChevronDown
            size={14}
            aria-hidden
            className={`text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {open && (
        <div className="space-y-4 pt-1">
          {ANTHROPOMETRY.map((group) => (
            <div key={group.title} className="space-y-2">
              <h3 className="text-[11px] font-display font-semibold text-accent-gold/80 uppercase tracking-wider">
                {group.title}
              </h3>
              <dl className="space-y-2">
                {group.items.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between items-baseline gap-3">
                      <dt className="text-sm font-display text-text-secondary">{item.label}</dt>
                      <dd className="text-sm font-mono text-text-primary shrink-0">{item.value}</dd>
                    </div>
                    {item.note && (
                      <p className="text-xs text-text-muted leading-snug mt-0.5 pr-16">{item.note}</p>
                    )}
                  </div>
                ))}
              </dl>
            </div>
          ))}

          <div className="space-y-2 pt-1 border-t border-border">
            <h3 className="text-[11px] font-display font-semibold text-accent-gold/80 uppercase tracking-wider">
              O que isso decide
            </h3>
            <ul className="space-y-1.5">
              {ANTHROPOMETRY_READING.map((line) => (
                <li key={line} className="text-xs text-text-muted leading-snug flex gap-2">
                  <span className="text-accent-gold/60 shrink-0" aria-hidden>—</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
