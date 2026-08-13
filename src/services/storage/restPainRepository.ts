import type { RestPainLog } from '../../types';
import { getItem, setItem, KEYS } from './core';

/**
 * Dor FORA de sessão — o repositório que existe porque o `workoutId` não serve.
 *
 * `surveyRepository` indexa tudo por `workoutId`: sem treino aberto não há onde
 * a entrada morar, e uma semana em que o atleta sente dor e não treina sai do
 * app afirmando que não houve dor nenhuma. Aqui o índice é `date` + `context` —
 * um registro por dia e por momento (repouso · ao acordar · depois de esforço
 * cotidiano), porque dor ao acordar e dor depois de carregar caixa no mesmo dia
 * são dois fatos, e o dia parado continua sendo um dia.
 *
 * O que este repositório NÃO faz: entrar na janela de 3 sessões do gate do
 * §1.2, disparar degrau ou consumir vaga. `buildGateReadings` não lê nada daqui,
 * e é essa separação que torna o registro barato de fazer — o atleta não precisa
 * mais abrir um treino falso para não perder o dado.
 */
export function getRestPainLogs(): RestPainLog[] {
  return getItem<RestPainLog[]>(KEYS.REST_PAIN, [])
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Grava um registro. Regravar o mesmo dia e o mesmo contexto sobrescreve — é a
 * correção de quem marcou 3/10 e quis trocar para 5/10, não um segundo evento.
 */
export function saveRestPainLog(log: RestPainLog): void {
  const logs = getRestPainLogs();
  const idx = logs.findIndex((l) => l.date === log.date && l.context === log.context);
  if (idx >= 0) logs[idx] = log;
  else logs.push(log);

  logs.sort((a, b) => a.date.localeCompare(b.date));
  setItem(KEYS.REST_PAIN, logs);
}

/**
 * Os registros de uma semana do PROGRAMA.
 *
 * O filtro é por `weekNumber` carimbado e não por intervalo de datas de
 * propósito: a semana deste app é a do programa, e uma semana sem sessão nenhuma
 * não tem primeira nem última data para recortar. Era exatamente essa semana que
 * estava sumindo.
 */
export function listRestPainByWeek(programId: string, weekNumber: number): RestPainLog[] {
  return getRestPainLogs().filter(
    (l) => l.programId === programId && l.weekNumber === weekNumber,
  );
}

/** Janela por data (`YYYY-MM-DD`), inclusiva nas duas pontas. */
export function listRestPainByRange(from: string, to: string): RestPainLog[] {
  return getRestPainLogs().filter((l) => l.date >= from && l.date <= to);
}
