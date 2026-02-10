import type { DayType } from '../types';

// Full labels for workout page
export const dayTypeLabels: Record<DayType, string> = {
  squat_emphasis: 'LOWER — Squat Emphasis',
  bench_emphasis: 'UPPER — Bench Emphasis',
  deadlift_emphasis: 'LOWER — Deadlift Emphasis',
  bench_volume: 'UPPER — Bench Volume',
};

// Short labels for dashboard
export const dayTypeShortLabels: Record<DayType, string> = {
  squat_emphasis: 'LOWER — Squat',
  bench_emphasis: 'UPPER — Bench',
  deadlift_emphasis: 'LOWER — Deadlift',
  bench_volume: 'UPPER — Volume',
};

// Portuguese labels for calendar
export const dayTypePtLabels: Record<DayType, string> = {
  squat_emphasis: 'Ênfase Agachamento',
  bench_emphasis: 'Ênfase Supino',
  deadlift_emphasis: 'Ênfase Deadlift',
  bench_volume: 'Volume Supino',
};
