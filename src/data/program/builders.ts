import type { PrescribedWeek, PrescribedDay, PrescribedExercise, BlockType, DayType } from '../../types';
import { exerciseNames } from '../exerciseMuscleMap';

export function ex(
  exerciseId: string,
  sets: number,
  reps: string,
  rpe: string,
  notes?: string,
  supersetGroup?: string,
): PrescribedExercise {
  return {
    exerciseId,
    exerciseName: exerciseNames[exerciseId] ?? exerciseId,
    sets,
    reps,
    rpe,
    ...(notes ? { notes } : {}),
    ...(supersetGroup ? { supersetGroup } : {}),
  };
}

export function day(dayType: DayType, label: string, exercises: PrescribedExercise[]): PrescribedDay {
  return { dayType, dayLabel: label, exercises };
}

export function week(
  weekNumber: number,
  macrocycle: number,
  blockName: string,
  blockType: BlockType,
  blockObjective: string,
  isDeload: boolean,
  days: PrescribedDay[],
): PrescribedWeek {
  return { weekNumber, macrocycle, blockName, blockType, blockObjective, isDeload, days };
}
