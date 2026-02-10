import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartCard, EmptyChartMessage, ChartTooltip } from './ChartShared.tsx';
import type { TotalDataPoint } from '../types.ts';

interface TotalChartProps {
  data: TotalDataPoint[];
}

export function TotalChart({ data }: TotalChartProps) {
  return (
    <ChartCard title="TOTAL ESTIMADO">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
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
            <Line
              type="monotone"
              dataKey="total"
              name="Total"
              stroke="#D4A017"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#D4A017' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChartMessage text="Complete treinos dos 3 levantamentos para ver o total" />
      )}
    </ChartCard>
  );
}
