import type { ReactNode } from 'react';

export function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-bg-card border border-border rounded-lg p-4 animate-fade-in">
      <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted mb-3">
        {title}
      </div>
      {children}
    </div>
  );
}

export function EmptyChartMessage({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-32 text-sm font-display text-text-muted">
      {text}
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="bg-bg-card border border-border rounded-lg p-8 text-center animate-fade-in">
      <div className="text-3xl mb-3 text-text-muted">---</div>
      <p className="text-sm font-display font-semibold text-text-secondary uppercase tracking-wider mb-1">
        SEM DADOS
      </p>
      <p className="text-xs font-display text-text-muted">
        Complete treinos para ver sua progressão e estatísticas aqui.
      </p>
    </div>
  );
}

export function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs font-display text-text-muted mb-1">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: entry.color }}
          />
          <span className="font-display text-text-secondary">{entry.name}</span>
          <span className="font-mono font-bold text-text-primary ml-auto">
            {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}
