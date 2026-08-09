import { VENA_BLOCK1_PAIN_GATE } from '../data/program/vena-block1/generated';
import type { MuscleGroup, PainRegion } from '../types';

/**
 * Gate de dor de peitoral — o lado do CÓDIGO de uma regra que mora no programa.
 *
 * Nenhum limiar é digitado neste arquivo. Todos vêm de `VENA_BLOCK1_PAIN_GATE`,
 * que o gerador lê da TABELA de `PROGRAMA.md §1.2`. Se a tabela mudar, este
 * módulo muda junto sem ninguém editá-lo; se alguém tentar editar o limiar aqui,
 * não há o que editar. `npm run check:gate` exercita o rollup real contra a
 * tabela e reprova o build na primeira divergência.
 *
 * O que este módulo NÃO decide: o que fazer. Ele só diz qual degrau da tabela
 * está satisfeito e devolve o texto da ação como o programa escreveu. A conversa
 * semanal age; o app não altera prescrição sozinho.
 */

export const PAIN_GATE = VENA_BLOCK1_PAIN_GATE;

/**
 * Regiões que o gate governa.
 *
 * Os dois lados entram porque o enumerado é lateralizado para o LOG (uma ruptura
 * de peitoral é unilateral e o lado importa), mas o gate conta os dois como um
 * tecido só: dois eventos de 2/10 em lados diferentes são dois eventos para a
 * tabela, não um de cada. Lateralizar o registro e agregar o gate é o que dá as
 * duas coisas ao mesmo tempo.
 *
 * ⚠️ `PROGRAMA.md §1.2` manda: *"dor referida na região do bíceps entra no log de
 * peitoral até prova em contrário"* `[R95 @03:10]`. Não existe região de bíceps
 * no enumerado justamente para não abrir uma gaveta que desvia o registro do
 * gate — a instrução aparece na UI, ao lado dos botões de peitoral.
 */
export const painGateChestRegions: readonly PainRegion[] = ['left_chest', 'right_chest'];

/**
 * Gaveta ambígua.
 *
 * Antes desta revisão não existia região de peitoral: uma fisgada no peito só
 * cabia em `other`. Todo registro histórico em `other` pode, portanto, ser
 * peitoral, e a gaveta não guarda texto livre para desambiguar. Enquanto isso
 * for verdade, `other` é avaliado no limiar do gate — com mensagem própria,
 * porque é suspeita, não evento confirmado. Errar para o lado de olhar demais
 * custa uma linha de bandeira; errar para o outro custa o peitoral.
 */
export const painGateAmbiguousRegions: readonly PainRegion[] = ['other'];

/**
 * Limiar do app para as regiões que o programa NÃO governa.
 *
 * Isto é heurística do aplicativo, não prescrição: não há tabela para joelho ou
 * lombar. Fica alto de propósito. Baixar o limiar global para 2/10 faria a
 * bandeira subir em quase toda semana de treino pesado, e bandeira que sempre
 * sobe é bandeira que ninguém lê — foi exatamente esse raciocínio que, aplicado
 * sem exceção, escondeu o peitoral atrás de 6/10.
 */
export const painFlagDefault = { occurrences: 3, maxIntensity: 6 } as const;

export type PainGateScope = 'peitoral' | 'ambiguo' | 'fora';

export function painGateScope(region: PainRegion): PainGateScope {
  if (painGateChestRegions.includes(region)) return 'peitoral';
  if (painGateAmbiguousRegions.includes(region)) return 'ambiguo';
  return 'fora';
}

/** Intensidade a partir da qual a região exige atenção nesta semana. */
export function painFlagThreshold(region: PainRegion): number {
  return painGateScope(region) === 'fora' ? painFlagDefault.maxIntensity : PAIN_GATE.limiarMinimo;
}

