import { useMemo } from 'react';
import { useStorage } from '../../../contexts/StorageContext';

export interface SurveyAlert {
  type: 'warning' | 'danger';
  message: string;
}

export interface SurveyTrends {
  hasSurveyData: boolean;
  hasEnoughData: boolean; // at least 3 sessions
  averages: {
    sleepQuality: number;
    sleepHours: number;
    energyLevel: number;
    stressLevel: number;
    motivation: number;
    sessionQuality: number;
    sessionRPE: number;
  };
  readinessScore: number; // weighted average: (sleep*0.3 + energy*0.3 + motivation*0.2 - stress*0.2) normalized to 0-10
  sparklineData: {
    sleepQuality: number[];
    energyLevel: number[];
    stressLevel: number[];
    sessionRPE: number[];
  };
  alerts: SurveyAlert[];
}

export function useSurveyTrends(): SurveyTrends {
  const storage = useStorage();

  return useMemo(() => {
    const preSurveys = storage.getRecentPreSurveys(10);
    const postSurveys = storage.getRecentPostSurveys(10);

    const hasSurveyData = preSurveys.length > 0 || postSurveys.length > 0;
    const hasEnoughData = preSurveys.length >= 3;

    if (!hasSurveyData) {
      return {
        hasSurveyData: false,
        hasEnoughData: false,
        averages: { sleepQuality: 0, sleepHours: 0, energyLevel: 0, stressLevel: 0, motivation: 0, sessionQuality: 0, sessionRPE: 0 },
        readinessScore: 0,
        sparklineData: { sleepQuality: [], energyLevel: [], stressLevel: [], sessionRPE: [] },
        alerts: [],
      };
    }

    // Calculate averages from pre-surveys
    const avgSleep = preSurveys.length > 0 ? preSurveys.reduce((s, p) => s + p.sleepQuality, 0) / preSurveys.length : 0;
    const avgSleepHours = preSurveys.length > 0 ? preSurveys.reduce((s, p) => s + p.sleepHours, 0) / preSurveys.length : 0;
    const avgEnergy = preSurveys.length > 0 ? preSurveys.reduce((s, p) => s + p.energyLevel, 0) / preSurveys.length : 0;
    const avgStress = preSurveys.length > 0 ? preSurveys.reduce((s, p) => s + p.stressLevel, 0) / preSurveys.length : 0;
    const avgMotivation = preSurveys.length > 0 ? preSurveys.reduce((s, p) => s + p.motivation, 0) / preSurveys.length : 0;
    const avgQuality = postSurveys.length > 0 ? postSurveys.reduce((s, p) => s + p.sessionQuality, 0) / postSurveys.length : 0;
    const avgRPE = postSurveys.length > 0 ? postSurveys.reduce((s, p) => s + p.sessionRPE, 0) / postSurveys.length : 0;

    // Readiness score: weighted average
    const readinessScore = Math.max(0, Math.min(10,
      avgSleep * 0.3 + avgEnergy * 0.3 + avgMotivation * 0.2 + (10 - avgStress) * 0.2
    ));

    // Sparkline data (reversed to be chronological - oldest first)
    const sparklineData = {
      sleepQuality: [...preSurveys].reverse().map(s => s.sleepQuality),
      energyLevel: [...preSurveys].reverse().map(s => s.energyLevel),
      stressLevel: [...preSurveys].reverse().map(s => s.stressLevel),
      sessionRPE: [...postSurveys].reverse().map(s => s.sessionRPE),
    };

    // Generate alerts
    const alerts: SurveyAlert[] = [];

    // Check declining sleep (last 3 vs previous 3)
    if (preSurveys.length >= 6) {
      const recent3 = preSurveys.slice(0, 3);
      const prev3 = preSurveys.slice(3, 6);
      const recentAvgSleep = recent3.reduce((s, p) => s + p.sleepQuality, 0) / 3;
      const prevAvgSleep = prev3.reduce((s, p) => s + p.sleepQuality, 0) / 3;
      if (recentAvgSleep < prevAvgSleep - 1.5) {
        alerts.push({ type: 'warning', message: 'Sono em declínio nas últimas 3 sessões' });
      }
    }

    // Check recurring pain
    const allPainEntries = preSurveys.flatMap(s => s.painEntries);
    const painCount: Record<string, number> = {};
    allPainEntries.forEach(p => { painCount[p.region] = (painCount[p.region] || 0) + 1; });
    Object.entries(painCount).forEach(([region, count]) => {
      if (count >= 3) {
        // Map region to PT-BR label inline
        const labels: Record<string, string> = {
          lower_back: 'Lombar', upper_back: 'Dorsal',
          left_knee: 'Joelho Esq', right_knee: 'Joelho Dir',
          left_shoulder: 'Ombro Esq', right_shoulder: 'Ombro Dir',
          left_hip: 'Quadril Esq', right_hip: 'Quadril Dir',
          left_elbow: 'Cotovelo Esq', right_elbow: 'Cotovelo Dir',
          left_wrist: 'Punho Esq', right_wrist: 'Punho Dir',
          neck: 'Pescoço', other: 'Outro',
        };
        alerts.push({ type: 'danger', message: `Dor recorrente: ${labels[region] || region}` });
      }
    });

    // High stress alert
    if (avgStress >= 8) {
      alerts.push({ type: 'warning', message: 'Nível de estresse elevado' });
    }

    // Low energy alert
    if (avgEnergy <= 3) {
      alerts.push({ type: 'danger', message: 'Energia muito baixa' });
    }

    return {
      hasSurveyData,
      hasEnoughData,
      averages: {
        sleepQuality: avgSleep,
        sleepHours: avgSleepHours,
        energyLevel: avgEnergy,
        stressLevel: avgStress,
        motivation: avgMotivation,
        sessionQuality: avgQuality,
        sessionRPE: avgRPE,
      },
      readinessScore,
      sparklineData,
      alerts,
    };
  }, [storage]);
}
