import type { IStorageService } from './storage.types';
import type {
  AthleteProfile,
  BodyweightEntry,
  PersonalRecord,
  PostWorkoutSurvey,
  PreWorkoutSurvey,
  RestPainLog,
  WorkoutLog,
} from '../types';
import { LocalStorageService } from './LocalStorageService';
import { dirty, markDirty, markEverythingDirty } from './sync/syncEngine';

/**
 * `IStorageService` com destino Firestore.
 *
 * Decisão central: **a interface não muda e o offline não regride.** Toda
 * leitura e escrita continua síncrona no localStorage — o Firestore recebe um
 * efeito colateral assíncrono, marcado numa fila. Uma implementação que lesse
 * de fato do Firestore precisaria de uma interface assíncrona, o que
 * reescreveria todos os call sites da UI por zero ganho: o app é single-user e
 * o dado local já é a verdade.
 *
 * Composição, não herança: o serviço local expõe seus membros como campos de
 * instância, então o decorador copia a base e sobrescreve só as escritas que
 * precisam marcar sujeira. É também onde se sabe *o que* mudou — a camada de
 * armazenamento local segue sem conhecer a nuvem.
 */
export function createFirestoreStorageService(base: IStorageService = new LocalStorageService()): IStorageService {
  const markWorkout = (workout: WorkoutLog): void => {
    markDirty(
      dirty.sessionKey(workout.id),
      dirty.weekKey(workout.programId ?? base.getActiveProgramId(), workout.weekNumber),
      'state',
    );
  };

  /** A semana de um survey vem do treino a que ele pertence. */
  const markByWorkoutId = (workoutId: string): void => {
    const workout = base.getWorkouts().find((w) => w.id === workoutId);
    if (workout) markWorkout(workout);
  };

  return {
    ...base,

    saveWorkout(workout: WorkoutLog): void {
      base.saveWorkout(workout);
      markWorkout(workout);
    },

    savePreSurvey(survey: PreWorkoutSurvey): void {
      base.savePreSurvey(survey);
      markByWorkoutId(survey.workoutId);
    },

    savePostSurvey(survey: PostWorkoutSurvey): void {
      base.savePostSurvey(survey);
      markByWorkoutId(survey.workoutId);
    },

    /**
     * A semana de um registro de dor fora de sessão vem do CARIMBO do registro,
     * não de um treino: é uma semana sem treino que este caminho existe para
     * salvar. Até aqui só treino e survey de treino marcavam sujeira, e por isso
     * a semana parada nem chegava a ser reescrita — o documento continuava o de
     * antes, dizendo que não houve dor.
     */
    saveRestPainLog(log: RestPainLog): void {
      base.saveRestPainLog(log);
      markDirty(dirty.weekKey(log.programId, log.weekNumber), 'state');
    },

    saveRecord(record: PersonalRecord): void {
      base.saveRecord(record);
      markDirty(dirty.recordKey(record.exerciseId), 'state');
    },

    recalculateRecord(exerciseId: string): void {
      base.recalculateRecord(exerciseId);
      markDirty(dirty.recordKey(exerciseId), 'state');
    },

    saveProfile(profile: AthleteProfile): void {
      base.saveProfile(profile);
      markDirty('athlete', 'state');
    },

    saveBodyweightEntry(entry: BodyweightEntry): void {
      base.saveBodyweightEntry(entry);
      markDirty(dirty.bodyweightKey(entry.date), 'athlete', 'state');
    },

    setSessionIndex(index: number, programId?: string): void {
      base.setSessionIndex(index, programId);
      markDirty('state');
    },

    setActiveProgramId(programId: string): void {
      base.setActiveProgramId(programId);
      markDirty('athlete', 'state');
    },

    importData(json: string): boolean {
      const ok = base.importData(json);
      if (ok) markEverythingDirty();
      return ok;
    },
  };
}
