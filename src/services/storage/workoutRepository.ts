import { workoutTrainedAt } from '../../domain/workoutTime';
import { getRecords } from './recordRepository';
import type { SetCompliance, WorkoutLog } from '../../types';
import { getItem, setItem, KEYS } from './core';

export function getWorkouts(): WorkoutLog[] {
  return getItem<WorkoutLog[]>(KEYS.WORKOUTS, []);
}

export function saveWorkouts(workouts: WorkoutLog[]): void {
  setItem(KEYS.WORKOUTS, workouts);
}

export function saveWorkout(workout: WorkoutLog): void {
  const workouts = getWorkouts();
  const idx = workouts.findIndex((w) => w.id === workout.id);
  if (idx >= 0) {
    workouts[idx] = workout;
  } else {
    workouts.push(workout);
  }
  setItem(KEYS.WORKOUTS, workouts);
}

export function getWorkoutsByWeek(weekNumber: number): WorkoutLog[] {
  return getWorkouts().filter((w) => w.weekNumber === weekNumber);
}

export function getLastCompletedWorkout(): {
  date: string;
  dayIndex: number;
  sessionIndex?: number;
  programId?: string;
} | null {
  // Lido UMA vez: `workoutTrainedAt` consulta os PRs para datar sessões antigas,
  // e chamá-lo dentro do comparador liga uma leitura de storage a cada par.
  const prStamps = getRecords();
  const workouts = getWorkouts()
    .filter((w) => w.completed)
    .sort((a, b) => new Date(workoutTrainedAt(b, prStamps)).getTime() - new Date(workoutTrainedAt(a, prStamps)).getTime());

  if (workouts.length === 0) return null;

  const last = workouts[0];
  // O instante do ESFORÇO, não o do clique em encerrar. Com carimbo por série
  // isto é a primeira série; sem ele degrada para `completedAt`, que é o que o
  // app já usava.
  const date = workoutTrainedAt(last, prStamps);

  if (last.dayIndex !== undefined) {
    return { date, dayIndex: last.dayIndex, sessionIndex: last.sessionIndex, programId: last.programId };
  }

  // Logs anteriores à v2 não guardam dayIndex. Reconstroi a posição casando os
  // treinos concluídos da semana com a ordem de dias do programa legado
  // (arms_shoulders aparece duas vezes, então indexOf sozinho é ambíguo).
  const sameWeekWorkouts = workouts
    .filter((w) => w.weekNumber === last.weekNumber)
    .sort((a, b) => new Date(workoutTrainedAt(a, prStamps)).getTime() - new Date(workoutTrainedAt(b, prStamps)).getTime());

  const dayOrder: string[] = ['squat_emphasis', 'bench_emphasis', 'arms_shoulders', 'deadlift_emphasis', 'bench_volume', 'arms_shoulders'];

  const usedSlots = new Set<number>();
  for (const w of sameWeekWorkouts) {
    for (let i = 0; i < dayOrder.length; i++) {
      if (!usedSlots.has(i) && dayOrder[i] === w.dayType) {
        usedSlots.add(i);
        if (w.id === last.id) return { date, dayIndex: i, programId: last.programId };
        break;
      }
    }
  }

  const dayIndex = dayOrder.indexOf(last.dayType);
  return { date, dayIndex: dayIndex >= 0 ? dayIndex : 0, programId: last.programId };
}

// Recent performances for load suggestion (best set per session, most recent first)
export function getRecentPerformances(
  exerciseId: string,
  limit = 3
): { weight: number; reps: number; rpe: number; e1rm: number; date: string }[] {
  const prRecords = getRecords();
  const workouts = getWorkouts()
    .filter((w) => w.completed)
    // Ordenava por `date`, que é a ABERTURA do log: sessão aberta no dia 16 e
    // treinada no 17 aparecia no histórico antes de uma treinada no dia 16.
    .sort((a, b) =>
      new Date(workoutTrainedAt(b, prRecords)).getTime()
      - new Date(workoutTrainedAt(a, prRecords)).getTime());

  const performances: { weight: number; reps: number; rpe: number; e1rm: number; date: string }[] = [];

  for (const workout of workouts) {
    if (performances.length >= limit) break;
    for (const exercise of workout.exercises) {
      if (exercise.exerciseId === exerciseId) {
        const completedSets = exercise.sets.filter((s) => s.completed && s.weight > 0);
        if (completedSets.length > 0) {
          const bestSet = completedSets.reduce((best, s) =>
            s.e1rm > best.e1rm ? s : best
          );
          performances.push({
            weight: bestSet.weight,
            reps: bestSet.reps,
            rpe: bestSet.rpe,
            e1rm: bestSet.e1rm,
            // `workout.date` é a ABERTURA do log, não o esforço: o histórico
            // datava a carga pelo dia em que a tela foi aberta.
            date: workoutTrainedAt(workout, prRecords),
          });
        }
        break;
      }
    }
  }

  return performances;
}

/**
 * Barra e anilha usadas pela última vez NESTE exercício, em sessões anteriores.
 *
 * Material é propriedade do ginásio e do exercício, não da série: o terra sai
 * sempre da mesma barra de whip alto, o supino da mesma anilha grossa. Obrigar
 * a reescolher a cada sessão é atrito que faz o campo ficar vazio — e vazio no
 * histórico não é "não usou", é "não sabemos", que é o que tira a carga da
 * comparação com o padrão calibrado.
 */
export function getLastGearForExercise(
  exerciseId: string
): Pick<SetCompliance, 'bar' | 'plates'> | null {
  const prRecords = getRecords();
  const workouts = getWorkouts()
    .filter((w) => w.completed)
    .sort((a, b) =>
      new Date(workoutTrainedAt(b, prRecords)).getTime()
      - new Date(workoutTrainedAt(a, prRecords)).getTime());

  // Barra e anilha são procuradas separadamente: uma sessão pode ter registrado
  // só a barra, e cair fora por isso perderia o dado que existe.
  const gear: Pick<SetCompliance, 'bar' | 'plates'> = {};

  for (const workout of workouts) {
    // De trás para frente — sessão, exercício e série: o mais recente vence.
    for (let e = workout.exercises.length - 1; e >= 0; e--) {
      const exercise = workout.exercises[e];
      if (exercise.exerciseId !== exerciseId) continue;
      for (let i = exercise.sets.length - 1; i >= 0; i--) {
        const set = exercise.sets[i];
        if (!set.completed || !set.compliance) continue;
        if (!gear.bar && set.compliance.bar) gear.bar = set.compliance.bar;
        if (!gear.plates && set.compliance.plates) gear.plates = set.compliance.plates;
        if (gear.bar && gear.plates) return gear;
      }
    }
  }

  return gear.bar || gear.plates ? gear : null;
}

// Last weight used for an exercise
export function getLastWeightForExercise(exerciseId: string): number | null {
  const workouts = getWorkouts()
    .filter((w) => w.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      if (exercise.exerciseId === exerciseId) {
        const completedSets = exercise.sets.filter((s) => s.completed);
        if (completedSets.length > 0) {
          return completedSets[completedSets.length - 1].weight;
        }
      }
    }
  }
  return null;
}
