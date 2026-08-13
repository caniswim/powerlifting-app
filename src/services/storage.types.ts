import type {
  WorkoutLog,
  PersonalRecord,
  AthleteProfile,
  PreWorkoutSurvey,
  PostWorkoutSurvey,
  BodyweightEntry,
  RestPainLog,
} from '../types';

export interface IStorageService {
  // Workouts
  getWorkouts(): WorkoutLog[];
  saveWorkout(workout: WorkoutLog): void;
  getWorkoutsByWeek(weekNumber: number): WorkoutLog[];
  getLastCompletedWorkout(): { date: string; dayIndex: number; sessionIndex?: number; programId?: string } | null;
  getRecentPerformances(exerciseId: string, limit?: number): { weight: number; reps: number; rpe: number; e1rm: number; date: string }[];
  getLastWeightForExercise(exerciseId: string): number | null;

  // Records
  getRecords(): PersonalRecord[];
  saveRecord(record: PersonalRecord): void;
  getRecordForExercise(exerciseId: string): PersonalRecord | undefined;
  recalculateRecord(exerciseId: string): void;

  // Profile
  getProfile(): AthleteProfile;
  saveProfile(profile: AthleteProfile): void;

  // Bodyweight (série temporal — o DOTS ao longo do tempo)
  getBodyweightEntries(): BodyweightEntry[];
  saveBodyweightEntry(entry: BodyweightEntry): void;
  getLatestBodyweight(): BodyweightEntry | undefined;

  // Session
  getCurrentWeek(): number;
  setCurrentWeek(week: number): void;
  getSessionIndex(programId?: string): number;
  setSessionIndex(index: number, programId?: string): void;
  getActiveProgramId(): string;
  setActiveProgramId(programId: string): void;
  resetProgramPosition(programId?: string): void;

  // Data Transfer
  exportAllData(): string;
  importData(json: string): boolean;
  resetAllData(): void;

  // Surveys
  getPreSurveys(): PreWorkoutSurvey[];
  savePreSurvey(survey: PreWorkoutSurvey): void;
  getPreSurveyForWorkout(workoutId: string): PreWorkoutSurvey | undefined;
  getRecentPreSurveys(limit?: number): PreWorkoutSurvey[];
  getPostSurveys(): PostWorkoutSurvey[];
  savePostSurvey(survey: PostWorkoutSurvey): void;
  getPostSurveyForWorkout(workoutId: string): PostWorkoutSurvey | undefined;
  getRecentPostSurveys(limit?: number): PostWorkoutSurvey[];

  // Dor fora de sessão (sem `workoutId` — é esse o ponto)
  getRestPainLogs(): RestPainLog[];
  saveRestPainLog(log: RestPainLog): void;
  listRestPainByWeek(programId: string, weekNumber: number): RestPainLog[];
  listRestPainByRange(from: string, to: string): RestPainLog[];
}
