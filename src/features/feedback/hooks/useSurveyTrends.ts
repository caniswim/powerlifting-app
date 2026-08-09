import { useMemo } from 'react';
import { useStorage } from '../../../contexts/StorageContext';
import { painRegionLabels } from '../../../domain/painRegions';
import {
  PAIN_GATE,
  painFlagDefault,
  painFlagThreshold,
  painGateScope,
} from '../../../domain/painGate';
import type { PainRegion } from '../../../types';

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

    // Dor. O peitoral tem gate próprio (PROGRAMA.md §1.2) e alerta a UMA
    // ocorrência no limiar do gate; as demais regiões só na recorrência.
    // A tabela de rótulos vinha copiada aqui dentro e teria ficado sem peitoral
    // exatamente na revisão que o adicionou — agora é a mesma do resto do app.
    const allPainEntries = preSurveys.flatMap(s => s.painEntries);
    const painCount: Record<PainRegion, number> = {} as Record<PainRegion, number>;
    const painPeak: Record<PainRegion, number> = {} as Record<PainRegion, number>;
    allPainEntries.forEach(p => {
      painCount[p.region] = (painCount[p.region] || 0) + 1;
      painPeak[p.region] = Math.max(painPeak[p.region] || 0, p.intensity);
    });
    (Object.keys(painCount) as PainRegion[]).forEach((region) => {
      const count = painCount[region];
      const label = painRegionLabels[region] ?? region;
      const scope = painGateScope(region);
      if (scope === 'peitoral' && painPeak[region] >= painFlagThreshold(region)) {
        alerts.push({
          type: 'danger',
          message: `Gate ${PAIN_GATE.secao}: ${label} ${painPeak[region]}/10 (${count}×)`,
        });
      } else if (scope === 'ambiguo' && painPeak[region] >= painFlagThreshold(region)) {
        // A gaveta ambígua é SUSPEITA, não evento do gate. Anunciá-la como
        // "Gate §1.2" faria o alerta vermelho mentir sobre o que aconteceu — e
        // um alerta que exagera é o caminho mais curto para o atleta parar de
        // ler os vermelhos. É a mesma distinção que o rollup semanal faz.
        alerts.push({
          type: 'warning',
          message: `${label} ${painPeak[region]}/10 (${count}×): confirme se era peitoral antes de descartar o gate ${PAIN_GATE.secao}`,
        });
      } else if (count >= painFlagDefault.occurrences) {
        alerts.push({ type: 'danger', message: `Dor recorrente: ${label}` });
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
