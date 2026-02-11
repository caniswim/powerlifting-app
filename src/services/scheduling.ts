import type { DayType, PrescribedWeek, PrescribedDay } from '../types';
import { programData } from '../data/program/index';

/** Days per week in the training cycle */
export const DAYS_PER_WEEK = 6;
export const TOTAL_SESSIONS = 312; // 52 weeks × 6 days

/** Rest days required after each session within a 6-day cycle (0-indexed dayIndex) */
export const REST_DAYS_AFTER: Record<number, number> = {
  0: 0, // Mon: After Squat -> Tue (train tomorrow)
  1: 0, // Tue: After Bench -> Wed (train tomorrow)
  2: 0, // Wed: After Arms A -> Thu (train tomorrow)
  3: 0, // Thu: After Deadlift -> Fri (train tomorrow)
  4: 0, // Fri: After Bench Vol -> Sat (train tomorrow)
  5: 1, // Sat: After Arms B -> Mon (Sunday rest, train in 2 days)
};

export function getSessionData(sessionIndex: number): {
  week: PrescribedWeek;
  day: PrescribedDay;
  weekNumber: number;
  dayIndex: number;
} | null {
  if (sessionIndex < 0 || sessionIndex >= TOTAL_SESSIONS) return null;

  const weekNumber = Math.floor(sessionIndex / DAYS_PER_WEEK) + 1;
  const dayIndex = sessionIndex % DAYS_PER_WEEK;
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
    case 3: return 'arms_shoulders';
    case 4: return 'deadlift_emphasis';
    case 5: return 'bench_volume';
    case 6: return 'arms_shoulders';
    default: return null;
  }
}
