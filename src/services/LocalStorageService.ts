import type { IStorageService } from './storage.types';
import {
  getWorkouts, saveWorkout, getWorkoutsByWeek, getLastCompletedWorkout,
  getRecentPerformances, getLastWeightForExercise,
  getRecords, saveRecord, getRecordForExercise, recalculateRecord,
  getProfile, saveProfile,
  getBodyweightEntries, saveBodyweightEntry, getLatestBodyweight,
  getCurrentWeek, setCurrentWeek, getSessionIndex, setSessionIndex,
  getActiveProgramId, setActiveProgramId, resetProgramPosition,
  exportAllData, importData, resetAllData,
  getPreSurveys, savePreSurvey, getPreSurveyForWorkout, getRecentPreSurveys,
  getPostSurveys, savePostSurvey, getPostSurveyForWorkout, getRecentPostSurveys,
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
  getBodyweightEntries = getBodyweightEntries;
  saveBodyweightEntry = saveBodyweightEntry;
  getLatestBodyweight = getLatestBodyweight;
  getCurrentWeek = getCurrentWeek;
  setCurrentWeek = setCurrentWeek;
  getSessionIndex = getSessionIndex;
  setSessionIndex = setSessionIndex;
  getActiveProgramId = getActiveProgramId;
  setActiveProgramId = setActiveProgramId;
  resetProgramPosition = resetProgramPosition;
  exportAllData = exportAllData;
  importData = importData;
  resetAllData = resetAllData;
  getPreSurveys = getPreSurveys;
  savePreSurvey = savePreSurvey;
  getPreSurveyForWorkout = getPreSurveyForWorkout;
  getRecentPreSurveys = getRecentPreSurveys;
  getPostSurveys = getPostSurveys;
  savePostSurvey = savePostSurvey;
  getPostSurveyForWorkout = getPostSurveyForWorkout;
  getRecentPostSurveys = getRecentPostSurveys;
}
