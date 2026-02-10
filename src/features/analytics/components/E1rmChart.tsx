import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartCard, EmptyChartMessage, ChartTooltip } from './ChartShared.tsx';
import { MAIN_LIFTS } from '../types.ts';
import type { E1rmDataPoint } from '../types.ts';

const LIFT_COLORS: Record<string, string> = {
  agachamento_low_bar: '#DC2626',
  supino_wide_grip: '#D4A017',
  deadlift_sumo: '#2563EB',
};

const LIFT_LABELS: Record<string, string> = {
  agachamento_low_bar: 'Squat',
  supino_wide_grip: 'Bench',
  deadlift_sumo: 'Deadlift',
};

interface E1rmChartProps {
  data: E1rmDataPoint[];
}

export function E1rmChart({ data }: E1rmChartProps) {
  return (
    <ChartCard title="e1RM POR SEMANA">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fill: '#a3a3a3', fontSize: 11, fontFamily: 'Barlow Condensed' }}
              axisLine={{ stroke: '#2a2a2a' }}
              tickLine={{ stroke: '#2a2a2a' }}
            />
            <YAxis
              tick={{ fill: '#a3a3a3', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#2a2a2a' }}
              tickLine={{ stroke: '#2a2a2a' }}
              domain={['auto', 'auto']}
              unit=" kg"
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, fontFamily: 'Barlow Condensed' }}
            />
            {MAIN_LIFTS.map((lift) => (
              <Line
                key={lift}
                type="monotone"
                dataKey={lift}
                name={LIFT_LABELS[lift]}
                stroke={LIFT_COLORS[lift]}
                strokeWidth={2}
                dot={{ r: 3, fill: LIFT_COLORS[lift] }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChartMessage text="Nenhum dado de e1RM registrado" />
      )}
    </ChartCard>
  );
}
