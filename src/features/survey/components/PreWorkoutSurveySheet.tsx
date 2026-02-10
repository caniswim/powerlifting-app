import { ScaleSelector, NumericInput } from '../../../components/ui';
import { PainSelector } from './PainSelector';
import { SupplementChecklist } from './SupplementChecklist';
import { usePreSurvey } from '../hooks/usePreSurvey';
import type { PreWorkoutSurvey } from '../../../types';

interface PreWorkoutSurveySheetProps {
  workoutId: string;
  onSubmit: (survey: PreWorkoutSurvey) => void;
  onSkip: () => void;
}

export function PreWorkoutSurveySheet({ workoutId, onSubmit, onSkip }: PreWorkoutSurveySheetProps) {
  const {
    sleepQuality,
    setSleepQuality,
    sleepHours,
    setSleepHours,
    energyLevel,
    setEnergyLevel,
    stressLevel,
    setStressLevel,
    motivation,
    setMotivation,
    hasPain,
    setHasPain,
    painEntries,
    setPainEntries,
    supplements,
    setSupplements,
    buildSurvey,
  } = usePreSurvey();

  const handleSubmit = () => {
    onSubmit(buildSurvey(workoutId));
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-28 space-y-6">
        <h1 className="text-2xl font-display font-bold tracking-wide uppercase text-accent-gold text-center">
          Questionário Pré-Treino
        </h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
              Qualidade do Sono
            </label>
            <ScaleSelector
              value={sleepQuality}
              onChange={setSleepQuality}
              min={1}
              max={10}
              lowLabel="Péssima"
              highLabel="Excelente"
            />
          </div>

          <div className="space-y-2">
            <NumericInput
              label="Horas de Sono"
              value={sleepHours}
              onChange={setSleepHours}
              step={0.5}
              min={0}
              max={14}
              unit="h"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
              Energia
            </label>
            <ScaleSelector
              value={energyLevel}
              onChange={setEnergyLevel}
              min={1}
              max={10}
              lowLabel="Baixa"
              highLabel="Alta"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
              Estresse
            </label>
            <ScaleSelector
              value={stressLevel}
              onChange={setStressLevel}
              min={1}
              max={10}
              lowLabel="Baixo"
              highLabel="Alto"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
              Motivação
            </label>
            <ScaleSelector
              value={motivation}
              onChange={setMotivation}
              min={1}
              max={10}
              lowLabel="Baixa"
              highLabel="Alta"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
              Dor?
            </label>
            <PainSelector
              hasPain={hasPain}
              onHasPainChange={setHasPain}
              painEntries={painEntries}
              onPainEntriesChange={setPainEntries}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
              Suplementos
            </label>
            <SupplementChecklist supplements={supplements} onChange={setSupplements} />
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
