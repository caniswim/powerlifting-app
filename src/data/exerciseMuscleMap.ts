import './exercises/definitions'; // Side-effect: registers all exercises
import { getExerciseNames, getExerciseMuscleMapAll, getAllExercises, getEquipmentIncrement } from '../domain/exerciseRegistry';
import type { ExerciseMuscleMap } from '../types';
import type { EquipmentType } from '../domain/exerciseRegistry';

export type { EquipmentType };
export { getEquipmentIncrement };

// Backward-compat: derived from registry
export const exerciseNames: Record<string, string> = getExerciseNames();
export const exerciseMuscleMap: ExerciseMuscleMap = getExerciseMuscleMapAll();
export const exerciseEquipment: Record<string, EquipmentType> = (() => {
  const result: Record<string, EquipmentType> = {};
  for (const ex of getAllExercises()) {
    result[ex.id] = ex.equipment;
  }
  return result;
})();
export const equipmentIncrement: Record<EquipmentType, number> = {
  barbell: 2.5,
  machine: 5,
  dumbbell: 2,
  bodyweight: 0,
};
