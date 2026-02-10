import type { MuscleGroup } from '../types';

export type EquipmentType = 'barbell' | 'machine' | 'dumbbell' | 'bodyweight';

export interface ExerciseDefinition {
  id: string;
  name: string;
  equipment: EquipmentType;
  muscleMap: Partial<Record<MuscleGroup, number>>;
}

const registry = new Map<string, ExerciseDefinition>();

export function registerExercise(def: ExerciseDefinition): void {
  registry.set(def.id, def);
}

export function getExercise(id: string): ExerciseDefinition | undefined {
  return registry.get(id);
}

export function getExerciseName(id: string): string {
  return registry.get(id)?.name ?? id;
}

export function getExerciseEquipment(id: string): EquipmentType {
  return registry.get(id)?.equipment ?? 'barbell';
}

export function getExerciseMuscleMap(id: string): Partial<Record<MuscleGroup, number>> {
  return registry.get(id)?.muscleMap ?? {};
}

export function getAllExercises(): ExerciseDefinition[] {
  return Array.from(registry.values());
}

export function getExerciseNames(): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [id, def] of registry) {
    result[id] = def.name;
  }
  return result;
}

export function getExerciseMuscleMapAll(): Record<string, Partial<Record<MuscleGroup, number>>> {
  const result: Record<string, Partial<Record<MuscleGroup, number>>> = {};
  for (const [id, def] of registry) {
    result[id] = def.muscleMap;
  }
  return result;
}

export function getEquipmentIncrement(equipment: EquipmentType): number {
  const increments: Record<EquipmentType, number> = {
    barbell: 2.5,
    machine: 5,
    dumbbell: 2,
    bodyweight: 0,
  };
  return increments[equipment];
}
