import type {
  BlockType,
  DayType,
  PainRegion,
  PercentRef,
  PlanAdherence,
  PainNature,
  RestPainContext,
  SquatDepth,
  StrengthPerception,
} from '../../types';
import type { GateReading, GateWeekObservation } from '../../domain/painGate';

/**
 * Versão da forma dos documentos de rollup. Bumpar exige reenviar tudo.
 *
 * 2 — `WeekDoc.gate`: o histórico do gate de dor de peitoral (§1.2), que a
 *     janela de SESSÕES da tabela exige atravessar a virada de semana. O campo é
 *     **opcional** e todo consumidor tolera a ausência: documento gravado na
 *     versão 1 continua carregando e o gate degrada para o comportamento antigo
 *     (janela truncada na semana, retorno indisponível) em vez de quebrar.
 *     Nenhum campo foi removido e nenhuma migração destrutiva é necessária.
 *
 * 3 — `gate.weeks[].fullyLoggedSessions`: quantas sessões de supino da semana
 *     colheram pré **E** pós. Opcional e sem migração destrutiva, mas a versão
 *     sobe porque MUDA leitura: documento gravado na versão 2 não tem o campo, e
 *     a ausência é lida como zero, o que BLOQUEIA o `RETORNO` em vez de
 *     liberá-lo. É a direção segura, e é a única razão de não bastar acrescentar
 *     campo em silêncio: reenviar as semanas antigas as reconstrói com o campo.
 *
 * `WeekDoc.restPain` (13/08/2026) entrou SEM bumpar a versão, e isso é
 * deliberado: o campo é opcional, puramente aditivo, e a ausência dele é lida
 * como "nenhum registro fora de sessão" — que é exatamente o comportamento de
 * antes de ele existir. Não há leitura que mude de sentido em documento antigo,
 * então não há o que reenviar. O que ele NÃO faz é o motivo de caber aqui: dor
 * fora de sessão não entra em `buildGateReadings`, não consome a janela de 3
 * sessões, não dispara degrau e não entra no `RETORNO`. O desenho está em
 * `research/kb/PEITO-PARECER.md` §8.2.
 */
export const ROLLUP_SCHEMA_VERSION = 3;

/** Levantamento de referência, com uma gaveta para tudo que não é SBD/OHP. */
export type LiftKey = PercentRef | 'other';

export type LiftTotals = Record<LiftKey, number>;

export interface TopSetRef {
  exerciseId: string;
  name: string;
  weight: number;
  reps: number;
  rpe: number;
  e1rm: number;
  isPR?: boolean;
  date?: string;
}

/** Execução medida contra a regra IPF, agregada. */
export interface ComplianceTotals {
  sets: number;
  judgedSets: number;
  reps: number;
  judgedReps: number;
  validReps: number;
  validRepPct: number | null;
  videos: number;
  /** Agachamento. */
  depth?: Record<SquatDepth, number>;
  /** Supino. */
  pausedSets?: number;
  avgPauseSec?: number | null;
  /** Terra. */
  deadStopSets?: number;
  strapSets?: number;
}

export interface ComplianceRollup extends ComplianceTotals {
  byLift: Partial<Record<PercentRef, ComplianceTotals>>;
  equipment: { belt: number; straps: number; kneeSleeves: number; wristWraps: number };
  bars: Record<string, number>;
  plates: Record<string, number>;
}

/** Desvio agregado de um exercício em relação ao que o programa prescreveu. */
export interface Deviation {
  exerciseId: string;
  name: string;
  sets: number;
  avgRepsDelta: number | null;
  avgRpeDelta: number | null;
  avgLoadDeltaPct: number | null;
  setsDelta: number;
}

export interface ExerciseSummary {
  exerciseId: string;
  name: string;
  skipped: boolean;
  prescribed: { sets: number; reps: string; rpe: string; percent1RM?: string };
  setsCompleted: number;
  tonnage: number;
  topSet: TopSetRef | null;
  avgRepsDelta: number | null;
  avgRpeDelta: number | null;
  avgLoadDeltaPct: number | null;
  compliance: ComplianceTotals;
  notes?: string;
}

