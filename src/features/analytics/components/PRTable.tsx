import { ChartCard, EmptyChartMessage } from './ChartShared.tsx';
import { isMainLift } from '../types.ts';
import type { PRRow } from '../types.ts';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

interface PRTableProps {
  rows: PRRow[];
}

export function PRTable({ rows }: PRTableProps) {
  return (
    <ChartCard title="RECORDS PESSOAIS">
      {rows.length > 0 ? (
        <div className="overflow-x-auto -mx-4">
          <table className="w-full min-w-[420px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted px-4 py-2">
                  Exercício
                </th>
                <th className="text-right text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted px-2 py-2">
                  Peso
                </th>
                <th className="text-right text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted px-2 py-2">
                  Reps
                </th>
                <th className="text-right text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted px-2 py-2">
                  RPE
                </th>
                <th className="text-right text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted px-2 py-2">
                  e1RM
                </th>
                <th className="text-right text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted px-4 py-2">
                  Data
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const isMain = isMainLift(row.exerciseId);
                return (
                  <tr
                    key={row.exerciseId}
                    className={`border-b border-border/50 ${
                      isMain ? 'bg-bg-tertiary/30' : ''
                    }`}
                  >
                    <td className="text-sm font-display text-text-secondary px-4 py-2 truncate max-w-[160px]">
                      {row.name}
                    </td>
                    <td className="text-right text-sm font-mono text-text-primary px-2 py-2">
                      {row.weight}
                    </td>
                    <td className="text-right text-sm font-mono text-text-primary px-2 py-2">
                      {row.reps}
                    </td>
                    <td className="text-right text-sm font-mono text-text-muted px-2 py-2">
                      {row.rpe}
                    </td>
                    <td className="text-right text-sm font-mono font-bold text-accent-gold px-2 py-2">
                      {row.e1rm.toFixed(1)}
                    </td>
                    <td className="text-right text-xs font-mono text-text-muted px-4 py-2">
                      {formatDate(row.date)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyChartMessage text="Nenhum PR registrado ainda" />
      )}
    </ChartCard>
  );
}
