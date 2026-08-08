import { getRPEColor, getRIRText } from '../../../domain/rpe';
import { setTypeBadgeClass, setTypeLabels } from '../../../domain/setTypeLabels';
import { allowsZeroLoad, getExercise } from '../../../domain/exerciseRegistry';
import { isJudgedLift } from '../../../domain/competitionStandard';
import { CompetitionStandardPanel } from './CompetitionStandardPanel';
import { equipmentIncrement, exerciseEquipment } from '../../../data/exerciseMuscleMap';
import type { LoadSuggestion } from '../../../utils/calculations';
import type { ExerciseLog, PersonalRecord, SetCompliance, SetSegmentLog } from '../../../types';

const RPE_VALUES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

interface SetInputFormProps {
  exercise: ExerciseLog;
  activeSetIdx: number;
  inputWeight: number;
  inputReps: number;
  inputRPE: number;
  inputSeconds: number;
  inputSegments: SetSegmentLog[];
  inputCompliance: SetCompliance;
  suggestion: LoadSuggestion | null;
  currentE1RM: number;
  currentRecord: PersonalRecord | null;
  wouldBePR: boolean;
  onWeightChange: (w: number) => void;
  onRepsChange: (r: number) => void;
  onRPEChange: (rpe: number) => void;
  onSecondsChange: (s: number) => void;
  onSegmentChange: (index: number, patch: Partial<SetSegmentLog>) => void;
  onComplianceChange: (patch: Partial<SetCompliance>) => void;
  onCompleteSet: () => void;
}

function Stepper({
  value,
  step,
  min = 0,
  onChange,
  big = true,
}: {
  value: number;
  step: number;
  min?: number;
  onChange: (v: number) => void;
  big?: boolean;
}) {
  const height = big ? 'h-14' : 'h-11';
  const text = big ? 'text-3xl' : 'text-xl';
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, Math.round((value - step) * 100) / 100))}
        className={`w-12 ${height} bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border`}
      >
        −
      </button>
      <input
        type="number"
        inputMode="decimal"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={`flex-1 ${height} bg-bg-input border border-border-light rounded-lg text-center font-mono font-bold ${text} text-text-primary focus:border-accent-gold focus:outline-none`}
        onFocus={(e) => e.target.select()}
      />
      <button
        type="button"
        onClick={() => onChange(Math.round((value + step) * 100) / 100)}
        className={`w-12 ${height} bg-bg-tertiary border border-border rounded-lg text-text-secondary font-bold text-xl active:bg-border`}
      >
        +
      </button>
    </div>
  );
}