/**
 * `acute` viaja junto da entrada de dor porque `sessionRollup` copia
 * `pre.painEntries` inteiro (`pain: pre.painEntries ?? []`) e `buildGateReadings`
 * lê `p.acute` para satisfazer o degrau `≥4/10 **ou estiramento agudo**`. Até
 * esta revisão os dois tipos aqui declaravam só `{ region, intensity }`, então o
 * campo trafegava em runtime e o tipo dizia que não existia — `tsc` reprovava a
 * leitura e o build ficava vermelho depois do `check:gate`. Opcional: registro
 * gravado antes disso não tem o campo, e ausência é `false`, nunca "não sei".
 *
 * ⚠️ O campo continua SEM ESCRITOR na interface: não há toggle no `PainSelector`.
 * A célula do estiramento agudo tem leitor e não tem porta de entrada — está em
 * `research/kb/PEITO-PARECER.md` §7 e no `RUNBOOK.md` §8 como não resolvido.
 */
export interface PreSummary {
  sleepQuality: number;
  sleepHours: number;
  energyLevel: number;
  stressLevel: number;
  motivation: number;
  pain: { region: PainRegion; intensity: number; acute?: boolean; nature?: PainNature }[];
  supplements: { creatine: boolean; protein: boolean; preWorkoutMeal: boolean };
}

export interface PostSummary {
  sessionQuality: number;
  sessionRPE: number;
  strengthPerception: StrengthPerception;
  planAdherence: PlanAdherence;
  adherenceReason?: string;
  newPain: { region: PainRegion; intensity: number; acute?: boolean; nature?: PainNature }[];
  pumpRating?: number;
  notes?: string;
}

export interface SessionDoc {
  schemaVersion: number;
  updatedAt: string;
  id: string;
  date: string;
  programId: string;
  weekId: string;
  weekNumber: number;
  macrocycle: number;
  dayIndex: number;
  dayType: DayType;
  blockName: string;
  blockType: BlockType;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
  durationMin: number | null;
  setsPrescribed: number;
  setsCompleted: number;
  tonnage: number;
  tonnageByLift: LiftTotals;
  volumeByMuscle: Record<string, number>;
  exercises: ExerciseSummary[];
  compliance: ComplianceRollup;
  pre: PreSummary | null;
  post: PostSummary | null;
  notes?: string;
}

export interface WeekSessionRow {
  id: string;
  date: string;
  dayIndex: number;
  dayType: DayType;
  completed: boolean;
  setsPrescribed: number;
  setsCompleted: number;
  tonnage: number;
  sessionRPE: number | null;
  sessionQuality: number | null;
  strengthPerception: StrengthPerception | null;
  planAdherence: PlanAdherence | null;
  topSet: TopSetRef | null;
}

export interface SurveyAverages {
  sleepQuality: number;
  sleepHours: number;
  energyLevel: number;
  stressLevel: number;
  motivation: number;
  sessionQuality: number;
  sessionRPE: number;
  pumpRating: number;
}

export interface WeekDoc {
  schemaVersion: number;
  updatedAt: string;
  weekId: string;
  programId: string;
  programName: string;
  weekNumber: number;
  macrocycle: number;
  blockName: string;
  blockType: BlockType;
  isDeload: boolean;
  weekLabel?: string;
  firstDate: string | null;
  lastDate: string | null;

  adherence: {
    sessionsPrescribed: number;
    sessionsCompleted: number;
    setsPrescribed: number;
    setsCompleted: number;
    setsSkipped: number;
    completionPct: number;
    exercisesSkipped: { exerciseId: string; name: string; sessions: number }[];
    planAdherence: Record<PlanAdherence, number>;
  };

  tonnage: { total: number; byLift: LiftTotals; byExercise: Record<string, number> };

  volumeByMuscle: {
    actual: Record<string, number>;
    prescribed: Record<string, number>;
    delta: Record<string, number>;
  };

  topE1rm: Record<string, TopSetRef & { deltaPrevWeek: number | null }>;

  surveys: {
    n: number;
    averages: SurveyAverages;
    deltaPrevWeek: Partial<SurveyAverages>;
    readinessScore: number;
    sRPELoad: number;
    strengthPerception: Record<StrengthPerception, number>;
  };

  pain: {
    region: PainRegion;
    occurrences: number;
    maxIntensity: number;
    avgIntensity: number;
    source: 'pre' | 'post' | 'both';
  }[];

  compliance: ComplianceRollup;

  bodyweight: {
    n: number;
    start: number | null;
    end: number | null;
    avg: number | null;
    deltaKg: number | null;
    dotsStart: number | null;
    dotsEnd: number | null;
    dotsDelta: number | null;
  };

  deviations: Deviation[];
  sessions: WeekSessionRow[];
  notes: { date: string; dayType: DayType; exerciseName?: string; text: string }[];
  flags: string[];

