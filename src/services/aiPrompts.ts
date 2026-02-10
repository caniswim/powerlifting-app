import type { PreWorkoutSurvey, PostWorkoutSurvey, WorkoutLog } from '../types';

const SYSTEM_PROMPT = 'Você é um coach de powerlifting brasileiro. Seja direto, técnico e prático. Máximo 3 parágrafos. Use linguagem de treino de força.';

export function buildDailyPrompt(
  pre: PreWorkoutSurvey | undefined,
  post: PostWorkoutSurvey,
  workout: WorkoutLog
): { role: 'system' | 'user'; content: string }[] {
  const completedSets = workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0
  );
  const totalSets = workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.length, 0
  );

  let userContent = `Análise da sessão de treino:\n`;
  userContent += `- Tipo: ${workout.dayType}, Bloco: ${workout.blockName} (${workout.blockType})\n`;
  userContent += `- Séries completadas: ${completedSets}/${totalSets}\n`;

  if (pre && !pre.skipped) {
    userContent += `\nPré-treino:\n`;
    userContent += `- Sono: ${pre.sleepQuality}/10 (${pre.sleepHours}h)\n`;
    userContent += `- Energia: ${pre.energyLevel}/10\n`;
    userContent += `- Estresse: ${pre.stressLevel}/10\n`;
    userContent += `- Motivação: ${pre.motivation}/10\n`;
    if (pre.hasPain && pre.painEntries.length > 0) {
      userContent += `- Dor: ${pre.painEntries.map(p => `${p.region} (${p.intensity}/10)`).join(', ')}\n`;
    }
  }

  if (!post.skipped) {
    userContent += `\nPós-treino:\n`;
    userContent += `- Qualidade: ${post.sessionQuality}/10\n`;
    userContent += `- RPE geral: ${post.sessionRPE}/10\n`;
    userContent += `- Força percebida: ${post.strengthPerception}\n`;
    userContent += `- Aderência ao plano: ${post.planAdherence}\n`;
    if (post.adherenceReason) userContent += `- Motivo: ${post.adherenceReason}\n`;
    if (post.hasNewPain && post.painEntries.length > 0) {
      userContent += `- Nova dor: ${post.painEntries.map(p => `${p.region} (${p.intensity}/10)`).join(', ')}\n`;
    }
  }

  userContent += `\nDê um feedback breve sobre esta sessão. Destaque pontos positivos e alertas.`;

  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userContent },
  ];
}

export function buildWeeklyPrompt(
  preSurveys: PreWorkoutSurvey[],
  postSurveys: PostWorkoutSurvey[],
  workouts: WorkoutLog[]
): { role: 'system' | 'user'; content: string }[] {
  const activePre = preSurveys.filter(s => !s.skipped);
  const activePost = postSurveys.filter(s => !s.skipped);

  let userContent = `Resumo semanal (${workouts.length} sessões):\n`;

  if (activePre.length > 0) {
    const avgSleep = activePre.reduce((s, p) => s + p.sleepQuality, 0) / activePre.length;
    const avgEnergy = activePre.reduce((s, p) => s + p.energyLevel, 0) / activePre.length;
    const avgStress = activePre.reduce((s, p) => s + p.stressLevel, 0) / activePre.length;
    const avgMotivation = activePre.reduce((s, p) => s + p.motivation, 0) / activePre.length;
    userContent += `\nMédias pré-treino: Sono ${avgSleep.toFixed(1)}/10, Energia ${avgEnergy.toFixed(1)}/10, Estresse ${avgStress.toFixed(1)}/10, Motivação ${avgMotivation.toFixed(1)}/10\n`;
  }

  if (activePost.length > 0) {
    const avgQuality = activePost.reduce((s, p) => s + p.sessionQuality, 0) / activePost.length;
    const avgRPE = activePost.reduce((s, p) => s + p.sessionRPE, 0) / activePost.length;
    userContent += `Médias pós-treino: Qualidade ${avgQuality.toFixed(1)}/10, RPE ${avgRPE.toFixed(1)}/10\n`;
  }

  // Pain frequency
  const allPain = [
    ...activePre.flatMap(s => s.painEntries),
    ...activePost.flatMap(s => s.painEntries),
  ];
  if (allPain.length > 0) {
    const painCount: Record<string, number> = {};
    allPain.forEach(p => { painCount[p.region] = (painCount[p.region] || 0) + 1; });
    userContent += `Dor reportada: ${Object.entries(painCount).map(([r, c]) => `${r} (${c}x)`).join(', ')}\n`;
  }

  userContent += `\nAnalise tendências da semana. Destaque progressos e riscos.`;

  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userContent },
  ];
}

export function buildMonthlyPrompt(
  preSurveys: PreWorkoutSurvey[],
  postSurveys: PostWorkoutSurvey[],
  workouts: WorkoutLog[]
): { role: 'system' | 'user'; content: string }[] {
  const activePre = preSurveys.filter(s => !s.skipped);
  const activePost = postSurveys.filter(s => !s.skipped);

  let userContent = `Análise mensal (${workouts.length} sessões em ~4 semanas):\n`;

  if (activePre.length > 0) {
    const avgSleep = activePre.reduce((s, p) => s + p.sleepQuality, 0) / activePre.length;
    const avgEnergy = activePre.reduce((s, p) => s + p.energyLevel, 0) / activePre.length;
    const avgStress = activePre.reduce((s, p) => s + p.stressLevel, 0) / activePre.length;
    userContent += `Médias do mês: Sono ${avgSleep.toFixed(1)}, Energia ${avgEnergy.toFixed(1)}, Estresse ${avgStress.toFixed(1)}\n`;
  }

  if (activePost.length > 0) {
    const avgQuality = activePost.reduce((s, p) => s + p.sessionQuality, 0) / activePost.length;
    const avgRPE = activePost.reduce((s, p) => s + p.sessionRPE, 0) / activePost.length;
    userContent += `Qualidade média: ${avgQuality.toFixed(1)}, RPE médio: ${avgRPE.toFixed(1)}\n`;
  }

  userContent += `\nAnalise tendências do mesociclo. Recomende ajustes para o próximo bloco.`;

  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userContent },
  ];
}

export function buildQuarterlyPrompt(
  preSurveys: PreWorkoutSurvey[],
  postSurveys: PostWorkoutSurvey[],
  workouts: WorkoutLog[]
): { role: 'system' | 'user'; content: string }[] {
  const activePre = preSurveys.filter(s => !s.skipped);
  const activePost = postSurveys.filter(s => !s.skipped);

  let userContent = `Análise trimestral do macrociclo (${workouts.length} sessões):\n`;

  if (activePre.length > 0) {
    const avgSleep = activePre.reduce((s, p) => s + p.sleepQuality, 0) / activePre.length;
    const avgEnergy = activePre.reduce((s, p) => s + p.energyLevel, 0) / activePre.length;
    userContent += `Médias gerais: Sono ${avgSleep.toFixed(1)}, Energia ${avgEnergy.toFixed(1)}\n`;
  }

  if (activePost.length > 0) {
    const avgQuality = activePost.reduce((s, p) => s + p.sessionQuality, 0) / activePost.length;
    userContent += `Qualidade média das sessões: ${avgQuality.toFixed(1)}/10\n`;
  }

  userContent += `\nFaça uma análise do macrociclo completo. Avalie evolução, pontos fortes, fraquezas e recomendações para o próximo macrociclo.`;

  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userContent },
  ];
}