/**
 * Grupo muscular que define uma "sessão de supino" para o §1.2.
 *
 * A tabela conta a janela em SESSÕES DE SUPINO, e o §1.2 manda colher o log em
 * "toda sessão que contenha supino ou peitoral" — as duas frases descrevem o
 * mesmo conjunto de sessões. O rollup já sabe dizer quais são: `volumeByMuscle`
 * credita `peito` a partir do `muscleMap` do registro de exercícios, e é lá que
 * supino de competição, floor press, crucifixo e peck deck já estão declarados.
 * Usar a classificação que já existe é o oposto de inventar uma: nenhum
 * exercício é reclassificado aqui, e o dia que não carrega o peitoral não vira
 * sessão de supino por engano.
 */
export const painGateMuscle: MuscleGroup = 'peito';

/**
 * Uma leitura de peitoral por sessão de supino que colheu o log.
 *
 * `peak` é o maior valor dos momentos colhidos na sessão (o programa pede três:
 * pré-sessão, 1ª pausada com carga de trabalho, pós-sessão) somando os dois
 * lados, e é **0** quando a sessão colheu o log e não houve dor nenhuma — uma
 * sessão de supino limpa é uma sessão de supino, e tem de consumir a janela como
 * qualquer outra. Sessão que não tocou o peitoral não entra na lista: é assim
 * que uma semana de deload sem supino deixa de consumir a janela.
 *
 * `weekNumber` existe porque a lista atravessa a virada de semana: o `WeekDoc`
 * carrega a cauda das semanas anteriores, e sem a semana de origem não haveria
 * como deduplicar nem como dizer, na bandeira, que a janela cruzou a fronteira.
 */
export interface GateReading {
  date: string;
  weekNumber: number;
  peak: number;
}

/**
 * O que uma semana observou, sem nenhum veredito embutido.
 *
 * Só FATOS: quantas sessões carregaram o peitoral, quantas dessas colheram o
 * log, e qual foi o pico. Os limiares ficam na tabela do §1.2 — se o documento
 * gravado carregasse "semana limpa: sim", mudar o teto de retorno no markdown
 * não mudaria mais nada do que já foi gravado, e a tabela deixaria de ser a
 * fonte única.
 */
export interface GateWeekObservation {
  weekNumber: number;
  /** Sessões da semana que carregaram o peitoral. */
  benchSessions: number;
  /** Dessas, quantas colheram o log de dor. */
  loggedSessions: number;
  /** Maior pico colhido na semana; `null` quando não houve leitura nenhuma. */
  peak: number | null;
}

export interface GateVerdict {
  id: (typeof PAIN_GATE.degraus)[number]['id'];
  severidade: number;
  sinal: string;
  acao: string;
  limiar: number;
  eventosExigidos: number;
  janelaSessoes: number | null;
  /** Leituras que alcançaram o limiar do degrau disparado. */
  eventos: GateReading[];
  /** Maior intensidade observada nas leituras DESTA semana. */
  pico: number;
  /** A janela que disparou o degrau alcançou uma semana anterior. */
  atravessaSemana: boolean;
}

/** Maior janela de sessões declarada na tabela. Nenhum número digitado aqui. */
export const gateWindowSessions: number = Math.max(
  1,
  ...PAIN_GATE.degraus.map((d) => d.janelaSessoes ?? 1),
);

/**
 * Quantas semanas de rollup precisam ser reconstruídas antes da semana corrente
 * para que o gate tenha o histórico que a tabela exige.
 *
 * Derivado da tabela nas duas pontas: a janela de sessões (que atravessa a
 * virada de semana) e a contagem de semanas do `RETORNO`. Converter sessões em
 * semanas é uma sobre-estimativa deliberada — o programa prescreve 4 sessões de
 * supino por semana, então uma janela de 3 sessões nunca alcança 3 semanas
 * atrás; sobrar semana é barato, faltar semana é o defeito que este código
 * conserta.
 */
export const gateLookbackWeeks: number = Math.max(
  gateWindowSessions,
  PAIN_GATE.retorno.semanas,
);

