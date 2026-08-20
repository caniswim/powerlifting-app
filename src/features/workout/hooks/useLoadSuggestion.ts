import { useCallback, useRef, useState } from 'react';
import {
  estimateE1RMWeighted,
  suggestWeight,
  suggestWeightFromPercent,
  roundToIncrement,
  parseTargetNumber,
} from '../../../utils/calculations';
import type { LoadSuggestion } from '../../../utils/calculations';
import { useStorage } from '../../../contexts/StorageContext';
import { exerciseEquipment, equipmentIncrement } from '../../../data/exerciseMuscleMap';
import { resolveReferenceMax } from '../../../domain/referenceMax';
import { blocksLoadSuggestion } from '../../../domain/trainingMaxGuard';
import type {
  ExerciseLog,
  PrescribedSet,
  SetCompliance,
  SetSegmentLog,
} from '../../../types';

export interface SetInputState {
  inputWeight: number;
  inputReps: number;
  inputRPE: number;
  inputSeconds: number;
  inputSegments: SetSegmentLog[];
  inputCompliance: SetCompliance;
  suggestion: LoadSuggestion | null;
  setInputWeight: (w: number) => void;
  setInputReps: (r: number) => void;
  setInputRPE: (rpe: number) => void;
  setInputSeconds: (s: number) => void;
  updateSegment: (index: number, patch: Partial<SetSegmentLog>) => void;
  updateCompliance: (patch: Partial<SetCompliance>) => void;
  prefillInputs: (exercise: ExerciseLog, setIdx: number) => void;
}

/** @deprecated nome antigo mantido para os imports existentes */
export type LoadSuggestionState = SetInputState;

