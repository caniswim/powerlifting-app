/** Natureza de uma série dentro de um bloco de prescrição. */
export type SetType =
  | 'warmup'   // série de aquecimento (pirâmide) — não conta volume, PR nem e1RM
  | 'working'  // série de trabalho normal
  | 'top'      // top set / single pesado
  | 'backoff'  // série mais leve após a top set
  | 'amrap'    // as many reps as possible
  | 'dropset'  // série com redução de carga no meio
  | 'cluster'  // 21s, rest-pause e afins (múltiplos segmentos, mesma carga)
  | 'timed';   // isometria medida em segundos

/** Unidade em que a série é contada. */
export type RepUnit = 'reps' | 'seconds';

/** Levantamento de referência para prescrições em %1RM. */
export type PercentRef = 'squat' | 'bench' | 'deadlift' | 'ohp';

/**
 * Sub-parte de uma série: as duas fases de um dropset, os três blocos de um 21s,
 * os lados de um exercício unilateral, os clusters de um rest-pause.
 */
export interface PrescribedSegment {
  /** Rótulo curto exibido na UI: "1", "2", "Esq", "Dir", "Drop", "Topo". */
  label: string;
  /** Reps verbatim do markdown ("7", "15", "4", "AMRAP"). */
  reps: string;
  unit?: RepUnit;
  /** Redução de carga sugerida vs. o segmento anterior (0.3 = -30%). */
  loadDropPct?: number;
  note?: string;
}

/** Prescrição de UMA série. É o nível de fidelidade exigido pelo markdown. */
export interface PrescribedSet {
  setNumber: number;
  type: SetType;
  /** Reps verbatim do markdown: "4-6", "AMRAP", "7/7/7", "20-30 sec". */
  reps: string;
  unit: RepUnit;
  rpe?: string;
  /** %1RM verbatim: "82.5-87.5%". */
  percent1RM?: string;
  percentMin?: number;
  percentMax?: number;
  percentRef?: PercentRef;
  /** Incremento carregável ao materializar o %1RM. */
  roundToKg?: number;
  /** Direção do arredondamento — ver `ExercisePrescription.roundGuard`. */
  roundGuard?: 'floor' | 'ceiling' | 'nearest';
  /** Descanso após a série, em segundos (extremo inferior do range). 0 = emendar. */
  restSec?: number;
  /** Descanso verbatim: "3-4 MIN". */
  restLabel?: string;
  /** Série executada em cada lado. */
  perSide?: boolean;
  segments?: PrescribedSegment[];
  /** Só para aquecimento: fração da carga da primeira série de trabalho. */
  warmupFraction?: number;
  note?: string;
}

/** Sub-parte executada de uma série. */
export interface SetSegmentLog {
  label: string;
  weight: number;
  reps: number;
  seconds?: number;
}

// ---------------------------------------------------------------------------
// Padrão de competição (IPF)
//
// Peso × reps × RPE não diz se a repetição contaria numa plataforma. Para um
// programa mirando IPF, "250 no agachamento" é ambíguo sem saber a profundidade.
// Tudo aqui é OPCIONAL: séries gravadas antes desta versão simplesmente não têm
// `compliance`, e nenhum cálculo do app depende dela.
// ---------------------------------------------------------------------------

/** Profundidade atingida, julgada contra a regra IPF (quadril abaixo do joelho). */
export type SquatDepth =
  | 'above_parallel'   // falha o padrão
  | 'at_parallel'      // limítrofe — depende do referee
  | 'below_parallel'   // passa
  | 'unknown';

/**
 * Tipo de barra. Barra de academia com whip levanta menos peso do chão de uma
 * vez só do que a barra rígida da IPF — o histórico fica incomparável sem isso.
 */
export type BarType =
  | 'ipf_calibrated'   // barra homologada, rígida
  | 'stiff'            // rígida, não homologada
  | 'gym_barbell'      // barra comum de academia (whip)
  | 'deadlift_bar'     // barra de terra, whip alto
  | 'safety_squat'
  | 'trap'
  | 'smith'
  | 'other';