  /**
   * Memória do gate de dor de peitoral (`PROGRAMA.md §1.2`).
   *
   * Existe porque a janela da tabela é de **sessões de supino** e não cabe numa
   * semana: com supino 4×/semana, cerca de 1 em cada 4 pares de eventos
   * qualificados cai dos dois lados da fronteira, e sem esta memória o degrau de
   * recuo nunca saía. É também o que torna a linha `RETORNO` implementável — ela
   * fala de semanas consecutivas, e uma semana sozinha não sabe o que foi a
   * anterior.
   *
   * OPCIONAL de propósito: documento gravado antes de
   * `ROLLUP_SCHEMA_VERSION = 2` não tem o campo. `buildWeekDoc` trata a ausência
   * como "sem histórico" e produz exatamente o comportamento anterior, sem
   * migração e sem quebrar leitura.
   */
  gate?: WeekGate;

  /**
   * Dor colhida FORA de sessão (`RestPainLog`).
   *
   * Fica num campo PRÓPRIO, e não dentro de `pain` nem de `gate`, porque a
   * separação é o desenho inteiro: `pain` agrega o que foi colhido dentro de
   * treino e `gate` é a memória da tabela do §1.2, que fala de pico dentro de
   * sessão de supino. Misturar as duas coisas faria um dia parado consumir vaga
   * da janela de 3 sessões e disparar degrau — regra que o programa não escreve.
   *
   * Opcional: semana sem registro nenhum não carrega o campo, e documento
   * gravado antes desta revisão também não. Nos dois casos a leitura é a mesma —
   * nada a anunciar.
   */
  restPain?: WeekRestPain;
}

/**
 * O que a semana viu de dor fora de sessão. Fatos, nenhum veredito — igual ao
 * `WeekGate`, e pelo mesmo motivo: quem decide é a conversa semanal com a tabela
 * na mão, e aqui não há tabela para consultar.
 */
export interface WeekRestPain {
  /** Registros da semana (um por dia e contexto). */
  n: number;
  /**
   * Por momento do dia. Os três contextos aparecem sempre, inclusive zerados: a
   * ausência de dor ao acordar numa semana em que houve dor em repouso é um
   * fato, e ele se perde se a gaveta vazia sumir do documento.
   */
  byContext: Record<RestPainContext, { n: number; maxIntensity: number }>;
  /** Uma linha por região registrada, da mais frequente para a menos. */
  peakByRegion: { region: PainRegion; occurrences: number; maxIntensity: number }[];
  /**
   * Contagem por TECIDO, e o `null` é a gaveta que mais importa.
   *
   * Sem esta linha, o documento semanal diz "coxa 4/10, 3 registros" e a
   * conversa não tem como separar dor muscular tardia de tendinite — as duas
   * pedem condutas opostas e cabem no mesmo número. `null` conta o que NÃO foi
   * classificado, e ele é diferente de `nao_sei`: um é ausência de resposta, o
   * outro é a resposta "não sei". Colapsá-los esconderia quanto do log está
   * sendo preenchido pela metade.
   */
  byNature: { nature: PainNature | null; occurrences: number; maxIntensity: number }[];
  /**
   * Maior `sinceDays` registrado na semana, ou `null` se ninguém informou.
   *
   * É o sinal de cronicidade: dor de treino tem prazo, e a que atravessa
   * semanas parada não é mais dor de treino.
   */
  maxSinceDays: number | null;
}

/**
 * Só observação, nenhum veredito e nenhum limiar.
 *
 * O que o documento guarda é o que foi medido; o que decide continua sendo a
 * tabela do §1.2, lida a cada avaliação. Se o veredito fosse gravado aqui,
 * mudar o número no markdown deixaria de mudar o app para todo documento já
 * gravado — que é exatamente a divergência silenciosa que este gate existe para
 * não repetir.
 */
export interface WeekGate {
  /** Leituras desta semana, uma por sessão de supino que colheu o log. */
  readings: GateReading[];
  /**
   * Cauda das semanas anteriores que a janela de sessões ainda alcança.
   * Limitada a `gateWindowSessions - 1` leituras: é o máximo que a maior janela
   * da tabela pode precisar, e mantém o documento com tamanho limitado.
   */
  carry: GateReading[];
  /**
   * Semanas recentes resumidas, da mais antiga para a mais recente (a última é
   * esta semana). Limitada às `PAIN_GATE.retorno.semanas` que a tabela exige.
   */
  weeks: GateWeekObservation[];
}
