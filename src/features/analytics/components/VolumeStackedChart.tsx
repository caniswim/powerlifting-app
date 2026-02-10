import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartCard, EmptyChartMessage, ChartTooltip } from './ChartShared.tsx';
import { muscleGroupLabels } from '../../../domain/muscleGroupLabels.ts';
import type { VolumeBarDataPoint } from '../types.ts';
import type { MuscleGroup } from '../../../types/index.ts';

const MUSCLE_BAR_COLORS: Record<string, string> = {
  quads: '#DC2626',
  'glúteos': '#D4A017',
  erectors: '#7C3AED',
  hamstrings: '#059669',
  peito: '#2563EB',
  'deltóide_anterior': '#DB2777',
  'deltóide_posterior': '#14B8A6',
  'deltóide_lateral': '#F97316',
  'tríceps': '#8B5CF6',
  'bíceps': '#06B6D4',
  costas: '#84CC16',
};

interface VolumeStackedChartProps {
  data: VolumeBarDataPoint[];
  activeMuscles: MuscleGroup[];
}

export function VolumeStackedChart({ data, activeMuscles }: VolumeStackedChartProps) {
  return (
    <ChartCard title="VOLUME SEMANAL POR GRUPO MUSCULAR">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
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
              label={{
                value: 'sets',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#6b6b6b', fontSize: 10, fontFamily: 'Barlow Condensed' },
              }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 10, fontFamily: 'Barlow Condensed' }}
            />
            {activeMuscles.map((mg) => (
              <Bar
                key={mg}
                dataKey={mg}
                name={muscleGroupLabels[mg]}
                stackId="volume"
                fill={MUSCLE_BAR_COLORS[mg]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChartMessage text="Nenhum volume registrado" />
      )}
    </ChartCard>
  );
}
