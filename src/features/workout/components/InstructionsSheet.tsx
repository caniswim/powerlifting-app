import { useEffect, useState } from 'react';
import { X, Quote } from 'lucide-react';
import type { ParsedNotes } from '../../../domain/prescriptionNotes';
import { NoteSegmentCard } from './NoteSpans';

const CITATIONS_KEY = 'ui.notes.showCitations';

/**
 * Preferência de exibir procedência, guardada entre sessões.
 *
 * Fica desligada por padrão porque as citações são ~30% da massa de texto e
 * quem está sob a barra não precisa delas. Mas continuam a um toque: elas são
 * o que permite auditar de onde cada instrução veio, e esconder de vez seria
 * jogar fora a razão de a nota ter esse tamanho.
 */
function useShowCitations(): [boolean, (v: boolean) => void] {
  const [show, setShow] = useState(() => {
    try {
      return localStorage.getItem(CITATIONS_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CITATIONS_KEY, show ? '1' : '0');
    } catch {
      /* modo privado: a preferência vale só para esta sessão */
    }
  }, [show]);

  return [show, setShow];
}

interface Group {
  title: string;
  hint: string;
  segments: ParsedNotes['segments'];
}

interface InstructionsSheetProps {
  exerciseName: string;
  parsed: ParsedNotes;
  onClose: () => void;
}

/**
 * A nota inteira, em folha própria.
 *
 * Fora do fluxo da série: ler procedência e ressalva é atividade de antes ou
 * depois do set, nunca no intervalo. Na tela de execução fica só o destaque.
 */
export function InstructionsSheet({ exerciseName, parsed, onClose }: InstructionsSheetProps) {
  const [showCitations, setShowCitations] = useShowCitations();

  // Fecha no Escape — em desktop e em teclado bluetooth a folha ficava presa.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const groups: Group[] = [
    { title: 'Como executar', hint: 'cues e regra de parada', segments: parsed.key },
    { title: 'Dose e contexto', hint: 'papel do bloco, medida, regra de competição', segments: parsed.reference },
    { title: 'Procedência e ressalvas', hint: 'lacunas, correções e divergências declaradas', segments: parsed.provenance },
  ].filter((g) => g.segments.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Instruções — ${exerciseName}`}
        className="relative w-full max-w-lg bg-bg-card border-t border-border rounded-t-2xl flex flex-col animate-slide-up"
        style={{ maxHeight: '88vh' }}
      >
        {/* Cabeçalho fixo: some da rolagem para o alvo ficar sempre à vista */}
        <div className="flex-shrink-0 px-4 pt-3 pb-3 border-b border-border space-y-3">
          <div className="flex justify-center">
            <div className="w-10 h-1 bg-border rounded-full" />
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] font-display font-semibold text-text-muted uppercase tracking-wider">
                Instruções
              </div>
              <h2 className="text-base font-display font-bold text-text-primary uppercase tracking-wider leading-tight">
                {exerciseName}
              </h2>
              {parsed.target && (
                <div className="text-xs font-mono text-accent-gold mt-0.5">
                  Alvo ≈ {parsed.target.kg} kg · TM {parsed.target.trainingMax}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar instruções"
              className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-lg bg-bg-tertiary border border-border text-text-muted active:bg-border"
            >
              <X size={16} />
            </button>
          </div>

          <button
            onClick={() => setShowCitations(!showCitations)}
            aria-pressed={showCitations}
            className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-display font-semibold uppercase tracking-wider transition-colors ${
              showCitations
                ? 'bg-accent-blue/15 border-accent-blue/40 text-accent-blue'
                : 'bg-bg-tertiary border-border text-text-muted'
            }`}
          >
            <Quote size={11} />
            Procedências ({parsed.citationCount})
          </button>
        </div>

        {/* Corpo rolável */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 space-y-5"
          style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
        >
          {groups.map((group) => (
            <section key={group.title} className="space-y-3">
              <div>
                <h3 className="text-[11px] font-display font-bold uppercase tracking-wider text-accent-gold/80">
                  {group.title}
                </h3>
                <p className="text-[10px] font-display text-text-muted">{group.hint}</p>
              </div>
              <div className="space-y-3.5">
                {group.segments.map((segment, i) => (
                  <NoteSegmentCard key={i} segment={segment} showCitations={showCitations} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
