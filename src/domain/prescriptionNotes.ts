/**
 * Parser das notas de prescrição.
 *
 * O campo `notes` de cada bloco não é uma observação: é um documento. Mediana de
 * 1.388 caracteres, máximo de 4.584, e 73% dos blocos passam de mil. Renderizado
 * como um parágrafo só, empurra o input de série para fora da tela e obriga a
 * ler procedência no meio de uma série.
 *
 * O texto, porém, tem gramática. Foi escrito com cabeçalhos em caixa alta,
 * citações em formato regular, `⚠️` marcando ressalva e aspas marcando verbatim.
 * Este módulo lê essa gramática e devolve estrutura, sem tocar no PROGRAMA.md:
 * a fonte de verdade continua sendo o markdown, e a UI passa a poder hierarquizar.
 *
 * A cobertura é verificada no build por `scripts/check-notes-parser.mjs`, contra
 * os 614 blocos reais. Se uma edição futura do markdown quebrar a gramática, o
 * build falha — o renderizador não fica torcendo para o texto continuar do
 * formato que ele espera.
 */

/** Classe semântica de um segmento, derivada do cabeçalho. */
export type NoteTone =
  /** Papel do bloco, dose, estrutura, frequência, carga. */
  | 'dose'
  /** Como executar: cues, pausa, pegada, lockout, correção de técnica. */
  | 'execucao'
  /** Quando encerrar: regra de parada, teto de RPE, corte de série. */
  | 'parada'
  /** Instrumento de medida: gauge, porta, regra de invalidação. */
  | 'instrumento'
  /** Registro: vídeo, ângulo de filmagem. */
  | 'registro'
  /** Regra de competição IPF: comandos, pegada 2026, luz vermelha. */
  | 'ipf'
  /** Meta-honestidade: lacuna, contradição, correção, desvio, substituição. */
  | 'meta'
  /** Sem cabeçalho — prosa corrida. */
  | 'prosa';

export type CitationKind = 'video' | 'escopo' | 'doc' | 'interpretacao' | 'outro';

export interface NoteCitation {
  /** Como aparece no texto, com colchetes. */
  raw: string;
  /** Sem colchetes, para exibição. */
  label: string;
  kind: CitationKind;
}

/** Um pedaço inline do corpo de um segmento. */
export type NoteSpan =
  | { type: 'text'; value: string }
  /** Trecho verbatim entre aspas — a evidência, não a paráfrase. */
  | { type: 'quote'; value: string }
  /** Crase de markdown: identificador de código no texto. */
  | { type: 'code'; value: string }
  /** Palavra de alerta em caixa alta, ênfase do autor. */
  | { type: 'strong'; value: string }
  | { type: 'citation'; value: string; citation: NoteCitation };

export interface NoteSegment {
  /** Cabeçalho em caixa alta, se houver. */
  heading?: string;
  tone: NoteTone;
  /** O segmento carrega `⚠️` — ressalva, não instrução comum. */
  warn: boolean;
  spans: NoteSpan[];
  /** Corpo sem citações nem marcação, para prévia de uma linha. */
  plain: string;
  citations: NoteCitation[];
}

export interface ParsedNotes {
  /** O ` · Alvo ≈ X kg @ TM Y` que o gerador anexa. É número, não prosa. */
  target?: { kg: number; trainingMax: number };
  segments: NoteSegment[];
  /** O que se lê entre séries: execução e regra de parada. */
  key: NoteSegment[];
  /** O resto: dose, instrumento, registro, regra de IPF, prosa. */
  reference: NoteSegment[];
  /** Procedência e ressalvas do próprio programa. */
  provenance: NoteSegment[];
  citationCount: number;
}

/**
 * Sufixo anexado pelo gerador quando o bloco tem %1RM
 * (`scripts/build-vena-block1.mjs`, na linha que monta `· Alvo ≈`).
 * É valor calculado e pertence à grade de números, não ao fim de um parágrafo.
 */
const TARGET_RE = /\s*·\s*Alvo\s*≈\s*([\d.,]+)\s*kg\s*@\s*TM\s*([\d.,]+)\s*$/;