/**
 * Tipo de anilha. `thick_plastic` é a anilha grossa da academia dele: põe peso
 * mais para fora, aumenta o whip e faz as anilhas externas ainda tocarem o chão
 * enquanto a barra já flexionou — infla o terra em relação ao padrão calibrado.
 */
export type PlateType =
  | 'calibrated'       // anilha calibrada de competição
  | 'steel'
  | 'rubber_bumper'
  | 'thick_plastic'
  | 'other';

/** Equipamento de apoio usado na série. Strap é proibido em competição IPF. */
export interface SetEquipment {
  belt?: boolean;
  straps?: boolean;
  kneeSleeves?: boolean;
  wristWraps?: boolean;
}

export type VideoAngle = 'side' | 'front' | 'foot' | 'rear45' | 'other';

/** Ponteiro para o vídeo da série — o arquivo em si vive fora do app. */
export interface VideoRef {
  /** URL (nuvem) ou caminho relativo do arquivo. */
  url?: string;
  fileName?: string;
  angle?: VideoAngle;
  /** Offset dentro do arquivo, quando a sessão inteira está num vídeo só. */
  offsetSec?: number;
  note?: string;
}

export type ComplianceJudge = 'self' | 'video' | 'coach';

/** Execução de UMA série medida contra a regra de competição. */
export interface SetCompliance {
  /** Reps que passariam num referee IPF. `undefined` = não julgado. */
  validReps?: number;
  /** Agachamento. */
  depth?: SquatDepth;
  /** Supino: pausa real com a barra imóvel no peito (não reversão). */
  paused?: boolean;
  /** Duração média da pausa no peito, em segundos. */
  pauseSec?: number;
  /** Terra: cada rep partiu do chão morto, sem touch-and-go. */
  deadStop?: boolean;
  equipment?: SetEquipment;
  bar?: BarType;
  plates?: PlateType;
  video?: VideoRef;
  judgedBy?: ComplianceJudge;
  note?: string;
}

export interface SetLog {
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number;
  e1rm: number;
  completed: boolean;
  isPR: boolean;
  setType?: SetType;
  unit?: RepUnit;
  /** Duração executada, para séries isométricas. */
  durationSec?: number;
  perSide?: boolean;
  segments?: SetSegmentLog[];
  /** Snapshot da prescrição desta série específica. */
  prescribed?: PrescribedSet;
  /** Padrão de competição desta série. Opcional e retrocompatível. */
  compliance?: SetCompliance;
}

export interface ExercisePrescription {
  exerciseId: string;
  exerciseName: string;
  prescribedSets: number;
  prescribedReps: string;
  prescribedRPE: string;
  supersetGroup?: string;
  supersetOrder?: number;
  /** Identificador do bloco dentro do dia (um exercício pode repetir no mesmo dia). */
  blockId?: string;
  /** Rótulo verbatim do markdown, incluindo prefixo de superset e "[OR ...]". */
  rawLabel?: string;
  /** Notas prescritas pelo programa (distintas das notas do usuário). */
  prescribedNotes?: string;
  warmupSets?: number;
  restSec?: number;
  restLabel?: string;
  percent1RM?: string;
  percentRef?: PercentRef;
  /** Incremento carregável ao materializar o %1RM (2,5 kg com micro-anilhas). */
  roundToKg?: number;
  /**
   * Direção do arredondamento. Load-bearing: a TM 160, `nearest` põe o top set
   * do supino em 147,5 kg = 92,19% (viola o teto de 92%) e a back-off em
   * 127,5 = 79,69% (viola o piso de 80% de Pak). `floor` em série limitada por
   * teto, `ceiling` em série limitada por piso de faixa.
   */
  roundGuard?: 'floor' | 'ceiling' | 'nearest';
  /** Papel da série no desenho (forca, backoff, gauge, volume, pratica…). */
  role?: string;
  /** Grupo que esta linha credita como SÉRIE DIRETA (etiqueta autoral). */
  countsAs?: string;
  /** Duração mínima da pausa prescrita, em segundos (supino de competição). */
  pauseSec?: number;
  /** Descanso prescrito: piso e TETO da faixa. O orçamento lê o teto. */
  restSecMin?: number;
  restSecMax?: number;
  perSide?: boolean;
  optional?: boolean;
  unit?: RepUnit;
  /** Variações permitidas, incluindo a padrão na primeira posição. */
  variations?: { exerciseId: string; name: string }[];
  /** Plano série a série, já materializado (aquecimentos + séries de trabalho). */
  setPlan?: PrescribedSet[];
}

