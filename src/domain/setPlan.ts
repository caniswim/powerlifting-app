import type { PrescribedExercise, PrescribedSegment, PrescribedSet, SetType } from '../types';

/**
 * Expande um bloco de prescrição (uma linha da tabela do programa) nas séries
 * individuais que serão executadas: aquecimentos + séries de trabalho.
 *
 * Toda a interpretação de esquemas especiais do markdown mora aqui —
 * "7/7/7", "10/15" (dropset), "8-10(+4+4)" (rest-pause), "AMRAP",
 * "20-30 sec" (isometria) e "... each" (unilateral).
 */

/**
 * Pirâmide de aquecimento, como fração da carga da primeira série de trabalho.
 * Derivada do protocolo do programa (barra → ~40% → ~50% → ~60% → ~70-75% do
 * 1RM antes de uma top set), normalizada para funcionar também quando não há
 * %1RM prescrito.
 */
const WARMUP_LADDER: Record<number, Array<[fraction: number, reps: string]>> = {
  1: [[0.6, '5']],
  2: [[0.5, '8'], [0.75, '4']],
  3: [[0.4, '10'], [0.6, '5'], [0.8, '3']],
  4: [[0.35, '10'], [0.55, '5'], [0.7, '3'], [0.85, '2']],
  5: [[0.3, '15'], [0.5, '5'], [0.65, '4'], [0.78, '3'], [0.9, '2']],
  6: [[0.25, '15'], [0.45, '8'], [0.6, '5'], [0.72, '4'], [0.82, '3'], [0.9, '2']],
};

const WARMUP_REST_SEC = 60;

/** Redução padrão de um dropset quando o programa diz "~30-50%". */
const DEFAULT_DROP_PCT = 0.4;

function ladderFor(count: number): Array<[number, string]> {
  if (count <= 0) return [];
  return WARMUP_LADDER[Math.min(count, 6)] ?? WARMUP_LADDER[6];
}

/** Reps sem o sufixo "each" dos exercícios unilaterais. */
function stripEach(reps: string): string {
  return reps.replace(/\s*each\s*$/, '').trim();
}

/**
 * Classifica a série e, quando o esquema tem sub-partes, devolve os segmentos.
 * As notas do programa continuam sendo exibidas verbatim na UI — os segmentos
 * existem para permitir registrar cada fase separadamente.
 */
function classify(ex: PrescribedExercise): { type: SetType; segments?: PrescribedSegment[] } {
  const reps = stripEach(ex.reps);
  const notes = ex.notes ?? '';

  // Isometria: "30 sec", "20-30 sec", "45 sec"
  if (/sec$/i.test(reps)) return { type: 'timed' };

  // AMRAP
  if (/^AMRAP$/i.test(reps)) return { type: 'amrap' };

  // Rest-pause / myo-reps: "8-10(+4+4)"
  const myo = reps.match(/^([\d-]+)\(\+(\d+)\+(\d+)\)$/);
  if (myo) {
    return {
      type: 'cluster',
      segments: [
        { label: '1', reps: myo[1] },
        { label: '2', reps: myo[2] },
        { label: '3', reps: myo[3] },
      ],
    };
  }

  // 21s: "7/7/7"
  const triple = reps.match(/^(\d+)\/(\d+)\/(\d+)$/);
  if (triple) {
    return {
      type: 'cluster',
      segments: [
        { label: '1', reps: triple[1] },
        { label: '2', reps: triple[2] },
        { label: '3', reps: triple[3] },
      ],
    };
  }

  // Dois blocos: "10/15" (dropset), "5/10" (estrito/cheat), "15/15" (flexão/extensão)
  const pair = reps.match(/^(\d+)\/(\d+)$/);
  if (pair) {
    if (/dropset/i.test(notes)) {
      return {
        type: 'dropset',
        segments: [
          { label: '1', reps: pair[1] },
          { label: 'Drop', reps: pair[2], loadDropPct: DEFAULT_DROP_PCT },
        ],
      };
    }
    if (/flexion/i.test(notes)) {
      return {
        type: 'cluster',
        segments: [
          { label: 'Flexão', reps: pair[1] },
          { label: 'Extensão', reps: pair[2] },
        ],
      };
    }
    if (/strict/i.test(notes)) {
      return {
        type: 'cluster',
        segments: [
          { label: 'Estrito', reps: pair[1] },
          { label: 'Cheat', reps: pair[2] },
        ],
      };
    }
    return {
      type: 'cluster',
      segments: [
        { label: '1', reps: pair[1] },
        { label: '2', reps: pair[2] },
      ],
    };
  }

  if (/TOP SET/i.test(notes)) return { type: 'top' };
  if (/back off/i.test(ex.rawLabel ?? '') || /back off/i.test(notes)) return { type: 'backoff' };

  return { type: 'working' };
}

/** Duas sub-séries E/D para exercícios unilaterais sem outro esquema. */
function perSideSegments(reps: string): PrescribedSegment[] {
  const clean = stripEach(reps);
  return [
    { label: 'Esq', reps: clean },
    { label: 'Dir', reps: clean },
  ];
}

export function buildSetPlan(ex: PrescribedExercise): PrescribedSet[] {
  const plan: PrescribedSet[] = [];
  const { type, segments } = classify(ex);
  const unit = ex.unit ?? (type === 'timed' ? 'seconds' : 'reps');

  // --- Aquecimento -----------------------------------------------------
  const ladder = ladderFor(ex.warmupSets ?? 0);
  ladder.forEach(([fraction, reps], i) => {
    plan.push({
      setNumber: i + 1,
      type: 'warmup',
      reps,
      unit: 'reps',
      warmupFraction: fraction,
      restSec: WARMUP_REST_SEC,
      ...(ex.percentMin !== undefined
        ? { percentMin: round3(ex.percentMin * fraction), percentMax: round3(ex.percentMin * fraction) }
        : {}),
    });
  });

  // --- Séries de trabalho ----------------------------------------------
  const workingSegments = segments ?? (ex.perSide ? perSideSegments(ex.reps) : undefined);

  for (let i = 0; i < ex.sets; i++) {
    const set: PrescribedSet = {
      setNumber: plan.length + 1,
      type,
      reps: ex.reps,
      unit,
    };
    if (ex.rpe) set.rpe = ex.rpe;
    if (ex.percent1RM) {
      set.percent1RM = ex.percent1RM;
      set.percentMin = ex.percentMin;
      set.percentMax = ex.percentMax;
    }
    if (ex.percentRef) set.percentRef = ex.percentRef;
    if (ex.restSec !== undefined) {
      set.restSec = ex.restSec;
      set.restLabel = ex.restLabel;
    }
    if (ex.perSide) set.perSide = true;
    if (workingSegments) set.segments = workingSegments;
    plan.push(set);
  }

  return plan;
}

/** Quantidade de séries de trabalho (exclui aquecimento). */
export function countWorkingSets(plan: PrescribedSet[]): number {
  return plan.filter((s) => s.type !== 'warmup').length;
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}
