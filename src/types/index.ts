/** Natureza de uma série dentro de um bloco de prescrição. */
export type SetType =
  | 'warmup'   // série de aquecimento (pirâmide) — não conta volume, PR nem e1RM
  | 'working'  // série de trabalho normal
  | 'top'      // top set / single pesado
  | 'backoff'  // série mais leve após a top set
  | 'amrap'    // as many reps as possible
  | 'dropset'  // série com redução de carga no meio
  | 'cluster'  // 21s, rest-pause e afins (múltiplos segmentos, mesma carga)
  | 'timed';   // isometria medida em segundos

/** Unidade em que a série é contada. */
export type RepUnit = 'reps' | 'seconds';

/** Levantamento de referência para prescrições em %1RM. */
export type PercentRef = 'squat' | 'bench' | 'deadlift' | 'ohp';

/**
 * Sub-parte de uma série: as duas fases de um dropset, os três blocos de um 21s,
 * os lados de um exercício unilateral, os clusters de um rest-pause.
 */
export interface PrescribedSegment {
  /** Rótulo curto exibido na UI: "1", "2", "Esq", "Dir", "Drop", "Topo". */
  label: string;
  /** Reps verbatim do markdown ("7", "15", "4", "AMRAP"). */
  reps: string;
  unit?: RepUnit;
  /** Redução de carga sugerida vs. o segmento anterior (0.3 = -30%). */
  loadDropPct?: number;
  note?: string;
}

/** Prescrição de UMA série. É o nível de fidelidade exigido pelo markdown. */
export interface PrescribedSet {
  setNumber: number;
  type: SetType;
  /** Reps verbatim do markdown: "4-6", "AMRAP", "7/7/7", "20-30 sec". */
  reps: string;
  unit: RepUnit;
  rpe?: string;
  /** %1RM verbatim: "82.5-87.5%". */
  percent1RM?: string;
  percentMin?: number;
  percentMax?: number;
  percentRef?: PercentRef;
  /** Descanso após a série, em segundos (extremo inferior do range). 0 = emendar. */
  restSec?: number;
  /** Descanso verbatim: "3-4 MIN". */
  restLabel?: string;
  /** Série executada em cada lado. */
  perSide?: boolean;
  segments?: PrescribedSegment[];
  /** Só para aquecimento: fração da carga da primeira série de trabalho. */
  warmupFraction?: number;
  note?: string;
}

/** Sub-parte executada de uma série. */
export interface SetSegmentLog {
  label: string;
  weight: number;
  reps: number;
  seconds?: number;
}

export interface SetLog {
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number;
  e1rm: number;
  completed: boolean;
  isPR: boolean;
  setType?: SetType;
  unit?: RepUnit;
  /** Duração executada, para séries isométricas. */
  durationSec?: number;
  perSide?: boolean;
  segments?: SetSegmentLog[];
  /** Snapshot da prescrição desta série específica. */
  prescribed?: PrescribedSet;
}

export interface ExercisePrescription {
  exerciseId: string;
  exerciseName: string;
  prescribedSets: number;
  prescribedReps: string;
  prescribedRPE: string;
  supersetGroup?: string;
  supersetOrder?: number;
  /** Identificador do bloco dentro do dia (um exercício pode repetir no mesmo dia). */
  blockId?: string;
  /** Rótulo verbatim do markdown, incluindo prefixo de superset e "[OR ...]". */
  rawLabel?: string;
  /** Notas prescritas pelo programa (distintas das notas do usuário). */
  prescribedNotes?: string;
  warmupSets?: number;
  restSec?: number;
  restLabel?: string;
  percent1RM?: string;
  percentRef?: PercentRef;
  perSide?: boolean;
  optional?: boolean;
  unit?: RepUnit;
  /** Variações permitidas, incluindo a padrão na primeira posição. */
  variations?: { exerciseId: string; name: string }[];
  /** Plano série a série, já materializado (aquecimentos + séries de trabalho). */
  setPlan?: PrescribedSet[];
}

export interface ExerciseLog extends ExercisePrescription {
  sets: SetLog[];
  notes?: string;
  skipped?: boolean;
}

export interface WorkoutLog {
  id: string;
  date: string;
  /** Programa a que este treino pertence. Ausente = programa legado de 52 semanas. */
  programId?: string;
  weekNumber: number;
  macrocycle: number;
  blockName: string;
  blockType: BlockType;
  dayType: DayType;
  /** Posição do dia dentro da semana — desambigua dias com o mesmo dayType. */
  dayIndex?: number;
  sessionIndex?: number;
  exercises: ExerciseLog[];
  notes?: string;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
}

export interface WorkoutSummary {
  id: string;
  date: string;
  weekNumber: number;
  macrocycle: number;
  blockName: string;
  blockType: BlockType;
  dayType: DayType;
  completed: boolean;
  completedAt?: string;
}

export interface WorkoutExercises {
  exercises: ReadonlyArray<{
    exerciseId: string;
    sets: ReadonlyArray<{ completed: boolean }>;
  }>;
}

export type BlockType = 'accumulation' | 'transmutation' | 'intensification' | 'realization' | 'deload';

export type DayType =
  // Programa legado de 52 semanas
  | 'squat_emphasis' | 'bench_emphasis' | 'deadlift_emphasis' | 'bench_volume' | 'arms_shoulders'
  // Powerbuilding Phase 2.0 — semanas ímpares (full body, 5 dias)
  | 'fb_strength' | 'fb_continued_a' | 'fb_hypertrophy' | 'fb_continued_b' | 'arms_hypertrophy'
  // Powerbuilding Phase 2.0 — semanas pares (upper/lower, 4 dias)
  | 'lower_body' | 'upper_body' | 'lower_body_continued' | 'upper_body_continued';

