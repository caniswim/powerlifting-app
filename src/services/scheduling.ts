import type { DayType, PrescribedWeek, PrescribedDay } from '../types';
import { programData } from '../data/program/index';

/** Rest days required after each session within a 4-day cycle (0-indexed dayIndex) */
export const REST_DAYS_AFTER: Record<number, number> = {
  0: 0, // After Squat (Lower)  -> can train tomorrow
  1: 1, // After Bench (Upper)  -> train day after tomorrow
  2: 0, // After Deadlift (Lower) -> can train tomorrow
  3: 2, // After Bench Vol (Upper) -> train in 3 days
};

export function getSessionData(sessionIndex: number): {
  week: PrescribedWeek;
  day: PrescribedDay;
  weekNumber: number;
  dayIndex: number;
} | null {
  if (sessionIndex < 0 || sessionIndex > 207) return null;

  const weekNumber = Math.floor(sessionIndex / 4) + 1;
  const dayIndex = sessionIndex % 4;
  const week = programData.find((w) => w.weekNumber === weekNumber);
  if (!week || dayIndex >= week.days.length) return null;

  return {
    week,
    day: week.days[dayIndex],
    weekNumber,
    dayIndex,
  };
}

export function getNextTrainingDate(lastWorkoutDate: string, lastDayIndex: number): Date {
  const restDays = REST_DAYS_AFTER[lastDayIndex] ?? 1;
  const lastDate = new Date(lastWorkoutDate);
  const next = new Date(lastDate);
  next.setDate(next.getDate() + restDays + 1);
  // Reset to start of day
  next.setHours(0, 0, 0, 0);
  return next;
}

export function shouldShowRestWarning(lastWorkoutDate: string, lastDayIndex: number): boolean {
  const recommended = getNextTrainingDate(lastWorkoutDate, lastDayIndex);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now < recommended;
}

/** @deprecated Use getSessionData() with session index instead */
export function getCurrentDayType(): DayType | null {
  const dayOfWeek = new Date().getDay(); // 0=Sun, 1=Mon, ...
  switch (dayOfWeek) {
    case 1: return 'squat_emphasis';
    case 2: return 'bench_emphasis';
    case 4: return 'deadlift_emphasis';
    case 5: return 'bench_volume';
    default: return null;
  }
}