export function SetInputForm({
  exercise,
  activeSetIdx,
  inputWeight,
  inputReps,
  inputRPE,
  inputSeconds,
  inputSegments,
  inputCompliance,
  suggestion,
  currentE1RM,
  currentRecord,
  wouldBePR,
  onWeightChange,
  onRepsChange,
  onRPEChange,
  onSecondsChange,
  onSegmentChange,
  onComplianceChange,
  onCompleteSet,
}: SetInputFormProps) {
  const set = exercise.sets[activeSetIdx];
  const plan = set?.prescribed;
  const setType = set?.setType ?? 'working';
  const isWarmup = setType === 'warmup';
  const isTimed = set?.unit === 'seconds';
  const isAmrap = setType === 'amrap';
  const hasSegments = inputSegments.length > 0;
  const zeroLoadOk = allowsZeroLoad(exercise.exerciseId);
  // Padrão de competição só existe nos três levantamentos.
  const lift = exercise.percentRef ?? getExercise(exercise.exerciseId)?.percentRef;
  const showCompetitionPanel = !isWarmup && isJudgedLift(lift);
  const increment = equipmentIncrement[exerciseEquipment[exercise.exerciseId] || 'barbell'] || 2.5;

  const workingSets = exercise.sets.filter((s) => s.setType !== 'warmup');
  const workingIdx = exercise.sets.slice(0, activeSetIdx + 1).filter((s) => s.setType !== 'warmup').length;
  const warmupIdx = exercise.sets.slice(0, activeSetIdx + 1).filter((s) => s.setType === 'warmup').length;

  const primaryFilled = isTimed
    ? inputSeconds > 0
    : hasSegments
    ? inputSegments.some((s) => (s.reps || 0) > 0 || (s.seconds || 0) > 0)
    : inputReps > 0;
  const loadFilled = inputWeight > 0 || zeroLoadOk || hasSegments;
  const canComplete = primaryFilled && loadFilled;

  return (
    <div className={`bg-bg-card border rounded-lg p-4 space-y-4 ${
      wouldBePR ? 'border-accent-gold/50 pr-glow' : 'border-border'
    }`}>
      {/* Exercise header */}
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          {exercise.supersetGroup && (
            <span className="inline-flex items-center justify-center px-1.5 h-6 rounded bg-accent-purple/20 text-accent-purple text-xs font-mono font-bold flex-shrink-0">
              {exercise.supersetGroup}{exercise.supersetOrder ?? ''}
            </span>
          )}
          <span className="text-lg font-display font-bold text-text-primary uppercase tracking-wider">
            {exercise.exerciseName}
          </span>
          {exercise.optional && (
            <span className="px-1.5 py-0.5 rounded bg-bg-tertiary text-text-muted text-[10px] font-display uppercase tracking-wider">
              Opcional
            </span>
          )}
        </div>
        {currentRecord && (
          <div className="text-xs font-mono text-accent-gold mt-0.5">
            PR: {currentRecord.e1rm.toFixed(1)} e1RM ({currentRecord.weight}x{currentRecord.reps} @{currentRecord.rpe})
          </div>
        )}
      </div>

      {/* Set indicators — aquecimento separado das séries de trabalho */}
      <div className="flex gap-1.5">
        {exercise.sets.map((s, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full ${
              s.setType === 'warmup' ? 'opacity-50' : ''
            } ${
              s.completed
                ? s.isPR
                  ? 'bg-accent-gold'
                  : 'bg-accent-green'
                : i === activeSetIdx
                ? 'bg-text-secondary'
                : 'bg-bg-tertiary'
            }`}
          />
        ))}
      </div>

      {/* Prescrição da série ativa */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className={`px-2 py-0.5 rounded text-[10px] font-display font-semibold uppercase tracking-wider ${setTypeBadgeClass[setType]}`}>
          {setTypeLabels[setType]}
        </span>
        <span className="text-xs font-display font-semibold text-text-muted uppercase tracking-wider">
          {isWarmup
            ? `Aquecimento ${warmupIdx} de ${exercise.warmupSets ?? 0}`
            : `Série ${workingIdx} de ${workingSets.length}`}
        </span>
      </div>

      {plan && !set?.completed && (
        <div className="flex items-center justify-center gap-x-3 gap-y-1 flex-wrap text-xs font-mono text-text-secondary">
          <span>{isTimed ? plan.reps : `${plan.reps} reps`}</span>
          {plan.percent1RM && <span className="text-accent-gold">{plan.percent1RM}</span>}
          {plan.rpe && <span>RPE {plan.rpe}</span>}
          {plan.restLabel && <span className="text-text-muted">descanso {plan.restLabel}</span>}
          {plan.perSide && <span className="text-accent-purple">cada lado</span>}
        </div>
      )}

      {/* Input area (only for incomplete sets) */}
      {set && !set.completed && (
        <div className="space-y-4 border-t border-border pt-4">
          {/* Weight */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">
                {hasSegments ? 'Peso base (kg)' : 'Peso (kg)'}
                {zeroLoadOk && <span className="normal-case text-text-muted"> · peso corporal aceita 0</span>}
              </label>
              {suggestion && (
                <span className="text-[10px] font-mono text-accent-blue">
                  e1RM {suggestion.basedOnE1RM} · {suggestion.sessionsUsed}
                  {suggestion.sessionsUsed === 1 ? ' sessão' : ' sessões'}
                </span>
              )}
              {!suggestion && plan?.percent1RM && (
                <span className="text-[10px] font-mono text-accent-gold">
                  {plan.percent1RM} do 1RM
                </span>
              )}
            </div>
            <Stepper value={inputWeight} step={increment} onChange={onWeightChange} />
          </div>

          {/* Segmentos: dropset, 21s, rest-pause, unilateral */}
          {hasSegments && (
            <div className="space-y-2">
              <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted block">
                {setTypeLabels[setType]} — {plan?.reps}
              </label>
              {inputSegments.map((seg, i) => {
                const segPlan = plan?.segments?.[i];
                return (
                  <div key={`${seg.label}-${i}`} className="bg-bg-tertiary rounded-lg p-2 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-bg-card text-[10px] font-mono font-bold text-text-secondary">
                        {seg.label}
                      </span>
                      <span className="text-[10px] font-display text-text-muted uppercase tracking-wider">
                        alvo {segPlan?.reps ?? '—'}
                        {segPlan?.loadDropPct ? ` · −${Math.round(segPlan.loadDropPct * 100)}%` : ''}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-[9px] font-display uppercase tracking-wider text-text-muted mb-0.5">Peso</div>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={seg.weight || ''}
                          onChange={(e) => onSegmentChange(i, { weight: parseFloat(e.target.value) || 0 })}
                          className="w-full h-11 bg-bg-input border border-border-light rounded-lg text-center font-mono font-bold text-lg text-text-primary focus:border-accent-gold focus:outline-none"
                          onFocus={(e) => e.target.select()}
                        />
                      </div>
                      <div>
                        <div className="text-[9px] font-display uppercase tracking-wider text-text-muted mb-0.5">
                          {segPlan?.unit === 'seconds' ? 'Segundos' : 'Reps'}
                        </div>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={(segPlan?.unit === 'seconds' ? seg.seconds : seg.reps) || ''}
                          onChange={(e) => {
                            const v = parseInt(e.target.value) || 0;
                            onSegmentChange(i, segPlan?.unit === 'seconds' ? { seconds: v } : { reps: v });
                          }}
                          className="w-full h-11 bg-bg-input border border-border-light rounded-lg text-center font-mono font-bold text-lg text-text-primary focus:border-accent-gold focus:outline-none"
                          onFocus={(e) => e.target.select()}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tempo (isometria) */}
          {!hasSegments && isTimed && (
            <div>
              <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted block mb-1">
                Segundos (Alvo: {plan?.reps ?? exercise.prescribedReps})
              </label>
              <Stepper value={inputSeconds} step={5} onChange={onSecondsChange} />
            </div>
          )}

          {/* Reps */}
          {!hasSegments && !isTimed && (
            <div>
              <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted block mb-1">
                Reps (Alvo: {plan?.reps ?? exercise.prescribedReps})
                {isAmrap && <span className="text-accent-red"> · até RPE {plan?.rpe ?? exercise.prescribedRPE}</span>}
              </label>
              <Stepper value={inputReps} step={1} onChange={onRepsChange} />
            </div>
          )}

          {/* RPE */}
          <div>
            <label className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted block mb-1">
              RPE (Alvo: {plan?.rpe ?? exercise.prescribedRPE})
            </label>
            <div className="flex flex-wrap gap-1.5">
              {RPE_VALUES.map((rpe) => {
                const isSelected = inputRPE === rpe;
                return (
                  <button
                    key={rpe}
                    type="button"
                    onClick={() => onRPEChange(rpe)}
                    className={`min-w-[42px] h-11 rounded-lg font-mono text-sm font-bold transition-all ${
                      isSelected
                        ? `${getRPEColor(rpe)} ring-2 ring-white/30 scale-105`
                        : 'bg-bg-input text-text-muted hover:bg-bg-tertiary'
                    }`}
                  >
                    {rpe}
                  </button>
                );
              })}
            </div>
            <div className="text-xs font-mono text-text-muted mt-1.5 text-center">
              {getRIRText(inputRPE)}
            </div>
          </div>

          {showCompetitionPanel && lift && (
            <CompetitionStandardPanel
              lift={lift}
              reps={inputReps}
              value={inputCompliance}
              onChange={onComplianceChange}
            />
          )}

          {/* e1RM preview — aquecimento e isometria não geram e1RM */}
          {currentE1RM > 0 && !isWarmup && !isTimed && (
            <div className={`text-center py-2 rounded-lg ${
              wouldBePR ? 'bg-accent-gold/10 border border-accent-gold/30' : 'bg-bg-tertiary'
            }`}>
              <span className="text-xs font-display text-text-muted uppercase tracking-wider">e1RM: </span>
              <span className={`text-xl font-mono font-bold ${wouldBePR ? 'text-accent-gold' : 'text-text-primary'}`}>
                {currentE1RM.toFixed(1)}
              </span>
              {wouldBePR && (
                <span className="text-xs font-display text-accent-gold ml-2 uppercase tracking-wider">
                  NOVO PR!
                </span>
              )}
            </div>
          )}

          <button
            onClick={onCompleteSet}
            disabled={!canComplete}
            className={`w-full h-14 rounded-lg font-display font-bold text-lg uppercase tracking-wider transition-all ${
              !canComplete
                ? 'bg-bg-tertiary text-text-muted'
                : isWarmup
                ? 'bg-bg-tertiary border border-accent-gold/40 text-accent-gold hover:bg-bg-card active:scale-[0.98]'
                : 'bg-accent-gold text-black hover:bg-accent-gold-bright active:scale-[0.98]'
            }`}
          >
            {isWarmup ? `Completar aquecimento ${warmupIdx}` : `Completar série ${workingIdx}`}
          </button>
        </div>
      )}

      {exercise.sets.filter((s) => s.setType !== 'warmup').every((s) => s.completed) && (
        <div className="text-center py-3">
          <span className="text-sm font-display font-semibold text-accent-green uppercase tracking-wider">
            Exercício concluído
          </span>
        </div>
      )}
    </div>
  );
}