/**
 * Cabeçalho: caixa alta ancorada em início de texto, fim de frase ou `⚠️`,
 * terminada em `:`, `—` ou `(`.
 *
 * A âncora é o que separa cabeçalho de ênfase no meio de frase — sem ela,
 * `o princípio que transfere é ESPELHAR:` viraria seção. Aceita continuação
 * com em-dash (`CORREÇÃO MESTRA, METADE 1 — JOELHOS:`), dígitos (`REGRA NOVA
 * 2026`), e minúsculas só onde são unidade ou conectivo (`PAUSA DE 1 s NA
 * PROFUNDIDADE LEGAL`).
 */
const HEADING_WORD = String.raw`(?:[A-ZÁÉÍÓÚÂÊÔÃÕÀÇÜ0-9§%°ºª,\/"“”\-–—]+|\d+(?:[.,]\d+)?|s|kg|cm|m|min|de|do|da|dos|das|e|em|na|no|nas|nos|por|com|x|é|a|o)`;
const HEADING_RE = new RegExp(
  String.raw`(?:^|(?<=[.;!?]\s)|(?<=⚠️\s))(${HEADING_WORD}(?:[ ]${HEADING_WORD}){0,15})` +
    String.raw`(\s*\[[^\]]{1,60}\])?\s*(?=[:—(])`,
  'g',
);

/** Preposição solta em caixa alta não abre seção — é ênfase no meio da frase. */
const HEADING_STOPWORDS = new Set(['DO', 'DA', 'DE', 'DOS', 'DAS', 'NA', 'NO', 'EM', 'POR', 'E', 'A', 'O', 'COM', 'QUE']);

/** Palavras de alerta que o autor escreveu em caixa alta de propósito. */
const STRONG_RE =
  /\b(NÃO|NUNCA|JAMAIS|ZERO|PROIBIDO|OBRIGATÓRI[OA]|INVÁLID[OA]|LACUNA|SEMPRE|NENHUM[A]?)\b/g;

const TONE_RULES: { tone: NoteTone; test: RegExp }[] = [
  // Ordem importa: `REGRA DE PARADA` é parada, não regra de IPF.
  { tone: 'parada', test: /\b(PARADA|CORTE DE SÉRIES?|TETO DE RPE|RPE NÃO É ALVO|REGRA DE CORTE|À FALHA|NUNCA À FALHA)\b/ },
  { tone: 'meta', test: /\b(LACUNA|CITAÇÃO|PROCEDÊNCIA|CORREÇÃO EXPLÍCITA|CONTRADIÇÃO|CONTRAPONTO|DESVIO|SUBSTITUIÇÃO|ANTI-CUE|OS DADOS DIZEM|INTERPRETAÇÃO|DECLARAD[OA]|MIGRADO)\b/ },
  { tone: 'instrumento', test: /\b(GAUGE|PORTA|INVALIDAÇÃO|INSTRUMENTO)\b/ },
  { tone: 'registro', test: /\b(VÍDEO|FILME|FILMAR|PERPENDICULAR)\b/ },
  { tone: 'ipf', test: /\b(2026|COMANDOS?|LUZ VERMELHA|IPF|HANDOFF|RACK)\b/ },
  { tone: 'execucao', test: /\b(EXECUÇÃO|CUES?|PAUSA|LOCKOUT|PEGADA|CORREÇÃO MESTRA|ANTI-THRUST|DESCIDA|STRAPS?|SEM STRAP|JOELHOS|TRONCO|PROFUNDIDADE|ESPELHA|RIGOR|REGRA DURA)\b/ },
  { tone: 'dose', test: /\b(PAPEL|PRESCRIÇÃO|ESTRUTURA|PROGRESSÃO|FREQUÊNCIA|CARGA|VOLUME|BACK ?OFF|TOP SET|AQUECIMENTOS?|RAMPLA|SÉRIES|EXPOSIÇÃO)\b/ },
];

/** Tons que se lê no intervalo entre séries, com a barra na frente. */
const KEY_TONES = new Set<NoteTone>(['execucao', 'parada']);

function classify(heading: string | undefined): NoteTone {
  if (!heading) return 'prosa';
  const upper = heading.toUpperCase();
  for (const rule of TONE_RULES) {
    if (rule.test.test(upper)) return rule.tone;
  }
  return 'dose';
}

