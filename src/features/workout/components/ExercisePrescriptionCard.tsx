import { useMemo, useState } from 'react';
import { BookOpen, Repeat } from 'lucide-react';
import type { ExerciseLog } from '../../../types';
import { parsePrescriptionNotes, noteHighlights } from '../../../domain/prescriptionNotes';
import { toneStyle } from './noteTone';
import { InstructionsSheet } from './InstructionsSheet';
import { TONE_LABELS } from '../../../domain/prescriptionNotes';

interface ExercisePrescriptionCardProps {
  exercise: ExerciseLog;
  /** Variações que o programa permite, com os ids correspondentes. */
  alternatives?: { name: string; exerciseId: string }[];
  onSwapVariation?: (exerciseId: string, exerciseName: string) => void;
}

/**
 * A linha do programa na tela de execução.
 *
 * O que muda em relação à versão anterior é a divisão de trabalho. Antes o card
 * despejava a nota inteira — mediana de 1.388 caracteres, máximo de 4.584 — em
 * um parágrafo só, e o input de série ia parar duas telas abaixo. A prescrição
 * ficava tecnicamente completa e praticamente ilegível.
 *
 * Agora o card responde às duas perguntas do intervalo entre séries — "quanto"
 * e "o que não pode dar errado" — e o resto vai para uma folha própria. Nada da
 * prescrição se perde: o parser conserva o texto inteiro, e a conservação é
 * verificada no build (`scripts/check-notes-parser.mjs`).
 */
export function ExercisePrescriptionCard({
  exercise,
  alternatives,
  onSwapVariation,
}: ExercisePrescriptionCardProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  // Só 132 textos únicos para 614 blocos, mas parsear a cada render de série
  // seria trabalho jogado fora — a nota só muda quando o exercício muda.
  const parsed = useMemo(
    () => parsePrescriptionNotes(exercise.prescribedNotes),
    [exercise.prescribedNotes],
  );
  const highlights = useMemo(() => noteHighlights(parsed), [parsed]);

  const chips: { label: string; value: string; accent?: boolean }[] = [];

  // O alvo em kg estava enterrado no fim do parágrafo, depois de tudo. É o
  // número que se executa: sobe para a grade, junto dos outros números.
  if (parsed?.target) {
    chips.push({ label: 'Alvo', value: `${parsed.target.kg} kg`, accent: true });
  }
  if (exercise.warmupSets) chips.push({ label: 'Aquec.', value: `${exercise.warmupSets}` });
  chips.push({
    label: 'Séries',
    value: `${exercise.prescribedSets}${exercise.perSide ? ' /lado' : ''}`,
  });
  chips.push({ label: 'Reps', value: exercise.prescribedReps });
  if (exercise.percent1RM) chips.push({ label: '%1RM', value: exercise.percent1RM });
  chips.push({ label: 'RPE', value: exercise.prescribedRPE });
  if (exercise.restLabel) chips.push({ label: 'Descanso', value: exercise.restLabel });

  const sectionCount = parsed?.segments.length ?? 0;

  return (
    <div className="bg-bg-card border border-border rounded-lg p-3 space-y-3">
      <div className="grid grid-cols-3 gap-1.5">
        {chips.map((chip) => (
          <div key={chip.label} className="bg-bg-tertiary rounded px-2 py-1.5 text-center">
            <div className="text-[9px] font-display uppercase tracking-wider text-text-muted">
              {chip.label}
            </div>
            <div
              className={`text-sm font-mono font-bold ${
                chip.accent ? 'text-accent-gold' : 'text-text-primary'
              }`}
            >
              {chip.value}
            </div>
          </div>
        ))}
      </div>

      {parsed && (
        <div className="space-y-2">
          {/* O destaque: regra de parada primeiro, execução depois. Recortado em
              duas linhas de propósito — se não coubesse, não era destaque. */}
          {highlights.map((segment, i) => {
            const style = toneStyle(segment.tone);
            return (
              <button
                key={i}
                type="button"
                onClick={() => setShowInstructions(true)}
                className="w-full flex gap-2.5 text-left active:opacity-70 transition-opacity"
              >
                <div
                  className={`w-0.5 rounded-full flex-shrink-0 ${
                    segment.warn ? 'bg-accent-gold' : style.rail
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div
                    className={`inline-block text-[9px] font-display font-bold uppercase tracking-wider px-1.5 py-px rounded mb-1 ${style.chip}`}
                  >
                    {segment.heading ?? TONE_LABELS[segment.tone]}
                  </div>
                  <p className="text-[13px] font-display text-text-secondary leading-snug line-clamp-2">
                    {segment.plain}
                  </p>
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setShowInstructions(true)}
            className="w-full flex items-center justify-center gap-1.5 h-9 rounded-lg bg-bg-tertiary border border-border text-text-muted text-[11px] font-display font-semibold uppercase tracking-wider active:bg-border hover:border-accent-gold/40 transition-colors"
          >
            <BookOpen size={12} />
            Instruções completas
            <span className="font-mono text-text-muted/70">
              {sectionCount} {sectionCount === 1 ? 'seção' : 'seções'}
            </span>
          </button>
        </div>
      )}

      {alternatives && alternatives.length > 0 && onSwapVariation && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Repeat size={12} className="text-text-muted" />
          <span className="text-[10px] font-display uppercase tracking-wider text-text-muted">
            Variação:
          </span>
          {alternatives.map((alt) => {
            const active = exercise.exerciseId === alt.exerciseId;
            return (
              <button
                key={`${alt.exerciseId}-${alt.name}`}
                type="button"
                onClick={() => onSwapVariation(alt.exerciseId, alt.name)}
                className={`px-2 py-1 rounded text-[11px] font-display transition-colors ${
                  active
                    ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/40'
                    : 'bg-bg-tertiary text-text-secondary border border-border hover:border-accent-gold/40'
                }`}
              >
                {alt.name}
              </button>
            );
          })}
        </div>
      )}

      {showInstructions && parsed && (
        <InstructionsSheet
          exerciseName={exercise.exerciseName}
          parsed={parsed}
          onClose={() => setShowInstructions(false)}
        />
      )}
    </div>
  );
}
