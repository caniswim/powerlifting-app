import type { AthleteProfile, PercentRef, TrainingMax } from '../types';

/**
 * Re-ancoragem contínua do `trainingMax` pelo GAUGE SET.
 *
 * Isto existia só em prosa. `PROGRAMA.md` §1.1 e §11-A2 descrevem o acumulador,
 * o `K`, o teto de `tm_inicial × 1,10` e as portas de invalidação, e nenhuma
 * linha disso existia em `src/` — as três semanas de calibração mediam algo que
 * o produto não consumia, e com o `trainingMax` parado bastava o agacho real
 * chegar a 231 kg para a back-off da S16 (185 kg) cair abaixo de 80% do real e a
 * dose de força ir de 5 séries para 1.
 *
 * Tudo aqui é FUNÇÃO PURA: a decisão é auditável, testável e não depende de
 * storage. Quem persiste é o chamador.
 *
 * REGRAS, na ordem em que §1.1 as avalia:
 *   1. PORTAS, antes de qualquer ajuste.
 *   2. Primeira leitura do bloco: vira linha de base, não move nada.
 *   3. Queda de ≥2 pontos de RPE em relação à leitura anterior: corta a sessão.
 *   4. Queda de ≥1 ponto na PRIMEIRA vez: segura a carga uma semana, sem baixar
 *      o TM. Duas leituras consecutivas em queda: baixa por `K`.
 *   5. `acumulador += (rpe_anterior − rpe_hoje)`; com `acumulador ≥ 1,0`, o
 *      ganho é `min(acumulador × K, 5%)`, limitado por `tm_inicial × 1,10`, e
 *      vale para a SEMANA SEGUINTE.
 */

/**
 * `K` — quanto vale 1 ponto de RPE em percentual de carga.
 *
 * ⚠️ `[R33 @00:32]` `[R50 @02:06]`, as duas **[PESSOAL]**: "1 RPE equivale a
 * cerca de 2 a 3%; para ele fica na ponta alta, 3%, em agacho e terra" — e a
 * ponta alta é a DELE, num agachador/terrista de 800 lb.
 * ⚠️ `[interpretação]`: 2,0% para supino é a ponta baixa da faixa genérica; a
 * base NÃO dá número para supino.
 */
export const GAUGE_K: Record<PercentRef, number> = {
  squat: 0.03,
  deadlift: 0.03,
  bench: 0.02,
  ohp: 0.02,
};

/** Acumulador mínimo para que a leitura vire quilo. */
export const GAUGE_ACC_THRESHOLD = 1.0;
/** Teto de ganho por aplicação: `min(acumulador × K, 5%)`. */
export const GAUGE_MAX_GAIN_PCT = 0.05;
/** Teto absoluto do bloco: `tm_inicial × 1,10` (§1.1). */
export const GAUGE_TM_CEILING_FACTOR = 1.1;
/** Queda de RPE que corta a sessão em vez de ajustar carga `[R10 @00:34]`. */
export const GAUGE_SESSION_CUT_DROP = 2;

/**
 * Portas de invalidação. Todas são avaliadas ANTES de qualquer ajuste e nenhuma
 * delas é "o atleta achou que foi ruim": são condições objetivas.
 */
export type GaugeInvalidation =
  /** Série encerrada por falha de PEGADA e não por esforço de tração (terra).
   *  Descarta nos dois sentidos: um instrumento limitado por outra coisa não
   *  mede. ⚠️ Regra `[interpretação]` do desenho; o que a base dá é o fato que
   *  a motiva — `[R42 @00:02]` **[PESSOAL]**. */
  | 'falha_de_pegada'
  /** Qualquer rep fora do padrão legal. PROÍBE SUBIDA, permite descida
   *  `[R115]`. */
  | 'rep_fora_do_padrao'
  /** Alguma coluna do eixo `exposicao_peito` subiu na semana (SUP-V1, SUP-V4,
   *  PAUSA-P, PEC-SETS, FP-SETS, FP4-SETS). Torna a leitura de supino INVÁLIDA
   *  PARA SUBIR. */
  | 'degrau_de_exposicao_de_peito';

