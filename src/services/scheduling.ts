import type { PrescribedWeek, ProgramSession, TrainingProgram } from '../types';
import { getProgram } from '../data/program/programs';

/**
 * O programa ativo define quantas sessões existem e quantos dias tem cada
 * semana — o Powerbuilding 2.0 alterna semanas de 5 e de 4 dias, então a
 * posição do atleta não pode ser derivada de uma constante de dias por semana.
 * A ordem de execução é a lista achatada de dias na ordem do programa.
 */

const sessionCache = new WeakMap<TrainingProgram, ProgramSession[]>();

export function getSessions(programId?: string): ProgramSession[] {
  const program = getProgram(programId);
  const cached = sessionCache.get(program);
  if (cached) return cached;

  const sessions: ProgramSession[] = [];
  for (const week of program.weeks) {
    week.days.forEach((day, dayIndex) => {
      sessions.push({
        sessionIndex: sessions.length,
        weekNumber: week.weekNumber,
        dayIndex,
        week,
        day,
      });
    });
  }
  sessionCache.set(program, sessions);
  return sessions;
}

export function getTotalSessions(programId?: string): number {
  return getSessions(programId).length;
}

export function getTotalWeeks(programId?: string): number {
  return getProgram(programId).weeks.length;
}

export function getSessionData(sessionIndex: number, programId?: string): ProgramSession | null {
  const sessions = getSessions(programId);
  if (sessionIndex < 0 || sessionIndex >= sessions.length) return null;
  return sessions[sessionIndex];
}

/** Índice da primeira sessão de uma semana — usado para navegar no calendário. */
export function getSessionIndexForWeek(weekNumber: number, dayIndex = 0, programId?: string): number {
  const found = getSessions(programId).find(
    (s) => s.weekNumber === weekNumber && s.dayIndex === dayIndex,
  );
  return found ? found.sessionIndex : 0;
}

export function getWeeks(programId?: string): PrescribedWeek[] {
  return getProgram(programId).weeks;
}

/** Dias de descanso sugeridos após a sessão indicada. */
export function getRestDaysAfterSession(sessionIndex: number, programId?: string): number {
  const session = getSessionData(sessionIndex, programId);
  return session?.day.restDaysAfter ?? 1;
}

/**
 * Meia-noite LOCAL do dia de um instante — ou de uma data `YYYY-MM-DD`.
 *
 * `new Date('2026-08-17')` é interpretado como meia-noite **UTC**, que em
 * America/Sao_Paulo é 16/08 às 21h. O `.getDate()` seguinte devolvia 16, e todo
 * cálculo de descanso alimentado por uma data pura errava um dia inteiro, para
 * menos — liberando treino na véspera do recomendado, em silêncio.
 *
 * Estava dormente porque os chamadores passam ISO completo. Mas `localDateKey()`
 * produz exatamente `YYYY-MM-DD` e já alimenta dor fora de treino e peso
 * corporal; bastava alguém ligar um dos dois a esta função. Consertado na
 * entrada, não em cada chamador.
 */
function localMidnight(value: string): Date {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const d = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getNextTrainingDate(lastWorkoutDate: string, restDays: number): Date {
  const next = localMidnight(lastWorkoutDate);
  next.setDate(next.getDate() + restDays + 1);
  return next;
}

export function shouldShowRestWarning(lastWorkoutDate: string, restDays: number): boolean {
  const recommended = getNextTrainingDate(lastWorkoutDate, restDays);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now < recommended;
}
