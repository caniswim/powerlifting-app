import { useMemo } from 'react';
import { calculateWeeklyVolume } from '../../../hooks/useVolumeTracking.ts';
import { muscleGroupLabels } from '../../../domain/muscleGroupLabels.ts';
import { prescribedWeeklyVolume } from '../../../domain/volumeTargets.ts';
import { getWeeks } from '../../../services/scheduling.ts';
import type { VolumeBarDataPoint } from '../types.ts';
import type { WorkoutLog, MuscleGroup } from '../../../types/index.ts';
import type { VolumeData } from '../../../hooks/useVolumeTracking.ts';

const MUSCLE_GROUP_KEYS = Object.keys(muscleGroupLabels) as MuscleGroup[];

export function useVolumeChartData(filteredWorkouts: WorkoutLog[]) {
  const volumeChartData = useMemo(() => {
    const weekGroups = new Map<number, WorkoutLog[]>();
    for (const w of filteredWorkouts) {
      const arr = weekGroups.get(w.weekNumber) ?? [];
      arr.push(w);
      weekGroups.set(w.weekNumber, arr);
    }

    const data: VolumeBarDataPoint[] = [];

    for (const [wk, wkWorkouts] of Array.from(weekGroups.entries()).sort(([a], [b]) => a - b)) {
      const volumes = calculateWeeklyVolume(wkWorkouts);
      const point: VolumeBarDataPoint = { week: wk, label: `S${wk}` };
      for (const mg of MUSCLE_GROUP_KEYS) {
        const found = volumes.find((v) => v.muscleGroup === mg);
        point[mg] = found?.actual ?? 0;
      }
      data.push(point);
    }

    return data;
  }, [filteredWorkouts]);

  const latestWeek = useMemo(
    () => (filteredWorkouts.length === 0 ? null : Math.max(...filteredWorkouts.map((w) => w.weekNumber))),
    [filteredWorkouts],
  );

  const latestWeekVolume: VolumeData[] = useMemo(() => {
    if (latestWeek === null) return [];
    return calculateWeeklyVolume(filteredWorkouts.filter((w) => w.weekNumber === latestWeek));
  }, [filteredWorkouts, latestWeek]);

  // Alvo vem da prescrição da mesma semana, do programa daqueles treinos.
  const latestWeekTargets = useMemo(() => {
    if (latestWeek === null) return {};
    const programId = filteredWorkouts.find((w) => w.weekNumber === latestWeek)?.programId;
    const week = getWeeks(programId).find((w) => w.weekNumber === latestWeek);
    return week ? prescribedWeeklyVolume(week) : {};
  }, [filteredWorkouts, latestWeek]);

  const activeMuscles = useMemo(() => {
    return MUSCLE_GROUP_KEYS.filter((mg) =>
      volumeChartData.some((d) => (d[mg] ?? 0) > 0)
    );
  }, [volumeChartData]);

  return { volumeChartData, latestWeekVolume, latestWeekTargets, latestWeek, activeMuscles };
}
