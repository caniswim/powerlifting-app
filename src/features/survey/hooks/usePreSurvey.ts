import { useState } from 'react';
import type { PreWorkoutSurvey, PainEntry } from '../../../types';

export function usePreSurvey() {
  const [sleepQuality, setSleepQuality] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [motivation, setMotivation] = useState(5);
  const [hasPain, setHasPain] = useState(false);
  const [painEntries, setPainEntries] = useState<PainEntry[]>([]);
  const [supplements, setSupplements] = useState({
    creatine: false,
    protein: false,
    preWorkoutMeal: false,
  });

  const buildSurvey = (workoutId: string): PreWorkoutSurvey => ({
    workoutId,
    date: new Date().toISOString(),
    sleepQuality,
    sleepHours,
    energyLevel,
    stressLevel,
    motivation,
    hasPain,
    painEntries,
    supplements,
    skipped: false,
  });

  return {
    sleepQuality,
    setSleepQuality,
    sleepHours,
    setSleepHours,
    energyLevel,
    setEnergyLevel,
    stressLevel,
    setStressLevel,
    motivation,
    setMotivation,
    hasPain,
    setHasPain,
    painEntries,
    setPainEntries,
    supplements,
    setSupplements,
    buildSurvey,
  };
}
