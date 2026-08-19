import type { WorkoutLog } from '../types';

/**
 * Quando o treino ACONTECEU — a pergunta que o log não sabia responder.
 *
 * O campo `date` de `WorkoutLog` é carimbado na CRIAÇÃO do log
 * (`useWorkoutSession.createWorkoutFromPlan`), e criar não é treinar. Quem abre
 * a sessão de manhã, não treina, e volta a ela no dia seguinte à noite produz um
 * log cuja `date` está um dia inteiro à frente do esforço. Aconteceu em
 * 16–17/08/2026: sessão aberta 16/08 10:48, séries registradas 17/08 18:51–20:03,
 * e todo consumidor que lia `date` afirmava 16/08.
 *
 * O estrago não era o cálculo de descanso — esse já lia `completedAt` e estava
 * certo. Era pior: o histórico de exercício datava a carga pelo dia da abertura,
 * e a duração da sessão saía como `completedAt - startedAt`, que para aquela
 * sessão dá **33 horas**. Quatro das sete sessões do bloco 1 produziram duração
 * acima de 13 h por esse caminho, e elas alimentam os rollups do Firestore.
 *
 * Este módulo é a fonte única da resposta, e ela degrada em ordem explícita:
 * primeira série carimbada → PR dentro da janela da sessão → `completedAt` →
 * `date`. Log gravado antes de as séries carimbarem hora cai no segundo ou no
 * terceiro degrau; nada aqui inventa precisão que o dado não tem.
 */
export interface WorkoutInstants {
  /** Instante da primeira série registrada, ou `null` se nenhuma tem carimbo. */
  firstSetAt: string | null;
  /** Instante da última série registrada, ou `null`. */
  lastSetAt: string | null;
  /**
   * Instante canônico do treino, ISO 8601.
   *
   * Nunca é `null`: o último degrau é `date`, que todo log tem.
   */
  trainedAt: string;
  /** `YYYY-MM-DD` LOCAL do `trainedAt`. É a data que a UI deve exibir. */
  trainedOn: string;
  /**
   * Duração real, em minutos, medida de primeira a última série.
   *
   * `null` quando não há carimbo suficiente — e `null` é o ponto: é honesto, e
   * `completedAt - startedAt` não era. Um número errado num rollup é pior que
   * um campo ausente, porque ninguém desconfia dele.
   */
  durationMin: number | null;
  /**
   * A abertura da sessão caiu num dia LOCAL diferente do primeiro esforço.
   *
   * É o sintoma exato da sessão esquecida aberta. Quem consome isto deve
   * PERGUNTAR, não corrigir sozinho: o app não sabe se o atleta abriu na véspera
   * e treinou no dia seguinte, ou se treinou virando a madrugada.
   */
  openedOnDifferentDay: boolean;
}

