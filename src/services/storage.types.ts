import type { WorkoutLog, PersonalRecord, AthleteProfile } from '../types';

export interface IStorageService {
  // Workouts
  getWorkouts(): WorkoutLog[];
  saveWorkout(workout: WorkoutLog): void;
  getWorkoutsByWeek(weekNumber: number): WorkoutLog[];
  getLastCompletedWorkout(): { date: string; dayIndex: number } | null;
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

  // Session
  getCurrentWeek(): number;
  setCurrentWeek(week: number): void;
  getSessionIndex(): number;
  setSessionIndex(index: number): void;

  // Data Transfer
  exportAllData(): string;
  importData(json: string): boolean;
  resetAllData(): void;
}