export interface PersonalRecord {
  exerciseId: string;
  e1rm: number;
  weight: number;
  reps: number;
  rpe: number;
  date: string;
}

export interface AthleteProfile {
  bodyweight: number;
  squat1RM: number;
  bench1RM: number;
  deadlift1RM: number;
  /** Desenvolvimento militar — exigido pelas prescrições em %1RM do Powerbuilding 2.0. */
  ohp1RM?: number;
  total: number;
  dots: number;
}

export interface WeeklyVolume {
  weekNumber: number;
  muscleGroups: Record<string, number>;
}

/**
 * Um bloco de prescrição = uma linha da tabela do programa.
 * O mesmo exercício pode aparecer em vários blocos no mesmo dia
 * (ex.: supino top set + back-off + série de reps altas).
 */
export interface PrescribedExercise {
  exerciseId: string;
  exerciseName: string;
  /** Séries de trabalho (não inclui aquecimento). */
  sets: number;
  reps: string;
  rpe: string;
  notes?: string;
  supersetGroup?: string;  // "A" | "B" | "C"
  supersetOrder?: number;  // 1 | 2 (A1, A2...)
  /** Chave estável do bloco dentro do dia. */
  blockId?: string;
  /** Rótulo verbatim do markdown. */
  rawLabel?: string;
  warmupSets?: number;
  restSec?: number;
  restLabel?: string;
  percent1RM?: string;
  percentMin?: number;
  percentMax?: number;
  percentRef?: PercentRef;
  perSide?: boolean;
  optional?: boolean;
  /** Variações aceitas pelo programa ("Box Squat", "Nordic Ham Curl"). */
  alternatives?: string[];
  /** Ids das variações, na mesma ordem de `alternatives`. */
  alternativeIds?: string[];
  unit?: RepUnit;
  /** Plano série a série (aquecimentos + séries de trabalho). */
  setPlan?: PrescribedSet[];
}

export interface PrescribedDay {
  dayType: DayType;
  dayLabel: string;
  /** Posição do dia dentro da semana (0-based). */
  dayIndex?: number;
  /** Dias de descanso sugeridos após esta sessão. */
  restDaysAfter?: number;
  /** Texto de descanso verbatim do programa. */
  restNote?: string;
  exercises: PrescribedExercise[];
}

export interface PrescribedWeek {
  weekNumber: number;
  macrocycle: number;
  blockName: string;
  blockType: BlockType;
  blockObjective: string;
  isDeload: boolean;
  /** Rótulo verbatim do cabeçalho da semana, quando houver. */
  weekLabel?: string;
  days: PrescribedDay[];
}

/** Um programa de treino completo e selecionável. */
export interface TrainingProgram {
  id: string;
  name: string;
  author?: string;
  description: string;
  /** Procedência dos dados (arquivo markdown de origem, por exemplo). */
  source?: string;
  weeks: PrescribedWeek[];
}

/** Uma sessão do programa, já resolvida na ordem linear de execução. */
export interface ProgramSession {
  sessionIndex: number;
  weekNumber: number;
  dayIndex: number;
  week: PrescribedWeek;
  day: PrescribedDay;
}

export type MuscleGroup =
  | 'quads'
  | 'glúteos'
  | 'erectors'
  | 'hamstrings'
  | 'peito'
  | 'deltóide_anterior'
  | 'deltóide_posterior'
  | 'deltóide_lateral'
  | 'tríceps'
  | 'bíceps'
  | 'costas'
  | 'braquial'
  | 'panturrilha'
  | 'abdômen'
  | 'trapézio'
  | 'antebraço'
  | 'pescoço'
  | 'abdutores';

export type ExerciseMuscleMap = Record<string, Partial<Record<MuscleGroup, number>>>;

// Pain
export type PainRegion =
  | 'lower_back' | 'upper_back'
  | 'left_knee' | 'right_knee'
  | 'left_shoulder' | 'right_shoulder'
  | 'left_hip' | 'right_hip'
  | 'left_elbow' | 'right_elbow'
  | 'left_wrist' | 'right_wrist'
  | 'neck' | 'other';

export interface PainEntry {
  region: PainRegion;
  intensity: number; // 1-10
}

// Pre-Workout Survey
export interface PreWorkoutSurvey {
  workoutId: string;
  date: string;
  sleepQuality: number;     // 1-10
  sleepHours: number;       // 0-14, step 0.5
  energyLevel: number;      // 1-10
  stressLevel: number;      // 1-10
  motivation: number;       // 1-10
  hasPain: boolean;
  painEntries: PainEntry[];
  supplements: {
    creatine: boolean;
    protein: boolean;
    preWorkoutMeal: boolean;
  };
  skipped: boolean;
}

// Post-Workout Survey
export type StrengthPerception = 'below' | 'normal' | 'above';
export type PlanAdherence = 'full' | 'partial' | 'none';

export interface PostWorkoutSurvey {
  workoutId: string;
  date: string;
  sessionQuality: number;     // 1-10
  sessionRPE: number;         // 1-10
  strengthPerception: StrengthPerception;
  planAdherence: PlanAdherence;
  adherenceReason?: string;
  hasNewPain: boolean;
  painEntries: PainEntry[];
  pumpRating?: number;        // 1-5
  notes?: string;
  skipped: boolean;
}

// AI Feedback
export type FeedbackPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export interface AIFeedback {
  id: string;
  workoutId?: string;
  date: string;
  period: FeedbackPeriod;
  weekNumber?: number;
  macrocycle?: number;
  content: string;
  status: 'pending' | 'completed' | 'failed';
}
