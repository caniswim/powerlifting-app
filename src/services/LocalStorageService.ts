import type { IStorageService } from './storage.types';
import {
  getWorkouts, saveWorkout, getWorkoutsByWeek, getLastCompletedWorkout,
  getRecentPerformances, getLastWeightForExercise,
  getRecords, saveRecord, getRecordForExercise, recalculateRecord,
  getProfile, saveProfile,
  getCurrentWeek, setCurrentWeek, getSessionIndex, setSessionIndex,
  getActiveProgramId, setActiveProgramId, resetProgramPosition,
  exportAllData, importData, resetAllData,
  getPreSurveys, savePreSurvey, getPreSurveyForWorkout, getRecentPreSurveys,
  getPostSurveys, savePostSurvey, getPostSurveyForWorkout, getRecentPostSurveys,
  getAllFeedback, saveFeedback, getFeedbackByPeriod, getFeedbackForWorkout, getPendingFeedback,
  getApiKey, setApiKey,
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
  getAllFeedback = getAllFeedback;
  saveFeedback = saveFeedback;
  getFeedbackByPeriod = getFeedbackByPeriod;
  getFeedbackForWorkout = getFeedbackForWorkout;
  getPendingFeedback = getPendingFeedback;
  getApiKey = getApiKey;
  setApiKey = setApiKey;
}