export function useLoadSuggestion(): SetInputState {
  const storage = useStorage();

  const [inputWeight, setInputWeight] = useState(0);
  const [inputReps, setInputReps] = useState(0);
  const [inputRPE, setInputRPE] = useState(7);
  const [inputSeconds, setInputSeconds] = useState(0);
  const [inputSegments, setInputSegments] = useState<SetSegmentLog[]>([]);
  const [inputCompliance, setInputCompliance] = useState<SetCompliance>({});
  const [suggestion, setSuggestion] = useState<LoadSuggestion | null>(null);

  // Barra, anilha e equipamento não mudam entre séries da mesma sessão —
  // repetir a escolha a cada série seria atrito que faria o registro morrer.
  const gearRef = useRef<Pick<SetCompliance, 'equipment' | 'bar' | 'plates'>>({});

  const updateSegment = useCallback((index: number, patch: Partial<SetSegmentLog>) => {
    setInputSegments((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }, []);

  const updateCompliance = useCallback((patch: Partial<SetCompliance>) => {
    setInputCompliance((prev) => {
      const next = { ...prev, ...patch };
      gearRef.current = { equipment: next.equipment, bar: next.bar, plates: next.plates };
      return next;
    });
  }, []);

  const weightFromHistory = useCallback((
    exercise: ExerciseLog,
    targetReps: number,
    targetRPE: number,
    increment: number,
  ): { weight: number; suggestion: LoadSuggestion | null } => {
    const performances = storage.getRecentPerformances(exercise.exerciseId, 3);
    if (performances.length === 0) return { weight: 0, suggestion: null };

    const estimatedE1RM = estimateE1RMWeighted(performances);
    const suggested = suggestWeight(estimatedE1RM, targetReps || 5, targetRPE, increment);
    if (suggested <= 0) return { weight: 0, suggestion: null };

    return {
      weight: suggested,
      suggestion: {
        weight: suggested,
        basedOnE1RM: Math.round(estimatedE1RM * 10) / 10,
        sessionsUsed: performances.length,
      },
    };
  }, [storage]);

  const prefillInputs = useCallback((exercise: ExerciseLog, setIdx: number) => {
    const plan: PrescribedSet | undefined = exercise.sets[setIdx]?.prescribed;
    const increment = equipmentIncrement[exerciseEquipment[exercise.exerciseId] || 'barbell'];

    // --- Alvos de reps / tempo / RPE -------------------------------------
    const repsSource = plan?.reps ?? exercise.prescribedReps;
    const isTimed = plan?.unit === 'seconds';
    const isAmrap = plan?.type === 'amrap' || /AMRAP/i.test(repsSource);

    if (isTimed) {
      setInputSeconds(parseTargetNumber(repsSource));
      setInputReps(0);
    } else {
      setInputSeconds(0);
      setInputReps(isAmrap ? 0 : parseTargetNumber(repsSource));
    }

    const rpeSource = plan?.rpe ?? exercise.prescribedRPE;
    setInputRPE(parseTargetNumber(rpeSource) || 7);

    // --- Carga ------------------------------------------------------------
    const targetReps = isAmrap || isTimed ? parseTargetNumber(exercise.prescribedReps) || 5 : parseTargetNumber(repsSource);
    const targetRPE = parseTargetNumber(rpeSource) || 7;

    let weight = 0;
    let nextSuggestion: LoadSuggestion | null = null;

    // 1) %1RM prescrito pelo programa tem precedência.
    const ref = exercise.percentRef;
    const percent = plan?.percentMin;
    // Programa prescrito em padrão de competição sem máximo técnico definido:
    // não sugerir nada é o certo. O fallback para o 1RM de academia daria
    // carga alta demais, e sugerir errado é pior que não sugerir.
    const blocked = ref !== undefined && blocksLoadSuggestion(storage.getProfile(), storage.getActiveProgramId(), ref);

    // Bloqueado: nenhuma via de sugestão roda. Nem o e1RM histórico, que viria
    // de um padrão de execução diferente do que este programa prescreve.
    if (!blocked) {
      if (ref && percent) {
        const oneRM = resolveReferenceMax(storage.getProfile(), ref);
        // roundToKg do programa vence o incremento do equipamento: o Bloco 1 é
        // prescrito contra a grade de 2,5 kg das micro-anilhas.
        weight = suggestWeightFromPercent(oneRM, percent, plan?.roundToKg ?? increment, plan?.roundGuard);
      }

      // 2) Aquecimento sem %1RM: fração da carga da primeira série de trabalho.
      if (weight === 0 && plan?.type === 'warmup' && plan.warmupFraction) {
        const firstWorking = exercise.sets.find((s) => s.setType !== 'warmup');
        const base = firstWorking?.completed && firstWorking.weight > 0
          ? firstWorking.weight
          : weightFromHistory(exercise, targetReps, targetRPE, increment).weight;
        weight = roundToIncrement(base * plan.warmupFraction, increment);
      }

      // 3) Séries seguintes do mesmo bloco repetem a carga da anterior.
      if (weight === 0) {
        const prevSet = setIdx > 0 ? exercise.sets[setIdx - 1] : null;
        if (prevSet?.completed && prevSet.setType === plan?.type) {
          weight = prevSet.weight;
        }
      }

      // 4) Sem prescrição de carga: estimativa por e1RM histórico.
      if (weight === 0) {
        const fromHistory = weightFromHistory(exercise, targetReps, targetRPE, increment);
        weight = fromHistory.weight;
        nextSuggestion = fromHistory.suggestion;
      }
    }

    setInputWeight(weight);
    setSuggestion(nextSuggestion);

    // --- Segmentos (dropset, 21s, rest-pause, unilateral) -----------------
    if (plan?.segments?.length) {
      setInputSegments(plan.segments.map((seg) => ({
        label: seg.label,
        weight: seg.loadDropPct ? roundToIncrement(weight * (1 - seg.loadDropPct), increment) : weight,
        reps: seg.unit === 'seconds' ? 0 : parseTargetNumber(seg.reps),
        ...(seg.unit === 'seconds' ? { seconds: parseTargetNumber(seg.reps) } : {}),
      })));
    } else {
      setInputSegments([]);
    }

    // --- Padrão de competição -------------------------------------------
    // Herda só o material/equipamento; o julgamento da série começa em branco.
    const lastJudged = [...exercise.sets]
      .slice(0, setIdx)
      .reverse()
      .find((s) => s.completed && s.compliance);
    const sessionGear = lastJudged?.compliance ?? gearRef.current;
    // Barra e anilha do último registro DESTE exercício. Vencem `gearRef`, que
    // guarda a última série da sessão e pode ser de outro exercício: o terra
    // depois do agachamento não sai da barra que ficou selecionada no rack.
    // Perdem para uma escolha feita nesta sessão neste exercício — trocar a
    // barra no meio do treino não pode ser desfeito pelo histórico.
    const priorGear = storage.getLastGearForExercise(exercise.exerciseId);
    const bar = lastJudged?.compliance?.bar ?? priorGear?.bar ?? sessionGear.bar;
    const plates = lastJudged?.compliance?.plates ?? priorGear?.plates ?? sessionGear.plates;
    const inherited: SetCompliance = {
      ...(sessionGear.equipment ? { equipment: sessionGear.equipment } : {}),
      ...(bar ? { bar } : {}),
      ...(plates ? { plates } : {}),
    };
    gearRef.current = inherited;
    setInputCompliance(inherited);
  }, [storage, weightFromHistory]);

  return {
    inputWeight,
    inputReps,
    inputRPE,
    inputSeconds,
    inputSegments,
    inputCompliance,
    suggestion,
    setInputWeight,
    setInputReps,
    setInputRPE,
    setInputSeconds,
    updateSegment,
    updateCompliance,
    prefillInputs,
  };
}