function citationKind(label: string): CitationKind {
  if (/^R\d+\b/.test(label)) return 'video';
  if (label === 'GERAL' || label === 'PESSOAL') return 'escopo';
  if (/^interpretação/i.test(label)) return 'interpretacao';
  if (/^(design|SPEC|tecnica|bracos|elites|IPF-TR2026|VÍDEO-[A-Z]{2})\b/.test(label)) return 'doc';
  return 'outro';
}

/**
 * Quebra o corpo de um segmento em spans inline.
 *
 * Uma passada só, com uma alternância — assim os offsets nunca se cruzam e o
 * texto restante é sempre o que sobrou entre dois marcadores.
 */
function tokenize(body: string): { spans: NoteSpan[]; citations: NoteCitation[] } {
  const spans: NoteSpan[] = [];
  const citations: NoteCitation[] = [];
  const marker = /\[([^\]]+)\]|"([^"]{2,})"|“([^”]{2,})”|`([^`]+)`/g;

  const pushText = (raw: string) => {
    if (!raw) return;
    // Ênfase em caixa alta é a última camada: só sobre o que não virou marcador.
    let last = 0;
    STRONG_RE.lastIndex = 0;
    let s: RegExpExecArray | null;
    while ((s = STRONG_RE.exec(raw)) !== null) {
      if (s.index > last) spans.push({ type: 'text', value: raw.slice(last, s.index) });
      spans.push({ type: 'strong', value: s[0] });
      last = s.index + s[0].length;
    }
    if (last < raw.length) spans.push({ type: 'text', value: raw.slice(last) });
  };

  let cursor = 0;
  let m: RegExpExecArray | null;
  while ((m = marker.exec(body)) !== null) {
    pushText(body.slice(cursor, m.index));
    if (m[1] !== undefined) {
      const citation: NoteCitation = { raw: m[0], label: m[1], kind: citationKind(m[1]) };
      citations.push(citation);
      spans.push({ type: 'citation', value: m[1], citation });
    } else if (m[2] !== undefined || m[3] !== undefined) {
      spans.push({ type: 'quote', value: (m[2] ?? m[3]) as string });
    } else {
      spans.push({ type: 'code', value: m[4] as string });
    }
    cursor = m.index + m[0].length;
  }
  pushText(body.slice(cursor));

  return { spans, citations };
}

/** Texto legível de um span, para a prévia de uma linha. */
function spanText(span: NoteSpan): string {
  switch (span.type) {
    case 'citation':
      return '';
    case 'quote':
      return `"${span.value}"`;
    default:
      return span.value;
  }
}

function makeSegment(heading: string | undefined, body: string): NoteSegment | null {
  const warn = body.includes('⚠️') || body.includes('⚠');
  const cleaned = body.replace(/⚠️|⚠/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned && !heading) return null;

  const { spans, citations } = tokenize(cleaned);
  const plain = spans.map(spanText).join('').replace(/\s+/g, ' ').replace(/\s+([.,;:])/g, '$1').trim();

  return { ...(heading ? { heading } : {}), tone: classify(heading), warn, spans, plain, citations };
}

/**
 * Lê a nota crua e devolve seções, citações e o alvo numérico.
 *
 * Nunca lança e nunca perde texto: se a gramática não bater em nada, o
 * resultado é um único segmento de prosa com o texto inteiro. Um bloco sem
 * cabeçalho — 126 dos 614, quase todos acessório — é caso normal, não erro.
 */