/**
 * Avalia as leituras contra a tabela e devolve o degrau MAIS GRAVE satisfeito,
 * ou `null`. Os degraus já vêm ordenados por severidade decrescente do gerador,
 * então o primeiro que dispara é o que vale.
 *
 * `anteriores` são as leituras das semanas passadas que a janela ainda alcança.
 * Elas entram **só** nos degraus que declaram janela (`em N sessões`): a semana
 * do calendário não é unidade nenhuma para a tabela, e truncar a janela na
 * virada de semana escondia cerca de 1 em cada 4 pares qualificados com supino
 * 4×/semana. Degrau sem janela declarada continua sendo lido sobre a semana
 * corrente — dar memória a ele seria inventar uma duração que a tabela não
 * escreve.
 *
 * Um degrau com janela só dispara se **pelo menos um dos eventos for desta
 * semana**. Sem isso, o mesmo par de eventos voltaria a ser anunciado em toda
 * semana seguinte enquanto a cauda o alcançasse.
 */
export function evaluatePainGate(
  readings: readonly GateReading[],
  anteriores: readonly GateReading[] = [],
): GateVerdict | null {
  if (readings.length === 0) return null;
  const byDate = (a: GateReading, b: GateReading) => a.date.localeCompare(b.date);
  const atuais = [...readings].sort(byDate);
  const pico = Math.max(...atuais.map((r) => r.peak));

  const serie = [
    ...[...anteriores].sort(byDate).map((r) => ({ r, atual: false })),
    ...atuais.map((r) => ({ r, atual: true })),
  ];

  for (const degrau of PAIN_GATE.degraus) {
    let eventos: { r: GateReading; atual: boolean }[] | null = null;

    if (degrau.janelaSessoes === null) {
      const hits = serie.filter((s) => s.atual && s.r.peak >= degrau.limiar);
      if (hits.length >= degrau.eventos) eventos = hits.slice(0, degrau.eventos);
    } else {
      // Janela deslizante sobre as sessões de supino colhidas, não sobre dias
      // nem sobre semanas.
      for (let i = 0; i + degrau.janelaSessoes <= serie.length; i += 1) {
        const janela = serie.slice(i, i + degrau.janelaSessoes)
          .filter((s) => s.r.peak >= degrau.limiar);
        if (janela.length >= degrau.eventos && janela.some((s) => s.atual)) {
          eventos = janela;
          break;
        }
      }
      // Menos sessões colhidas que o tamanho da janela: a janela inteira ainda
      // cabe no futuro, então avalia o que existe em vez de ignorar o sinal.
      if (!eventos && serie.length < degrau.janelaSessoes) {
        const hits = serie.filter((s) => s.r.peak >= degrau.limiar);
        if (hits.length >= degrau.eventos && hits.some((s) => s.atual)) eventos = hits;
      }
    }
    if (!eventos) continue;

    return {
      id: degrau.id,
      severidade: degrau.severidade,
      sinal: degrau.sinal,
      acao: degrau.acao,
      limiar: degrau.limiar,
      eventosExigidos: degrau.eventos,
      janelaSessoes: degrau.janelaSessoes,
      eventos: eventos.map((s) => s.r),
      pico,
      atravessaSemana: eventos.some((s) => !s.atual),
    };
  }
  return null;
}

/** Linha de bandeira do gate, com o texto da ação como o programa a escreveu. */
export function describePainGate(v: GateVerdict): string {
  const quando = v.eventos.map((e) => e.date).join(', ');
  const cruzou = v.atravessaSemana ? ' — a janela atravessa a virada de semana' : '';
  return `GATE DE PEITORAL ${PAIN_GATE.secao} — ${v.sinal} (pico ${v.pico}/10, ${v.eventos.length}× em ${quando}${cruzou}): ${v.acao}`;
}

// ---------------------------------------------------------------------------
// RETORNO — a linha da tabela que era lida e não era consumida
// ---------------------------------------------------------------------------