export interface ExerciseLog extends ExercisePrescription {
  sets: SetLog[];
  notes?: string;
  skipped?: boolean;
}

export interface WorkoutLog {
  id: string;
  date: string;
  /** Programa a que este treino pertence. Ausente = programa legado de 52 semanas. */
  programId?: string;
  weekNumber: number;
  macrocycle: number;
  blockName: string;
  blockType: BlockType;
  dayType: DayType;
  /** Posição do dia dentro da semana — desambigua dias com o mesmo dayType. */
  dayIndex?: number;
  sessionIndex?: number;
  exercises: ExerciseLog[];
  notes?: string;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
}

export interface WorkoutSummary {
  id: string;
  date: string;
  weekNumber: number;
  macrocycle: number;
  blockName: string;
  blockType: BlockType;
  dayType: DayType;
  completed: boolean;
  completedAt?: string;
}

export interface WorkoutExercises {
  exercises: ReadonlyArray<{
    exerciseId: string;
    sets: ReadonlyArray<{ completed: boolean }>;
  }>;
}

export type BlockType = 'accumulation' | 'transmutation' | 'intensification' | 'realization' | 'deload';

export type DayType =
  // Programa legado de 52 semanas
  | 'squat_emphasis' | 'bench_emphasis' | 'deadlift_emphasis' | 'bench_volume' | 'arms_shoulders'
  // Powerbuilding Phase 2.0 — semanas ímpares (full body, 5 dias)
  | 'fb_strength' | 'fb_continued_a' | 'fb_hypertrophy' | 'fb_continued_b' | 'arms_hypertrophy'
  // Powerbuilding Phase 2.0 — semanas pares (upper/lower, 4 dias)
  | 'lower_body' | 'upper_body' | 'lower_body_continued' | 'upper_body_continued'
  // Bloco 1 "Ficar Legal" (vena-block1) — 5 dias/semana
  | 'vb_squat_force' | 'vb_bench_force' | 'vb_squat_volume' | 'vb_deadlift_force'
  | 'vb_squat_tertiary' | 'vb_taper' | 'vb_mock_meet';

export interface PersonalRecord {
  exerciseId: string;
  e1rm: number;
  weight: number;
  reps: number;
  rpe: number;
  date: string;
}

/**
 * Máximo técnico por levantamento: o maior peso movido SEM degradar a técnica
 * (Brett Gibbs, ≈92–94% do máximo real). Distinto do 1RM, que é a melhor marca
 * já feita em condição de academia. Quando presente, é ele que ancora os
 * percentuais prescritos. Ver `src/domain/referenceMax.ts`.
 */
export type TrainingMax = Partial<Record<PercentRef, number>>;