export function parsePrescriptionNotes(raw: string | undefined): ParsedNotes | null {
  if (!raw || !raw.trim()) return null;

  let text = raw.trim();
  let target: ParsedNotes['target'];

  const targetMatch = text.match(TARGET_RE);
  if (targetMatch) {
    const kg = Number(targetMatch[1].replace(',', '.'));
    const trainingMax = Number(targetMatch[2].replace(',', '.'));
    if (Number.isFinite(kg) && Number.isFinite(trainingMax)) {
      target = { kg, trainingMax };
      text = text.slice(0, text.length - targetMatch[0].length).trim();
    }
  }

  // Coleta as posições de cabeçalho antes de fatiar, para que o corpo de cada
  // seção seja exatamente o que existe até o cabeçalho seguinte.
  //
  // Nada do que sai do cabeçalho é descartado: a citação que fecha o título
  // (`COMANDOS DESDE A S1 [design §13-B/R12]:`) e o `é` de ligação que às vezes
  // sobra voltam como início do corpo. Descartá-los apagava texto do programa —
  // que foi o que a checagem de conservação flagrou.
  const marks: { heading: string; start: number; bodyStart: number; lead: string }[] = [];
  HEADING_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = HEADING_RE.exec(text)) !== null) {
    const trimmed = m[1].replace(/[\s,;–-]+$/, '');
    const tail = trimmed.match(/\s+é$/) ? 'é ' : '';
    const heading = (tail ? trimmed.slice(0, -2) : trimmed).trim();
    const letters = heading.replace(/[^A-ZÁÉÍÓÚÂÊÔÃÕÀÇÜ]/g, '');
    if (letters.length < 3) continue;
    if (HEADING_STOPWORDS.has(heading.split(/\s+/)[0])) continue;
    const end = m.index + m[0].length;
    let full = heading;
    let bodyStart = end + 1; // consome `:` ou `—`

    // Parêntese curto colado no título é qualificador do título, não corpo:
    // `PAPEL PRÁTICA (40–70%)` e `PARADA (RPE 10 operacional)` são rótulos
    // inteiros. Separá-los deixava uma seção de nove caracteres de corpo.
    if (text[end] === '(') {
      const close = text.indexOf(')', end);
      const inner = close > end ? text.slice(end, close + 1) : '';
      // Parêntese que carrega citação é conteúdo, não rótulo: se subisse para o
      // título escaparia do controle de procedência e da contagem.
      if (close > end && close - end <= 42 && !inner.includes('[')) {
        full = `${heading} ${inner}`;
        bodyStart = close + 1;
        if (/[:—.]/.test(text[bodyStart] ?? '')) bodyStart += 1;
      } else {
        bodyStart = end; // parêntese longo é frase: fica no corpo
      }
    }

    marks.push({ heading: full, start: m.index, bodyStart, lead: tail + (m[2] ?? '').trim() });
  }

  const segments: NoteSegment[] = [];
  const preamble = marks.length > 0 ? text.slice(0, marks[0].start) : text;
  const lead = makeSegment(undefined, preamble);
  if (lead) segments.push(lead);

  marks.forEach((mark, i) => {
    const stop = i + 1 < marks.length ? marks[i + 1].start : text.length;
    const seg = makeSegment(mark.heading, `${mark.lead} ${text.slice(mark.bodyStart, stop)}`);
    if (seg) segments.push(seg);
  });

  return {
    ...(target ? { target } : {}),
    segments,
    key: segments.filter((s) => KEY_TONES.has(s.tone)),
    reference: segments.filter((s) => !KEY_TONES.has(s.tone) && s.tone !== 'meta'),
    provenance: segments.filter((s) => s.tone === 'meta'),
    citationCount: segments.reduce((n, s) => n + s.citations.length, 0),
  };
}

/**
 * As duas ou três linhas que valem estar visíveis sem nenhum toque.
 *
 * Prioriza regra de parada e execução; se o bloco não tem cabeçalho nenhum
 * (acessórios), cai para a prosa de abertura, que é onde o autor põe o resumo.
 */
export function noteHighlights(parsed: ParsedNotes | null, limit = 2): NoteSegment[] {
  if (!parsed) return [];
  // Segmento de rótulo puro não é destaque: não tem o que ler.
  const withBody = parsed.key.filter((s) => s.plain.length > 0);
  const parada = withBody.filter((s) => s.tone === 'parada');
  const execucao = withBody.filter((s) => s.tone === 'execucao');
  const picked = [...parada, ...execucao].slice(0, limit);
  if (picked.length > 0) return picked;
  return parsed.segments.filter((s) => s.plain.length > 0).slice(0, 1);
}

export const TONE_LABELS: Record<NoteTone, string> = {
  dose: 'Dose',
  execucao: 'Execução',
  parada: 'Parada',
  instrumento: 'Instrumento',
  registro: 'Registro',
  ipf: 'Regra IPF',
  meta: 'Procedência',
  prosa: 'Nota',
};
