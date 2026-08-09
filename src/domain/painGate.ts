import { VENA_BLOCK1_PAIN_GATE } from '../data/program/vena-block1/generated';
import type { PainRegion } from '../types';

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
 * Uma leitura de peitoral por sessão que colheu o log.
 *
 * `peak` é o maior valor dos momentos colhidos na sessão (o programa pede três:
 * pré-sessão, 1ª pausada com carga de trabalho, pós-sessão) somando os dois
 * lados. Sessão sem log de peitoral não entra na lista — a janela de "3 sessões
 * de supino" da tabela é contada sobre as sessões QUE COLHERAM, que são
 * exatamente as sessões com supino ou peitoral.
 */
export interface GateReading {
  date: string;
  peak: number;
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
  /** Maior intensidade observada em qualquer leitura. */
  pico: number;
}

/**
 * Avalia as leituras da semana contra a tabela e devolve o degrau MAIS GRAVE
 * satisfeito, ou `null`. Os degraus já vêm ordenados por severidade decrescente
 * do gerador, então o primeiro que dispara é o que vale.
 */
export function evaluatePainGate(readings: readonly GateReading[]): GateVerdict | null {
  if (readings.length === 0) return null;
  const ordered = [...readings].sort((a, b) => a.date.localeCompare(b.date));
  const pico = Math.max(...ordered.map((r) => r.peak));

  for (const degrau of PAIN_GATE.degraus) {
    const hits = ordered.filter((r) => r.peak >= degrau.limiar);
    if (hits.length < degrau.eventos) continue;

    let eventos: GateReading[] | null = null;
    if (degrau.janelaSessoes === null) {
      eventos = hits.slice(0, degrau.eventos);
    } else {
      // Janela deslizante sobre as sessões que colheram o log, não sobre dias.
      for (let i = 0; i + degrau.janelaSessoes <= ordered.length; i += 1) {
        const janela = ordered.slice(i, i + degrau.janelaSessoes)
          .filter((r) => r.peak >= degrau.limiar);
        if (janela.length >= degrau.eventos) { eventos = janela; break; }
      }
      // Menos sessões colhidas que o tamanho da janela: a janela inteira ainda
      // cabe no futuro, então avalia o que existe em vez de ignorar o sinal.
      if (!eventos && ordered.length < degrau.janelaSessoes && hits.length >= degrau.eventos) {
        eventos = hits;
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
      eventos,
      pico,
    };
  }
  return null;
}

/** Linha de bandeira do gate, com o texto da ação como o programa a escreveu. */
export function describePainGate(v: GateVerdict): string {
  const quando = v.eventos.map((e) => e.date).join(', ');
  return `GATE DE PEITORAL ${PAIN_GATE.secao} — ${v.sinal} (pico ${v.pico}/10, ${v.eventos.length}× em ${quando}): ${v.acao}`;
}