export interface GateReturnVerdict {
  /** As `semanas` exigidas pela tabela foram cumpridas. */
  elegivel: boolean;
  semanasExigidas: number;
  picoMaximo: number;
  /** Semanas limpas consecutivas terminando na semana corrente. */
  semanasLimpas: number;
  sinal: string;
  acao: string;
  /**
   * Semanas dentro da janela do retorno que tiveram supino e **não** colheram o
   * log em toda sessão. Não são limpas — não porque houve dor, mas porque não
   * há como afirmar que não houve.
   */
  semanasSemLog: number[];
}

/**
 * Uma semana só é limpa quando houve exposição, todo o log foi colhido e o pico
 * ficou dentro do teto da tabela.
 *
 * As três condições são a leitura literal de *"pico ≤N/10 em todas as sessões de
 * supino"*, e cada uma corresponde a um jeito de a frase ser falsa. Semana sem
 * supino nenhum não é limpa: ela não é evidência de tolerância, é ausência de
 * evidência — e o RETORNO é a única regra do §1.2 que AUMENTA carga sobre o
 * tecido lesionado, então aqui o erro barato é não subir.
 */
function semanaLimpa(w: GateWeekObservation): boolean {
  return w.benchSessions > 0
    && w.loggedSessions >= w.benchSessions
    && w.peak !== null
    && w.peak <= PAIN_GATE.retorno.picoMaximo;
}

/**
 * Avalia a linha `RETORNO` sobre o histórico por semana, da mais antiga para a
 * mais recente (a última é a semana corrente).
 *
 * "Consecutivas" é exigido nos dois sentidos: as semanas têm de ser limpas E ter
 * números consecutivos. Um buraco no histórico interrompe a contagem em vez de
 * ser costurado em silêncio.
 */
export function evaluateGateReturn(
  weeks: readonly GateWeekObservation[],
): GateReturnVerdict {
  const ordered = [...weeks].sort((a, b) => a.weekNumber - b.weekNumber);
  const exigidas = PAIN_GATE.retorno.semanas;

  let semanasLimpas = 0;
  for (let i = ordered.length - 1; i >= 0; i -= 1) {
    const w = ordered[i];
    const anterior = ordered[i + 1];
    if (anterior && anterior.weekNumber !== w.weekNumber + 1) break;
    if (!semanaLimpa(w)) break;
    semanasLimpas += 1;
  }

  const semanasSemLog = ordered
    .slice(-exigidas)
    .filter((w) => w.benchSessions > 0 && w.loggedSessions < w.benchSessions)
    .map((w) => w.weekNumber);

  return {
    elegivel: semanasLimpas >= exigidas,
    semanasExigidas: exigidas,
    picoMaximo: PAIN_GATE.retorno.picoMaximo,
    semanasLimpas,
    sinal: PAIN_GATE.retorno.sinal,
    acao: PAIN_GATE.retorno.acao,
    semanasSemLog,
  };
}

/**
 * Linha de bandeira do retorno. Prefixo próprio, porque não é degrau de
 * agravamento: quem varre as bandeiras por `GATE DE PEITORAL` está procurando o
 * que apertar, e isto é a única linha do §1.2 que afrouxa.
 */
export function describeGateReturn(v: GateReturnVerdict): string {
  return `RETORNO DO GATE ${PAIN_GATE.secao} — ${v.semanasLimpas} semanas consecutivas com pico `
    + `≤${v.picoMaximo}/10 em todas as sessões de supino: ${v.acao}`;
}

/** Linha de bandeira para a semana que só não é limpa porque faltou log. */
export function describeGateReturnGap(v: GateReturnVerdict): string {
  return `RETORNO DO GATE ${PAIN_GATE.secao} bloqueado — sessão de supino sem log de dor `
    + `na(s) semana(s) ${v.semanasSemLog.join(', ')}; o ${PAIN_GATE.secao} exige o log em toda `
    + 'sessão com supino ou peitoral, e sem ele a semana não pode ser declarada limpa';
}