export interface AthleteProfile {
  /** Peso corporal atual. A série histórica está em `BodyweightEntry`. */
  bodyweight: number;
  squat1RM: number;
  bench1RM: number;
  deadlift1RM: number;
  /** Desenvolvimento militar — exigido pelas prescrições em %1RM do Powerbuilding 2.0. */
  ohp1RM?: number;
  total: number;
  dots: number;
  /**
   * Máximo em padrão de competição, opcional. Ausente = os percentuais caem no
   * 1RM e nada muda. Nunca entra no total nem no DOTS.
   */
  trainingMax?: TrainingMax;
  /**
   * Procedência do `trainingMax`. `seed` é o valor semeado pela migração a
   * partir de `baseline.md` §4 (215/160/240): serve para nunca prescrever
   * contra o 1RM de academia, mas **NÃO conta como máximo técnico definido** —
   * a trava de `trainingMaxGuard` o trata como ausente até o gate da semana 4
   * gravar a mediana das três âncoras de calibração. Sem esta distinção,
   * `missingTrainingMaxRefs` nunca disparava e nada forçava o gate S3→S4.
   */
  trainingMaxOrigin?: 'seed' | 'calibrado';
  /**
   * `trainingMax` gravado pelo gate da semana 4. É o denominador do teto de
   * re-ancoragem (`tm_inicial × 1,10`, PROGRAMA.md §1.1) e não muda durante o
   * bloco, mesmo quando `trainingMax` sobe.
   */
  trainingMaxInicialBloco?: TrainingMax;
}

/**
 * Peso corporal como série temporal. O DOTS ao longo do tempo é o árbitro
 * nutricional do bloco: se o peso cai e o DOTS sobe, a direção está certa.
 * Uma medição por dia — regravar a mesma data sobrescreve.
 */
export interface BodyweightEntry {
  /** Data local no formato YYYY-MM-DD. É a chave do registro. */
  date: string;
  weightKg: number;
  /** Total (S+B+D) vigente na data, usado para o DOTS do ponto. */
  total?: number;
  dots?: number;
  note?: string;
}

export interface WeeklyVolume {
  weekNumber: number;
  muscleGroups: Record<string, number>;
}

/**
 * Um bloco de prescrição = uma linha da tabela do programa.
 * O mesmo exercício pode aparecer em vários blocos no mesmo dia
 * (ex.: supino top set + back-off + série de reps altas).
 */
export interface PrescribedExercise {
  exerciseId: string;
  exerciseName: string;
  /** Séries de trabalho (não inclui aquecimento). */
  sets: number;
  reps: string;
  rpe: string;
  notes?: string;
  supersetGroup?: string;  // "A" | "B" | "C"
  supersetOrder?: number;  // 1 | 2 (A1, A2...)
  /** Chave estável do bloco dentro do dia. */
  blockId?: string;
  /** Rótulo verbatim do markdown. */
  rawLabel?: string;
  warmupSets?: number;
  restSec?: number;
  restLabel?: string;
  percent1RM?: string;
  percentMin?: number;
  percentMax?: number;
  percentRef?: PercentRef;
  /** Incremento carregável ao materializar o %1RM (2,5 kg com micro-anilhas). */
  roundToKg?: number;
  /** Direção do arredondamento — ver `ExercisePrescription.roundGuard`. */
  roundGuard?: 'floor' | 'ceiling' | 'nearest';
  /** Papel da série no desenho (forca, backoff, gauge, volume, pratica…). */
  role?: string;
  /** Grupo que esta linha credita como SÉRIE DIRETA (etiqueta autoral). */
  countsAs?: string;
  /** Duração mínima da pausa prescrita, em segundos. */
  pauseSec?: number;
  /** Descanso prescrito: piso e TETO da faixa. O orçamento lê o teto. */
  restSecMin?: number;
  restSecMax?: number;
  perSide?: boolean;
  optional?: boolean;
  /** Variações aceitas pelo programa ("Box Squat", "Nordic Ham Curl"). */
  alternatives?: string[];
  /** Ids das variações, na mesma ordem de `alternatives`. */
  alternativeIds?: string[];
  unit?: RepUnit;
  /** Plano série a série (aquecimentos + séries de trabalho). */
  setPlan?: PrescribedSet[];
}

