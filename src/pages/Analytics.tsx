import { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getWorkouts, getRecords } from '../services/storage';
import { exerciseNames } from '../data/exerciseMuscleMap';
import { calculateWeeklyVolume } from '../hooks/useVolumeTracking';
import type { WorkoutLog, PersonalRecord, MuscleGroup } from '../types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAIN_LIFTS = ['agachamento_low_bar', 'supino_wide_grip', 'deadlift_sumo'] as const;
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

const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  quads: 'Quadriceps',
  'glúteos': 'Gluteos',
  erectors: 'Eretores',
  hamstrings: 'Hamstrings',
  peito: 'Peito',
  'deltóide_anterior': 'Delt. Ant.',
  'deltóide_posterior': 'Delt. Post.',
  'deltóide_lateral': 'Delt. Lat.',
  'tríceps': 'Triceps',
  'bíceps': 'Biceps',
  costas: 'Costas',
};

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

// Recommended weekly sets per muscle group (general hypertrophy targets)
const VOLUME_TARGETS: Partial<Record<MuscleGroup, number>> = {
  quads: 16,
  'glúteos': 10,
  erectors: 8,
  hamstrings: 10,
  peito: 16,
  'deltóide_anterior': 8,
  'deltóide_posterior': 10,
  'deltóide_lateral': 12,
  'tríceps': 10,
  'bíceps': 10,
  costas: 14,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

interface E1rmDataPoint {
  week: number;
  label: string;
  agachamento_low_bar?: number;
  supino_wide_grip?: number;
  deadlift_sumo?: number;
}

interface TotalDataPoint {
  week: number;
  label: string;
  total: number;
}

interface VolumeBarDataPoint {
  week: number;
  label: string;
  [muscleGroup: string]: number | string;
}

interface PRRow {
  exerciseId: string;
  name: string;
  weight: number;
  reps: number;
  rpe: number;
  date: string;
  e1rm: number;
}

// ---------------------------------------------------------------------------
// Custom Tooltip
// ---------------------------------------------------------------------------

function ChartTooltip({ active, payload, label }: {
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Analytics() {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const [macroFilter, setMacroFilter] = useState<number | 'all'>('all');

  useEffect(() => {
    setWorkouts(getWorkouts().filter((w) => w.completed));
    setRecords(getRecords());
  }, []);

  // Filter workouts by macrocycle
  const filteredWorkouts = useMemo(() => {
    if (macroFilter === 'all') return workouts;
    return workouts.filter((w) => w.macrocycle === macroFilter);
  }, [workouts, macroFilter]);

  // ---- e1RM Over Time ----
  const e1rmData = useMemo(() => {
    const weekMap = new Map<number, E1rmDataPoint>();

    for (const workout of filteredWorkouts) {
      const wk = workout.weekNumber;
      if (!weekMap.has(wk)) {
        weekMap.set(wk, { week: wk, label: `S${wk}` });
      }
      const point = weekMap.get(wk)!;

      for (const exercise of workout.exercises) {
        if (!MAIN_LIFTS.includes(exercise.exerciseId as typeof MAIN_LIFTS[number])) continue;
        const best = exercise.sets
          .filter((s) => s.completed && s.e1rm > 0)
          .reduce((max, s) => (s.e1rm > max ? s.e1rm : max), 0);

        if (best > 0) {
          const key = exercise.exerciseId as keyof E1rmDataPoint;
          const current = (point[key] as number | undefined) ?? 0;
          if (best > current) {
            (point as unknown as Record<string, number | string>)[exercise.exerciseId] = best;
          }
        }
      }
    }

    return Array.from(weekMap.values()).sort((a, b) => a.week - b.week);
  }, [filteredWorkouts]);

  // ---- Estimated Total ----
  const totalData = useMemo(() => {
    const weekBest = new Map<number, Record<string, number>>();

    for (const workout of filteredWorkouts) {
      const wk = workout.weekNumber;
      if (!weekBest.has(wk)) weekBest.set(wk, {});
      const bests = weekBest.get(wk)!;

      for (const exercise of workout.exercises) {
        if (!MAIN_LIFTS.includes(exercise.exerciseId as typeof MAIN_LIFTS[number])) continue;
        const best = exercise.sets
          .filter((s) => s.completed && s.e1rm > 0)
          .reduce((max, s) => (s.e1rm > max ? s.e1rm : max), 0);
        if (best > (bests[exercise.exerciseId] ?? 0)) {
          bests[exercise.exerciseId] = best;
        }
      }
    }

    // Carry forward last known values
    const lastKnown: Record<string, number> = {};
    const sorted = Array.from(weekBest.entries()).sort(([a], [b]) => a - b);
    const result: TotalDataPoint[] = [];

    for (const [wk, bests] of sorted) {
      for (const lift of MAIN_LIFTS) {
        if (bests[lift]) lastKnown[lift] = bests[lift];
      }
      const squat = lastKnown['agachamento_low_bar'] ?? 0;
      const bench = lastKnown['supino_wide_grip'] ?? 0;
      const dead = lastKnown['deadlift_sumo'] ?? 0;
      const total = squat + bench + dead;
      if (total > 0) {
        result.push({ week: wk, label: `S${wk}`, total: Math.round(total * 10) / 10 });
      }
    }

    return result;
  }, [filteredWorkouts]);

  // ---- Weekly Volume by Muscle Group ----
  const volumeChartData = useMemo(() => {
    const weekGroups = new Map<number, WorkoutLog[]>();
    for (const w of filteredWorkouts) {
      const arr = weekGroups.get(w.weekNumber) ?? [];
      arr.push(w);
      weekGroups.set(w.weekNumber, arr);
    }

    const allMuscles = Object.keys(MUSCLE_GROUP_LABELS) as MuscleGroup[];
    const data: VolumeBarDataPoint[] = [];

    for (const [wk, wkWorkouts] of Array.from(weekGroups.entries()).sort(([a], [b]) => a - b)) {
      const volumes = calculateWeeklyVolume(wkWorkouts);
      const point: VolumeBarDataPoint = { week: wk, label: `S${wk}` };
      for (const mg of allMuscles) {
        const found = volumes.find((v) => v.muscleGroup === mg);
        point[mg] = found?.actual ?? 0;
      }
      data.push(point);
    }

    return data;
  }, [filteredWorkouts]);

  // ---- PRs Table ----
  const prRows = useMemo(() => {
    // Build best e1RM per exercise from ALL workout data (not filtered)
    const bestMap = new Map<string, PRRow>();

    for (const workout of workouts) {
      for (const exercise of workout.exercises) {
        for (const set of exercise.sets) {
          if (!set.completed || set.e1rm <= 0) continue;
          const existing = bestMap.get(exercise.exerciseId);
          if (!existing || set.e1rm > existing.e1rm) {
            bestMap.set(exercise.exerciseId, {
              exerciseId: exercise.exerciseId,
              name: exerciseNames[exercise.exerciseId] ?? exercise.exerciseId,
              weight: set.weight,
              reps: set.reps,
              rpe: set.rpe,
              date: workout.date,
              e1rm: set.e1rm,
            });
          }
        }
      }
    }

    // Also include stored records if they have higher e1RM
    for (const rec of records) {
      const existing = bestMap.get(rec.exerciseId);
      if (!existing || rec.e1rm > existing.e1rm) {
        bestMap.set(rec.exerciseId, {
          exerciseId: rec.exerciseId,
          name: exerciseNames[rec.exerciseId] ?? rec.exerciseId,
          weight: rec.weight,
          reps: rec.reps,
          rpe: rec.rpe,
          date: rec.date,
          e1rm: rec.e1rm,
        });
      }
    }

    return Array.from(bestMap.values()).sort((a, b) => b.e1rm - a.e1rm);
  }, [workouts, records]);

  // ---- Volume Tracking (latest week) ----
  const latestWeekVolume = useMemo(() => {
    if (filteredWorkouts.length === 0) return [];
    const maxWeek = Math.max(...filteredWorkouts.map((w) => w.weekNumber));
    const weekWorkouts = filteredWorkouts.filter((w) => w.weekNumber === maxWeek);
    return calculateWeeklyVolume(weekWorkouts);
  }, [filteredWorkouts]);

  // Macrocycles present in data
  const availableMacros = useMemo(() => {
    const set = new Set<number>();
    for (const w of workouts) set.add(w.macrocycle);
    return Array.from(set).sort();
  }, [workouts]);

  const hasData = workouts.length > 0;

  // Discover which muscles actually appear in volume data for the bar chart legend
  const activeMuscles = useMemo(() => {
    const muscles = Object.keys(MUSCLE_GROUP_LABELS) as MuscleGroup[];
    return muscles.filter((mg) =>
      volumeChartData.some((d) => (d[mg] as number) > 0)
    );
  }, [volumeChartData]);

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-text-muted">
            POWERLIFTING TRACKER
          </h1>
          <div className="text-2xl font-display font-bold text-accent-gold uppercase tracking-wider">
            ANALYTICS
          </div>
        </div>

        {/* Macrocycle Filter Tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-none pb-1">
          <button
            onClick={() => setMacroFilter('all')}
            className={`px-3 py-1.5 text-xs font-display font-semibold tracking-wider uppercase rounded border transition-colors whitespace-nowrap ${
              macroFilter === 'all'
                ? 'bg-accent-gold/20 text-accent-gold border-accent-gold/30'
                : 'bg-bg-card text-text-muted border-border hover:text-text-secondary'
            }`}
          >
            TODOS
          </button>
          {availableMacros.map((mc) => (
            <button
              key={mc}
              onClick={() => setMacroFilter(mc)}
              className={`px-3 py-1.5 text-xs font-display font-semibold tracking-wider uppercase rounded border transition-colors whitespace-nowrap ${
                macroFilter === mc
                  ? 'bg-accent-gold/20 text-accent-gold border-accent-gold/30'
                  : 'bg-bg-card text-text-muted border-border hover:text-text-secondary'
              }`}
            >
              MACRO {mc}
            </button>
          ))}
          {/* Always show macro 1-4 as placeholders when no data */}
          {availableMacros.length === 0 &&
            [1, 2, 3, 4].map((mc) => (
              <button
                key={mc}
                onClick={() => setMacroFilter(mc)}
                className={`px-3 py-1.5 text-xs font-display font-semibold tracking-wider uppercase rounded border transition-colors whitespace-nowrap ${
                  macroFilter === mc
                    ? 'bg-accent-gold/20 text-accent-gold border-accent-gold/30'
                    : 'bg-bg-card text-text-muted border-border hover:text-text-secondary'
                }`}
              >
                MACRO {mc}
              </button>
            ))}
        </div>

        {!hasData ? (
          <EmptyState />
        ) : (
          <>
            {/* e1RM Over Time */}
            <ChartCard title="e1RM POR SEMANA">
              {e1rmData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={e1rmData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
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

            {/* Estimated Total */}
            <ChartCard title="TOTAL ESTIMADO">
              {totalData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={totalData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
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

            {/* Weekly Volume by Muscle Group */}
            <ChartCard title="VOLUME SEMANAL POR GRUPO MUSCULAR">
              {volumeChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={volumeChartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
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
                        name={MUSCLE_GROUP_LABELS[mg]}
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

            {/* Volume Tracking: Actual vs Target */}
            <ChartCard title="VOLUME: REAL vs ALVO (ULTIMA SEMANA)">
              {latestWeekVolume.length > 0 ? (
                <div className="space-y-2">
                  {latestWeekVolume
                    .filter((v) => v.actual > 0 || (VOLUME_TARGETS[v.muscleGroup] ?? 0) > 0)
                    .map((v) => {
                      const target = VOLUME_TARGETS[v.muscleGroup] ?? 0;
                      const ratio = target > 0 ? v.actual / target : 1;
                      const isLow = ratio < 0.8;
                      const isHigh = ratio > 1.2;
                      const barWidth = target > 0 ? Math.min((v.actual / target) * 100, 150) : 0;

                      return (
                        <div key={v.muscleGroup} className="space-y-0.5">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-display text-text-secondary">
                              {v.label}
                              {(isLow || isHigh) && (
                                <span
                                  className={`ml-1.5 inline-block w-1.5 h-1.5 rounded-full ${
                                    isLow ? 'bg-accent-red' : 'bg-accent-gold'
                                  }`}
                                  title={isLow ? 'Abaixo de 80% do alvo' : 'Acima de 120% do alvo'}
                                />
                              )}
                            </span>
                            <span className="text-xs font-mono text-text-muted">
                              {v.actual}
                              {target > 0 && (
                                <span className="text-text-muted"> / {target}</span>
                              )}
                            </span>
                          </div>
                          <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isLow
                                  ? 'bg-accent-red'
                                  : isHigh
                                  ? 'bg-accent-gold'
                                  : 'bg-accent-green'
                              }`}
                              style={{ width: `${Math.min(barWidth, 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  <div className="flex items-center gap-4 pt-2 border-t border-border">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-accent-red" />
                      <span className="text-[10px] font-display text-text-muted">&lt;80% alvo</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-accent-green" />
                      <span className="text-[10px] font-display text-text-muted">80-120%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-accent-gold" />
                      <span className="text-[10px] font-display text-text-muted">&gt;120% alvo</span>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyChartMessage text="Nenhum treino registrado no filtro selecionado" />
              )}
            </ChartCard>

            {/* PRs Table */}
            <ChartCard title="RECORDS PESSOAIS">
              {prRows.length > 0 ? (
                <div className="overflow-x-auto -mx-4">
                  <table className="w-full min-w-[420px]">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted px-4 py-2">
                          Exercicio
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
                      {prRows.map((row) => {
                        const isMainLift = MAIN_LIFTS.includes(row.exerciseId as typeof MAIN_LIFTS[number]);
                        return (
                          <tr
                            key={row.exerciseId}
                            className={`border-b border-border/50 ${
                              isMainLift ? 'bg-bg-tertiary/30' : ''
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
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg-card border border-border rounded-lg p-4 animate-fade-in">
      <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted mb-3">
        {title}
      </div>
      {children}
    </div>
  );
}

function EmptyChartMessage({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-32 text-sm font-display text-text-muted">
      {text}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-bg-card border border-border rounded-lg p-8 text-center animate-fade-in">
      <div className="text-3xl mb-3 text-text-muted">---</div>
      <p className="text-sm font-display font-semibold text-text-secondary uppercase tracking-wider mb-1">
        SEM DADOS
      </p>
      <p className="text-xs font-display text-text-muted">
        Complete treinos para ver sua progressao e estatisticas aqui.
      </p>
    </div>
  );
}
