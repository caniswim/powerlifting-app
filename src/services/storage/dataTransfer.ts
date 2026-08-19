import { KEYS, OBSOLETE_KEYS, scheduleSyncToOPFS, setItem, getItem } from './core';
import { clearOPFS } from '../opfs';
import { getWorkouts } from './workoutRepository';
import { getRecords } from './recordRepository';
import { workoutTrainedAt } from '../../domain/workoutTime';
import { getProfile } from './profileRepository';
import { getCurrentWeek, getActiveProgramId, runMigrations, SCHEMA_VERSION } from './sessionManager';
import { getPreSurveys, getPostSurveys } from './surveyRepository';
import { getBodyweightEntries } from './bodyweightRepository';
import { getRestPainLogs } from './restPainRepository';

/**
 * Os treinos com a data do ESFORÇO, não a da abertura da tela.
 *
 * O export é o artefato que sai do app para ser lido por fora — backup, troca de
 * aparelho, e a conversa de análise que decide o próximo bloco. Deixar `date`
 * como o instante de CRIAÇÃO do log fazia o arquivo afirmar que a sessão de
 * 17/08 aconteceu no dia 16, e quem lê o arquivo não tem como saber que não.
 *
 * A escrita já nasce certa a partir desta versão (a primeira série carimba
 * `date`); isto existe para o histórico anterior, que continua no storage com a
 * data velha e é resolvido na leitura por `workoutTrainedAt`.
 *
 * NADA é perdido: `startedAt` continua guardando a abertura, e a operação é
 * idempotente — reimportar e reexportar devolve o mesmo valor.
 */
function workoutsForExport() {
  const records = getRecords();
  return getWorkouts().map((w) => ({ ...w, date: workoutTrainedAt(w, records) }));
}

export function exportAllData(): string {
  return JSON.stringify({
    schemaVersion: SCHEMA_VERSION,
    workouts: workoutsForExport(),
    records: getRecords(),
    profile: getProfile(),
    currentWeek: getCurrentWeek(),
    activeProgram: getActiveProgramId(),
    programProgress: getItem<Record<string, number>>(KEYS.PROGRAM_PROGRESS, {}),
    preSurveys: getPreSurveys(),
    postSurveys: getPostSurveys(),
    bodyweight: getBodyweightEntries(),
    // Sai no backup pelo mesmo motivo que existe: dado que o app não exporta é
    // dado que o app perde na próxima troca de aparelho.
    restPain: getRestPainLogs(),
    exportDate: new Date().toISOString(),
  }, null, 2);
}

export function importData(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (data.workouts) setItem(KEYS.WORKOUTS, data.workouts);
    if (data.records) setItem(KEYS.RECORDS, data.records);
    if (data.profile) setItem(KEYS.PROFILE, data.profile);
    if (data.currentWeek) setItem(KEYS.CURRENT_WEEK, data.currentWeek);
    if (data.preSurveys) setItem(KEYS.PRE_SURVEYS, data.preSurveys);
    if (data.postSurveys) setItem(KEYS.POST_SURVEYS, data.postSurveys);
    if (data.bodyweight) setItem(KEYS.BODYWEIGHT, data.bodyweight);
    if (data.restPain) setItem(KEYS.REST_PAIN, data.restPain);

    if (data.programProgress) {
      setItem(KEYS.PROGRAM_PROGRESS, data.programProgress);
      if (data.activeProgram) setItem(KEYS.ACTIVE_PROGRAM, data.activeProgram);
      // Backups anteriores à v3 não trazem a série de peso: reroda as
      // migrações para semeá-la a partir do perfil importado.
      setItem(KEYS.SCHEMA_VERSION, Math.min(data.schemaVersion ?? SCHEMA_VERSION, SCHEMA_VERSION));
      runMigrations();
    } else {
      // Backup anterior à v2: guarda o índice antigo e deixa a migração
      // carimbar os treinos e mover a posição para o programa legado.
      if (data.sessionIndex != null) {
        setItem(KEYS.SESSION_INDEX, data.sessionIndex);
      } else {
        localStorage.removeItem(KEYS.SESSION_INDEX);
      }
      localStorage.removeItem(KEYS.PROGRAM_PROGRESS);
      localStorage.removeItem(KEYS.SCHEMA_VERSION);
      runMigrations();
    }

    scheduleSyncToOPFS();
    return true;
  } catch {
    return false;
  }
}

export function resetAllData(): void {
  localStorage.removeItem(KEYS.WORKOUTS);
  localStorage.removeItem(KEYS.RECORDS);
  localStorage.removeItem(KEYS.PROFILE);
  localStorage.removeItem(KEYS.CURRENT_WEEK);
  localStorage.removeItem(KEYS.SESSION_INDEX);
  localStorage.removeItem(KEYS.PRE_SURVEYS);
  localStorage.removeItem(KEYS.POST_SURVEYS);
  localStorage.removeItem(KEYS.BODYWEIGHT);
  localStorage.removeItem(KEYS.REST_PAIN);
  localStorage.removeItem(KEYS.ACTIVE_PROGRAM);
  localStorage.removeItem(KEYS.PROGRAM_PROGRESS);
  localStorage.removeItem(KEYS.SCHEMA_VERSION);
  for (const key of OBSOLETE_KEYS) localStorage.removeItem(key);
  clearOPFS();
}
