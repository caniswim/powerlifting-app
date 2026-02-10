import type { IStorageService } from './storage.types';
import {
  getWorkouts, saveWorkout, getWorkoutsByWeek, getLastCompletedWorkout,
  getRecentPerformances, getLastWeightForExercise,
  getRecords, saveRecord, getRecordForExercise, recalculateRecord,
  getProfile, saveProfile,
  getCurrentWeek, setCurrentWeek, getSessionIndex, setSessionIndex,
  exportAllData, importData, resetAllData,
} from './storage/index';

export class LocalStorageService implements IStorageService {
  getWorkouts = getWorkouts;
  saveWorkout = saveWorkout;
  getWorkoutsByWeek = getWorkoutsByWeek;
  getLastCompletedWorkout = getLastCompletedWorkout;
  getRecentPerformances = getRecentPerformances;
  getLastWeightForExercise = getLastWeightForExercise;
  getRecords = getRecords;
  saveRecord = saveRecord;
  getRecordForExercise = getRecordForExercise;
  recalculateRecord = recalculateRecord;
  getProfile = getProfile;
  saveProfile = saveProfile;
  getCurrentWeek = getCurrentWeek;
  setCurrentWeek = setCurrentWeek;
  getSessionIndex = getSessionIndex;
  setSessionIndex = setSessionIndex;
  exportAllData = exportAllData;
  importData = importData;
  resetAllData = resetAllData;
}