export interface GaugeState {
  /** Soma de `(rpe_anterior − rpe_hoje)` desde a última aplicação. */
  acumulador: number;
  /** RPE da leitura anterior do MESMO gauge. Ausente = primeira leitura. */
  rpeAnterior?: number;
  /** Quantas leituras consecutivas vieram em queda de ≥1 ponto. */
  quedasConsecutivas: number;
}

export const GAUGE_STATE_ZERO: GaugeState = { acumulador: 0, quedasConsecutivas: 0 };

export type GaugeAction =
  | 'linha_de_base'
  | 'descartada'
  | 'sem_mudanca'
  | 'segurou'
  | 'subiu'
  | 'baixou'
  | 'sessao_cortada';

export interface GaugeOutcome {
  action: GaugeAction;
  /** `trainingMax` a aplicar na SEMANA SEGUINTE. */
  trainingMax: number;
  /** Novo estado do acumulador, para persistir. */
  state: GaugeState;
  /** Por que a decisão foi essa — vai para o log e para a conversa semanal. */
  motivo: string;
}

/** `min(acumulador × K, 5%)`, já limitado pelo teto de `tm_inicial × 1,10`. */
export function ganhoDeReancoragem(
  lift: PercentRef,
  acumulador: number,
  trainingMax: number,
  trainingMaxInicial: number,
): number {
  const bruto = Math.min(acumulador * GAUGE_K[lift], GAUGE_MAX_GAIN_PCT);
  const teto = trainingMaxInicial * GAUGE_TM_CEILING_FACTOR;
  return Math.min(trainingMax * (1 + bruto), teto);
}

export interface GaugeReading {
  /** RPE OBSERVADO no gauge. Não é alvo nem teto: é a leitura (§0.1). */
  rpe: number;
  /** Portas disparadas nesta leitura. */
  invalidations?: readonly GaugeInvalidation[];
}

/**
 * Aplica uma leitura de gauge e devolve o `trainingMax` da semana seguinte.
 *
 * `trainingMaxInicial` é o gravado pelo gate da semana 4 e NÃO muda durante o
 * bloco — é o denominador do teto de 1,10.
 */
