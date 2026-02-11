// Backward compatibility: re-export everything from new locations
export { programData, getWeekData } from './program/index';
export {
  DAYS_PER_WEEK,
  TOTAL_SESSIONS,
  REST_DAYS_AFTER,
  getSessionData,
  getNextTrainingDate,
  shouldShowRestWarning,
} from '../services/scheduling';
