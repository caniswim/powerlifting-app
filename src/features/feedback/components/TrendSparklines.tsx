import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface Props {
  data: {
    sleepQuality: number[];
    energyLevel: number[];
    stressLevel: number[];
    sessionRPE: number[];
  };
}

const metrics = [
  { key: 'sleepQuality' as const, label: 'Sono', color: '#3B82F6' },
  { key: 'energyLevel' as const, label: 'Energia', color: '#F59E0B' },
  { key: 'stressLevel' as const, label: 'Estresse', color: '#EF4444' },
  { key: 'sessionRPE' as const, label: 'sRPE', color: '#8B5CF6' },
];

export function TrendSparklines({ data }: Props) {
  return (
    <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
      <span className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">
        TENDÊNCIAS (ÚLTIMAS SESSÕES)
      </span>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map(({ key, label, color }) => {
          const values = data[key];
          if (values.length < 2) return null;
          const chartData = values.map((v, i) => ({ i, v }));
          const current = values[values.length - 1];

          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-display text-text-muted uppercase tracking-wider">
                  {label}
                </span>
                <span className="text-xs font-mono font-bold text-text-primary">
                  {current}
                </span>
              </div>
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <Line
                      type="monotone"
                      dataKey="v"
                      stroke={color}
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