export function applyGaugeReading(
  lift: PercentRef,
  trainingMax: number,
  trainingMaxInicial: number,
  state: GaugeState,
  reading: GaugeReading,
): GaugeOutcome {
  const invalidations = reading.invalidations ?? [];
  const keep = (action: GaugeAction, motivo: string, next: GaugeState = state): GaugeOutcome =>
    ({ action, trainingMax, state: next, motivo });

  // 1. PORTAS — avaliadas antes de qualquer ajuste.
  if (invalidations.includes('falha_de_pegada')) {
    // Descartada nos DOIS sentidos: nem sobe, nem desce, e nem atualiza a
    // referência — senão a próxima leitura seria comparada contra um número que
    // mediu pegada, não força.
    return keep('descartada', 'leitura encerrada por falha de pegada: inválida nos dois sentidos (§1.1)');
  }
  const proibeSubir = invalidations.includes('rep_fora_do_padrao')
    || invalidations.includes('degrau_de_exposicao_de_peito');

  // 2. Primeira leitura do bloco (ou logo após uma re-ancoragem): linha de base.
  if (state.rpeAnterior === undefined) {
    return keep('linha_de_base', 'primeira leitura: vira referência, não move o trainingMax', {
      ...state,
      rpeAnterior: reading.rpe,
    });
  }

  const delta = state.rpeAnterior - reading.rpe; // >0 = ficou mais fácil
  const proximoRpe = { ...state, rpeAnterior: reading.rpe };

  // 3. Queda de ≥2 pontos (leitura MUITO mais dura): corta a sessão.
  if (-delta >= GAUGE_SESSION_CUT_DROP) {
    return keep('sessao_cortada',
      `RPE subiu ${-delta} pontos contra a leitura anterior: encerre a sessão [R10 @00:34]`,
      { ...proximoRpe, acumulador: 0, quedasConsecutivas: state.quedasConsecutivas + 1 });
  }

  // 4. Ficou mais duro em ≥1 ponto.
  if (-delta >= 1) {
    const quedas = state.quedasConsecutivas + 1;
    if (quedas < 2) {
      // Um treino mais duro não é tendência `[R1 @01:04]` `[R27 @05:38]`.
      return keep('segurou',
        'primeira leitura em queda: segura a carga uma semana, sem baixar o trainingMax (§1.1)',
        { ...proximoRpe, acumulador: 0, quedasConsecutivas: quedas });
    }
    return {
      action: 'baixou',
      trainingMax: trainingMax * (1 - GAUGE_K[lift]),
      state: { ...proximoRpe, acumulador: 0, quedasConsecutivas: quedas },
      motivo: 'duas leituras consecutivas em queda: baixa por K (§1.1)',
    };
  }

  // 5. Acumulador. A regra literal de R1 não dispara no caso que a motivou
  //    (+6,9 kg diluídos em 10 semanas dão 0,13 ponto/semana), e é por isso que
  //    o ganho é acumulado em vez de exigido semana a semana.
  const acumulador = state.acumulador + delta;
  const base: GaugeState = { ...proximoRpe, acumulador, quedasConsecutivas: 0 };

  if (acumulador < GAUGE_ACC_THRESHOLD) {
    return keep('sem_mudanca', `acumulador em ${acumulador.toFixed(2)}, abaixo de ${GAUGE_ACC_THRESHOLD}`, base);
  }
  if (proibeSubir) {
    // O acumulador NÃO é zerado: a adaptação existe, só não pode ser cobrada
    // numa semana em que outra variável se moveu.
    return keep('sem_mudanca',
      'acumulador atingido, mas a leitura é inválida para SUBIR (rep fora do padrão ou degrau de exposição de peitoral)',
      base);
  }

  const novo = ganhoDeReancoragem(lift, acumulador, trainingMax, trainingMaxInicial);
  if (novo <= trainingMax + 1e-9) {
    return keep('sem_mudanca', `teto de tm_inicial × ${GAUGE_TM_CEILING_FACTOR} alcançado`, base);
  }
  return {
    action: 'subiu',
    trainingMax: novo,
    // Ao re-ancorar, a referência RESETA e a semana seguinte é linha de base
    // (é o que a nota do gauge de terra já prescrevia em prosa).
    state: { acumulador: 0, quedasConsecutivas: 0 },
    motivo: `acumulador ${acumulador.toFixed(2)} × K ${GAUGE_K[lift]} → trainingMax ${novo.toFixed(1)} kg na semana seguinte`,
  };
}

/**
 * Gate S3→S4: grava a MEDIANA das três âncoras (nunca a maior), marca a origem
 * como `calibrado` e fixa `trainingMaxInicialBloco`, que é o denominador do teto
 * de 1,10 pelo resto do bloco.
 *
 * ⚠️ Âncora colhida em rep fora do padrão legal é DESCARTADA antes de entrar
 * aqui — a mesma porta do gauge e da regra de R115. É responsabilidade do
 * chamador não passar uma âncora inválida; com menos de três âncoras válidas o
 * gate não fecha e a semana é repetida.
 */
export function medianaDeAncoras(ancoras: readonly number[]): number | null {
  const validas = ancoras.filter((a) => Number.isFinite(a) && a > 0).sort((a, b) => a - b);
  if (validas.length < 3) return null;
  return validas[Math.floor(validas.length / 2)];
}

export function gravarGateSemana4(
  profile: AthleteProfile,
  ancorasPorLevantamento: Partial<Record<PercentRef, readonly number[]>>,
): AthleteProfile | null {
  const trainingMax: TrainingMax = { ...profile.trainingMax };
  for (const [ref, ancoras] of Object.entries(ancorasPorLevantamento) as [PercentRef, number[]][]) {
    const mediana = medianaDeAncoras(ancoras);
    if (mediana === null) return null; // gate não fecha: repita a semana
    trainingMax[ref] = mediana;
  }
  return {
    ...profile,
    trainingMax,
    trainingMaxOrigin: 'calibrado',
    trainingMaxInicialBloco: { ...trainingMax },
  };
}
