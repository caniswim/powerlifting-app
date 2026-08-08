import type {
  BlockType,
  DayType,
  PainRegion,
  PercentRef,
  PlanAdherence,
  SquatDepth,
  StrengthPerception,
} from '../../types';

/** Versão da forma dos documentos de rollup. Bumpar exige reenviar tudo. */
export const ROLLUP_SCHEMA_VERSION = 1;

/** Levantamento de referência, com uma gaveta para tudo que não é SBD/OHP. */
export type LiftKey = PercentRef | 'other';

export type LiftTotals = Record<LiftKey, number>;

export interface TopSetRef {
  exerciseId: string;
  name: string;
  weight: number;
  reps: number;
  rpe: number;
  e1rm: number;
  isPR?: boolean;
  date?: string;
}

/** Execução medida contra a regra IPF, agregada. */
export interface ComplianceTotals {
  sets: number;
  judgedSets: number;
  reps: number;
  judgedReps: number;
  validReps: number;
  validRepPct: number | null;
  videos: number;
  /** Agachamento. */
  depth?: Record<SquatDepth, number>;
  /** Supino. */
  pausedSets?: number;
  avgPauseSec?: number | null;
  /** Terra. */
  deadStopSets?: number;
  strapSets?: number;
}

export interface ComplianceRollup extends ComplianceTotals {
  byLift: Partial<Record<PercentRef, ComplianceTotals>>;
  equipment: { belt: number; straps: number; kneeSleeves: number; wristWraps: number };
  bars: Record<string, number>;
  plates: Record<string, number>;
}

/** Desvio agregado de um exercício em relação ao que o programa prescreveu. */
export interface Deviation {
  exerciseId: string;
  name: string;
  sets: number;
  avgRepsDelta: number | null;
  avgRpeDelta: number | null;
  avgLoadDeltaPct: number | null;
  setsDelta: number;
}

export interface ExerciseSummary {
  exerciseId: string;
  name: string;
  skipped: boolean;
  prescribed: { sets: number; reps: string; rpe: string; percent1RM?: string };
  setsCompleted: number;
  tonnage: number;
  topSet: TopSetRef | null;
  avgRepsDelta: number | null;
  avgRpeDelta: number | null;
  avgLoadDeltaPct: number | null;
  compliance: ComplianceTotals;
  notes?: string;
}

export interface PreSummary {
  sleepQuality: number;
  sleepHours: number;
  energyLevel: number;
  stressLevel: number;
  motivation: number;
  pain: { region: PainRegion; intensity: number }[];
  supplements: { creatine: boolean; protein: boolean; preWorkoutMeal: boolean };
}

export interface PostSummary {
  sessionQuality: number;
  sessionRPE: number;
  strengthPerception: StrengthPerception;
  planAdherence: PlanAdherence;
  adherenceReason?: string;
  newPain: { region: PainRegion; intensity: number }[];
  pumpRating?: number;
  notes?: string;
}

export interface SessionDoc {
  schemaVersion: number;
  updatedAt: string;
  id: string;
  date: string;
  programId: string;
  weekId: string;
  weekNumber: number;
  macrocycle: number;
  dayIndex: number;
  dayType: DayType;
  blockName: string;
  blockType: BlockType;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
  durationMin: number | null;
  setsPrescribed: number;
  setsCompleted: number;
  tonnage: number;
  tonnageByLift: LiftTotals;
  volumeByMuscle: Record<string, number>;
  exercises: ExerciseSummary[];
  compliance: ComplianceRollup;
  pre: PreSummary | null;
  post: PostSummary | null;
  notes?: string;
}

export interface WeekSessionRow {
  id: string;
  date: string;
  dayIndex: number;
  dayType: DayType;
  completed: boolean;
  setsPrescribed: number;
  setsCompleted: number;
  tonnage: number;
  sessionRPE: number | null;
  sessionQuality: number | null;
  strengthPerception: StrengthPerception | null;
  planAdherence: PlanAdherence | null;
  topSet: TopSetRef | null;
}

export interface SurveyAverages {
  sleepQuality: number;
  sleepHours: number;
  energyLevel: number;
  stressLevel: number;
  motivation: number;
  sessionQuality: number;
  sessionRPE: number;
  pumpRating: number;
}

export interface WeekDoc {
  schemaVersion: number;
  updatedAt: string;
  weekId: string;
  programId: string;
  programName: string;
  weekNumber: number;
  macrocycle: number;
  blockName: string;
  blockType: BlockType;
  isDeload: boolean;
  weekLabel?: string;
  firstDate: string | null;
  lastDate: string | null;

  adherence: {
    sessionsPrescribed: number;
    sessionsCompleted: number;
    setsPrescribed: number;
    setsCompleted: number;
    setsSkipped: number;
    completionPct: number;
    exercisesSkipped: { exerciseId: string; name: string; sessions: number }[];
    planAdherence: Record<PlanAdherence, number>;
  };

  tonnage: { total: number; byLift: LiftTotals; byExercise: Record<string, number> };

  volumeByMuscle: {
    actual: Record<string, number>;
    prescribed: Record<string, number>;
    delta: Record<string, number>;
  };

  topE1rm: Record<string, TopSetRef & { deltaPrevWeek: number | null }>;

  surveys: {
    n: number;
    averages: SurveyAverages;
    deltaPrevWeek: Partial<SurveyAverages>;
    readinessScore: number;
    sRPELoad: number;
    strengthPerception: Record<StrengthPerception, number>;
  };

  pain: {
    region: PainRegion;
    occurrences: number;
    maxIntensity: number;
    avgIntensity: number;
    source: 'pre' | 'post' | 'both';
  }[];

  compliance: ComplianceRollup;

  bodyweight: {
    n: number;
    start: number | null;
    end: number | null;
    avg: number | null;
    deltaKg: number | null;
    dotsStart: number | null;
    dotsEnd: number | null;
    dotsDelta: number | null;
  };

  deviations: Deviation[];
  sessions: WeekSessionRow[];
  notes: { date: string; dayType: DayType; exerciseName?: string; text: string }[];
  flags: string[];
}
