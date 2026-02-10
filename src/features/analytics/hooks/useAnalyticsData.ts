import { useState, useEffect, useMemo } from 'react';
import { useStorage } from '../../../contexts/StorageContext.tsx';
import type { WorkoutLog, PersonalRecord } from '../../../types/index.ts';

export function useAnalyticsData() {
  const storage = useStorage();
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const [macroFilter, setMacroFilter] = useState<number | 'all'>('all');

  useEffect(() => {
    setWorkouts(storage.getWorkouts().filter((w) => w.completed));
    setRecords(storage.getRecords());
  }, []);

  const filteredWorkouts = useMemo(() => {
    if (macroFilter === 'all') return workouts;
    return workouts.filter((w) => w.macrocycle === macroFilter);
  }, [workouts, macroFilter]);

  const availableMacros = useMemo(() => {
    const set = new Set<number>();
    for (const w of workouts) set.add(w.macrocycle);
    return Array.from(set).sort();
  }, [workouts]);

  const hasData = workouts.length > 0;

  return {
    workouts,
    records,
    filteredWorkouts,
    macroFilter,
    setMacroFilter,
    availableMacros,
    hasData,
  };
}
