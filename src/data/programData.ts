// Backward compatibility: re-export everything from new locations
export { programData, getWeekData } from './program/index';
export {
  getProgram,
  listPrograms,
  programs,
  LEGACY_PROGRAM_ID,
  POWERBUILDING2_ID,
  DEFAULT_PROGRAM_ID,
} from './program/programs';
export {
  getSessions,
  getSessionData,
  getTotalSessions,
  getTotalWeeks,
  getWeeks,
  getSessionIndexForWeek,
  getRestDaysAfterSession,
  getNextTrainingDate,
  shouldShowRestWarning,
} from '../services/scheduling';