/** `YYYY-MM-DD` no fuso LOCAL, a partir de um instante ISO. */
export function localDayOf(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Instantes de todas as séries COMPLETADAS que carregam carimbo, em ordem.
 *
 * Série sem `completedAt` é ignorada em vez de receber um instante inventado:
 * a ausência é de log antigo, e preencher com a data da sessão devolveria
 * exatamente o erro que este módulo existe para corrigir.
 */
function setInstants(workout: WorkoutLog): string[] {
  const out: string[] = [];
  for (const ex of workout.exercises ?? []) {
    for (const s of ex.sets ?? []) {
      if (s.completed && s.completedAt) out.push(s.completedAt);
    }
  }
  return out.sort();
}

/**
 * Carimbo de PR que caiu DENTRO da janela desta sessão.
 *
 * É a testemunha que sobrou do período em que as séries não guardavam hora: o
 * registro de recorde sempre carimbou instante real. Não cobre tudo — `records`
 * guarda só o melhor de cada exercício, e um PR superado depois some —, mas
 * quando existe é verdade de terra, e medi-lo contra os dados reais deste atleta
 * mostrou por que ele importa: sem este degrau, a degradação para `completedAt`
 * ERRAVA 2 das 6 sessões em que a verdade é conhecida (a de 12/08, treinada no
 * dia 12 e encerrada na manhã do 13, e a de 14/08, encerrada na manhã do 15).
 *
 * O filtro pela janela `[startedAt, completedAt]` é o que impede um PR de outra
 * sessão do mesmo exercício de ser adotado como hora desta.
 */
function prInstants(
  workout: WorkoutLog,
  records: readonly { exerciseId: string; date: string }[],
): string[] {
  const ids = new Set((workout.exercises ?? []).map((e) => e.exerciseId));
  const from = new Date(workout.startedAt ?? workout.date).getTime();
  const to = workout.completedAt ? new Date(workout.completedAt).getTime() : Infinity;
  return records
    .filter((r) => ids.has(r.exerciseId))
    .filter((r) => {
      const t = new Date(r.date).getTime();
      return t >= from && t <= to;
    })
    .map((r) => r.date)
    .sort();
}

export function workoutInstants(
  workout: WorkoutLog,
  records: readonly { exerciseId: string; date: string }[] = [],
): WorkoutInstants {
  const stamps = setInstants(workout);
  const prs = stamps.length > 0 ? [] : prInstants(workout, records);
  const firstSetAt = stamps.length > 0 ? stamps[0] : null;
  const lastSetAt = stamps.length > 0 ? stamps[stamps.length - 1] : null;

  // Ordem de degradação, do mais preciso ao menos: série carimbada → PR dentro
  // da janela → encerramento → abertura. Cada degrau é uma testemunha pior que
  // a anterior, e o último é o que já mentia.
  const trainedAt = firstSetAt ?? prs[0] ?? workout.completedAt ?? workout.date;

  const durationMin =
    firstSetAt && lastSetAt && lastSetAt !== firstSetAt
      ? Math.round((new Date(lastSetAt).getTime() - new Date(firstSetAt).getTime()) / 60000)
      : null;

  return {
    firstSetAt,
    lastSetAt,
    trainedAt,
    trainedOn: localDayOf(trainedAt),
    durationMin,
    openedOnDifferentDay:
      firstSetAt !== null && localDayOf(workout.startedAt ?? workout.date) !== localDayOf(firstSetAt),
  };
}

/** Atalho para o caso mais comum: a data local em que o treino aconteceu. */
export function workoutTrainedOn(
  workout: WorkoutLog,
  records: readonly { exerciseId: string; date: string }[] = [],
): string {
  return workoutInstants(workout, records).trainedOn;
}

/** Atalho para ordenação e comparação: o instante canônico do treino. */
export function workoutTrainedAt(
  workout: WorkoutLog,
  records: readonly { exerciseId: string; date: string }[] = [],
): string {
  return workoutInstants(workout, records).trainedAt;
}

/**
 * A sessão está aberta há tempo demais para que "hoje" ainda seja verdade.
 *
 * Serve à porta que faltava: uma sessão sem série nenhuma, aberta ontem, não
 * deve ser retomada em silêncio hoje — a `date` dela mente a partir do momento
 * em que o dia virou. O limiar é o DIA LOCAL e não um número de horas, porque é
 * o dia que o programa conta (`restDaysAfter`), e uma sessão aberta às 23h e
 * retomada às 7h cruza a fronteira que importa mesmo tendo 8 h de idade.
 */
export function isStaleOpenSession(workout: WorkoutLog, now: Date = new Date()): boolean {
  if (workout.completed) return false;
  const pad = (n: number) => String(n).padStart(2, '0');
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const opened = localDayOf(workout.startedAt ?? workout.date);
  const stamps = setInstants(workout);
  // Com séries registradas, o dia que vale é o da primeira — e se ELE já passou,
  // a sessão continua velha.
  const reference = stamps.length > 0 ? localDayOf(stamps[0]) : opened;
  return reference < today;
}
