import { ScaleSelector } from '../../../components/ui';
import { PainSelector } from './PainSelector';
import { usePostSurvey } from '../hooks/usePostSurvey';
import { strengthPerceptionLabels, planAdherenceLabels } from '../../../domain/surveyConfig';
import type { PostWorkoutSurvey, StrengthPerception, PlanAdherence } from '../../../types';

interface PostWorkoutSurveySheetProps {
  workoutId: string;
  onSubmit: (survey: PostWorkoutSurvey) => void;
  onSkip: () => void;
}

export function PostWorkoutSurveySheet({ workoutId, onSubmit, onSkip }: PostWorkoutSurveySheetProps) {
  const {
    sessionQuality,
    setSessionQuality,
    sessionRPE,
    setSessionRPE,
    strengthPerception,
    setStrengthPerception,
    planAdherence,
    setPlanAdherence,
    adherenceReason,
    setAdherenceReason,
    hasNewPain,
    setHasNewPain,
    painEntries,
    setPainEntries,
    pumpRating,
    setPumpRating,
    notes,
    setNotes,
    buildSurvey,
  } = usePostSurvey();

  const handleSubmit = () => {
    onSubmit(buildSurvey(workoutId));
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-28 space-y-6">
        <h1 className="text-2xl font-display font-bold tracking-wide uppercase text-accent-gold text-center">
          Questionário Pós-Treino
        </h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
              Qualidade da Sessão
            </label>
            <ScaleSelector
              value={sessionQuality}
              onChange={setSessionQuality}
              min={1}
              max={10}
              lowLabel="Péssima"
              highLabel="Excelente"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
              RPE Geral
            </label>
            <ScaleSelector
              value={sessionRPE}
              onChange={setSessionRPE}
              min={1}
              max={10}
              lowLabel="Fácil"
              highLabel="Máximo"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
              Percepção de Força
            </label>
            <div className="flex gap-2">
              {(Object.keys(strengthPerceptionLabels) as StrengthPerception[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStrengthPerception(key)}
                  className={`flex-1 h-11 rounded font-display text-sm font-semibold transition-all ${
                    strengthPerception === key
                      ? 'bg-accent-gold text-black ring-2 ring-accent-gold/30'
                      : 'bg-bg-input text-text-muted hover:bg-bg-tertiary'
                  }`}
                >
                  {strengthPerceptionLabels[key]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
              Aderência ao Plano
            </label>
            <div className="flex gap-2">
              {(Object.keys(planAdherenceLabels) as PlanAdherence[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPlanAdherence(key)}
                  className={`flex-1 h-11 rounded font-display text-sm font-semibold transition-all ${
                    planAdherence === key
                      ? 'bg-accent-gold text-black ring-2 ring-accent-gold/30'
                      : 'bg-bg-input text-text-muted hover:bg-bg-tertiary'
                  }`}
                >
                  {planAdherenceLabels[key]}
                </button>
              ))}
            </div>
          </div>

          {(planAdherence === 'partial' || planAdherence === 'none') && (
            <div className="space-y-2">
              <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
                Motivo
              </label>
              <input
                type="text"
                value={adherenceReason}
                onChange={(e) => setAdherenceReason(e.target.value)}
                placeholder="Ex: Falta de tempo, dor..."
                className="w-full h-11 px-3 bg-bg-input border border-border-light rounded text-text-primary font-display placeholder:text-text-muted focus:border-accent-gold focus:outline-none transition-colors"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
              Nova Dor?
            </label>
            <PainSelector
              hasPain={hasNewPain}
              onHasPainChange={setHasNewPain}
              painEntries={painEntries}
              onPainEntriesChange={setPainEntries}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
              Pump
            </label>
            <ScaleSelector
              value={pumpRating}
              onChange={setPumpRating}
              min={1}
              max={5}
              lowLabel="Nenhum"
              highLabel="Máximo"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
              Notas
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre o treino..."
              rows={3}
              className="w-full px-3 py-2 bg-bg-input border border-border-light rounded text-text-primary font-display text-sm placeholder:text-text-muted focus:border-accent-gold focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-bg-primary border-t border-border p-4">
        <div className="max-w-lg mx-auto flex gap-3">
          <button
            type="button"
            onClick={onSkip}
            className="flex-1 h-12 rounded bg-bg-card border border-border text-text-muted font-display font-semibold tracking-wide uppercase hover:bg-bg-tertiary transition-colors"
          >
            Pular
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 h-12 rounded bg-accent-gold text-black font-display font-bold tracking-wide uppercase hover:bg-accent-gold/90 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