export interface PrescribedDay {
  dayType: DayType;
  dayLabel: string;
  /** Posição do dia dentro da semana (0-based). */
  dayIndex?: number;
  /** Dias de descanso sugeridos após esta sessão. */
  restDaysAfter?: number;
  /** Texto de descanso verbatim do programa. */
  restNote?: string;
  exercises: PrescribedExercise[];
}

export interface PrescribedWeek {
  weekNumber: number;
  macrocycle: number;
  blockName: string;
  blockType: BlockType;
  blockObjective: string;
  isDeload: boolean;
  /** Rótulo verbatim do cabeçalho da semana, quando houver. */
  weekLabel?: string;
  days: PrescribedDay[];
}

/** Um programa de treino completo e selecionável. */
export interface TrainingProgram {
  id: string;
  name: string;
  author?: string;
  description: string;
  /** Procedência dos dados (arquivo markdown de origem, por exemplo). */
  source?: string;
  weeks: PrescribedWeek[];
}

/** Uma sessão do programa, já resolvida na ordem linear de execução. */
export interface ProgramSession {
  sessionIndex: number;
  weekNumber: number;
  dayIndex: number;
  week: PrescribedWeek;
  day: PrescribedDay;
}

export type MuscleGroup =
  | 'quads'
  | 'glúteos'
  | 'erectors'
  | 'hamstrings'
  | 'peito'
  | 'deltóide_anterior'
  | 'deltóide_posterior'
  | 'deltóide_lateral'
  | 'tríceps'
  | 'bíceps'
  | 'costas'
  | 'braquial'
  | 'panturrilha'
  | 'abdômen'
  | 'trapézio'
  | 'antebraço'
  | 'pescoço'
  | 'abdutores';

export type ExerciseMuscleMap = Record<string, Partial<Record<MuscleGroup, number>>>;

// Pain
/**
 * Regiões de dor.
 *
 * `left_chest`/`right_chest` são lateralizadas de propósito: o padrão do
 * enumerado já lateraliza tudo que é par (joelho, ombro, quadril, cotovelo,
 * punho) e uma lesão de peitoral é unilateral — saber o lado distingue recidiva
 * do lado lesionado de dor nova do outro lado, e é isso que a conversa semanal
 * precisa decidir. O GATE de `PROGRAMA.md §1.2`, porém, conta os dois lados como
 * UM tecido: ver `painGateGroup` em `src/domain/painGate.ts`.
 */
export type PainRegion =
  | 'left_chest' | 'right_chest'
  | 'lower_back' | 'upper_back'
  | 'left_knee' | 'right_knee'
  | 'left_shoulder' | 'right_shoulder'
  | 'left_hip' | 'right_hip'
  | 'left_elbow' | 'right_elbow'
  | 'left_wrist' | 'right_wrist'
  | 'neck' | 'other';

export interface PainEntry {
  region: PainRegion;
  intensity: number; // 1-10
}

// Pre-Workout Survey
export interface PreWorkoutSurvey {
  workoutId: string;
  date: string;
  sleepQuality: number;     // 1-10
  sleepHours: number;       // 0-14, step 0.5
  energyLevel: number;      // 1-10
  stressLevel: number;      // 1-10
  motivation: number;       // 1-10
  hasPain: boolean;
  painEntries: PainEntry[];
  supplements: {
    creatine: boolean;
    protein: boolean;
    preWorkoutMeal: boolean;
  };
  skipped: boolean;
}

// Post-Workout Survey
export type StrengthPerception = 'below' | 'normal' | 'above';
export type PlanAdherence = 'full' | 'partial' | 'none';

export interface PostWorkoutSurvey {
  workoutId: string;
  date: string;
  sessionQuality: number;     // 1-10
  sessionRPE: number;         // 1-10
  strengthPerception: StrengthPerception;
  planAdherence: PlanAdherence;
  adherenceReason?: string;
  hasNewPain: boolean;
  painEntries: PainEntry[];
  pumpRating?: number;        // 1-5
  notes?: string;
  skipped: boolean;
}
