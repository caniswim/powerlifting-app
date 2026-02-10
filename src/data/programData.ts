// Backward compatibility: re-export everything from new locations
export { programData, getWeekData } from './program/index';
export {
  REST_DAYS_AFTER,
  getSessionData,
  getNextTrainingDate,
  shouldShowRestWarning,
  getCurrentDayType,
} from '../services/scheduling';
