export interface SetLog {
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number;
  e1rm: number;
  completed: boolean;
  isPR: boolean;
}

export interface ExercisePrescription {
  exerciseId: string;
  exerciseName: string;
  prescribedSets: number;
  prescribedReps: string;
  prescribedRPE: string;
}

export interface ExerciseLog extends ExercisePrescription {
  sets: SetLog[];
  notes?: string;
  skipped?: boolean;
}

export interface WorkoutLog {
  id: string;
  date: string;
  weekNumber: number;
  macrocycle: number;
  blockName: string;
  blockType: BlockType;
  dayType: DayType;
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
export type DayType = 'squat_emphasis' | 'bench_emphasis' | 'deadlift_emphasis' | 'bench_volume';

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
  total: number;
  dots: number;
}

export interface WeeklyVolume {
  weekNumber: number;
  muscleGroups: Record<string, number>;
}

export interface PrescribedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: string;
  rpe: string;
  notes?: string;
}

export interface PrescribedDay {
  dayType: DayType;
  dayLabel: string;
  exercises: PrescribedExercise[];
}

export interface PrescribedWeek {
  weekNumber: number;
  macrocycle: number;
  blockName: string;
  blockType: BlockType;
  blockObjective: string;
  isDeload: boolean;
  days: PrescribedDay[];
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
  | 'costas';

export type ExerciseMuscleMap = Record<string, Partial<Record<MuscleGroup, number>>>;
