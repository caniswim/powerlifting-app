import type { NoteSegment, NoteSpan } from '../../../domain/prescriptionNotes';
import { TONE_LABELS } from '../../../domain/prescriptionNotes';
import { toneStyle } from './noteTone';

/**
 * Renderização inline de um segmento de nota.
 *
 * A nota mistura quatro coisas com peso visual muito diferente: instrução,
 * evidência verbatim, ênfase do autor e procedência. No parágrafo único elas
 * tinham exatamente a mesma cor e o mesmo tamanho, e por isso o olho não
 * conseguia pular a procedência para chegar na instrução.
 *
 * Aqui a hierarquia é de COR, não de tamanho — o texto continua todo do mesmo
 * corpo, o que evita a mancha listrada de tipografia mista. Verbatim clareia
 * (é a evidência), comentário fica em cinza médio, procedência afunda para o
 * cinza mais baixo e some por padrão.
 */

interface NoteBodyProps {
  spans: NoteSpan[];
  /** Procedência ocupa ~30% do texto. Fica fora do caminho até ser pedida. */
  showCitations: boolean;
}

export function NoteBody({ spans, showCitations }: NoteBodyProps) {
  return (
    <>
      {spans.map((span, i) => {
        switch (span.type) {
          case 'quote':
            return (
              <span key={i} className="text-text-primary">
                <span className="text-text-muted">“</span>
                {span.value}
                <span className="text-text-muted">”</span>
              </span>
            );
          case 'code':
            return (
              <code
                key={i}
                className="font-mono text-[0.92em] text-accent-gold/90 bg-bg-tertiary rounded px-1 py-px"
              >
                {span.value}
              </code>
            );
          case 'strong':
            return (
              <strong key={i} className="font-semibold text-text-primary">
                {span.value}
              </strong>
            );
          case 'citation':
            if (!showCitations) return null;
            return (
              <span
                key={i}
                className="inline-block align-baseline font-mono text-[10px] leading-none text-text-muted bg-bg-tertiary/80 border border-border rounded px-1 py-0.5 mx-0.5"
              >
                {span.value}
              </span>
            );
          default:
            return <span key={i}>{span.value}</span>;
        }
      })}
    </>
  );
}

interface NoteSegmentCardProps {
  segment: NoteSegment;
  showCitations: boolean;
}

/**
 * Um segmento como bloco autônomo: trilho colorido, título e corpo.
 *
 * O trilho vertical é o que devolve escaneabilidade — dá para descer a lista
 * lendo só os títulos e parar no que interessa, coisa impossível quando tudo
 * era uma frase só de 4.500 caracteres.
 */
export function NoteSegmentCard({ segment, showCitations }: NoteSegmentCardProps) {
  const style = toneStyle(segment.tone);
  const hiddenCitations = !showCitations && segment.citations.length > 0;

  return (
    <div className="flex gap-2.5">
      <div className={`w-0.5 rounded-full flex-shrink-0 ${segment.warn ? 'bg-accent-gold' : style.rail}`} />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {segment.warn && (
            <span className="text-[10px] font-display font-bold uppercase tracking-wider text-accent-gold">
              Ressalva
            </span>
          )}
          {segment.heading ? (
            <span className="text-[11px] font-display font-bold uppercase tracking-wider text-text-primary">
              {segment.heading}
            </span>
          ) : (
            <span
              className={`text-[10px] font-display font-semibold uppercase tracking-wider px-1.5 py-px rounded ${style.chip}`}
            >
              {TONE_LABELS[segment.tone]}
            </span>
          )}
        </div>

        {/* Alguns segmentos são rótulo puro — `PAPEL PRÁTICA (40–70%)` não tem
            corpo. Sem esta guarda sobraria um parágrafo vazio abrindo espaço. */}
        {segment.spans.length > 0 && (
          <p className="text-[13px] font-display text-text-secondary leading-relaxed">
            <NoteBody spans={segment.spans} showCitations={showCitations} />
          </p>
        )}

        {hiddenCitations && (
          <p className="text-[10px] font-mono text-text-muted/70">
            {segment.citations.length} procedência{segment.citations.length > 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
}
