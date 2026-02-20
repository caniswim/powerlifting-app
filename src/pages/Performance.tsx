import { useState, useEffect, useMemo } from 'react';
import { useStorage } from '../contexts/StorageContext';
import {
  calculateDOTS,
  calculateWilks2,
  calculateIPFGL,
  getStrengthClass,
  getStrengthClassColor,
  getReadinessRecommendation,
  calculateAttemptStrategy,
  type StrengthClass,
  type ReadinessLevel,
} from '../utils/calculations';
import {
  compareToWorldRecord,
  getWeightClass,
  getNearbyWeightClasses,
  maleWorldRecords,
  type RecordComparison,
} from '../data/worldRecords';
import type { AthleteProfile, PersonalRecord } from '../types';
import { useSurveyTrends } from '../features/feedback/hooks/useSurveyTrends';
import {
  Trophy, Target, TrendingUp, Shield, ChevronDown, ChevronUp,
  Crosshair, Brain, Zap, AlertTriangle, Info,
} from 'lucide-react';

// Exercise IDs for the competition lifts in this program
const COMP_SQUAT = 'agachamento_low_bar';
const COMP_BENCH = 'supino_wide_grip';
const COMP_DEADLIFT = 'deadlift_sumo';

type Tab = 'scores' | 'records' | 'competition' | 'readiness';

export default function Performance() {
  const storage = useStorage();
  const [profile, setProfile] = useState<AthleteProfile>(() => storage.getProfile());
  const [activeTab, setActiveTab] = useState<Tab>('scores');

  // Get real PRs from training data
  const bestE1RMs = useMemo(() => {
    const squat = storage.getRecordForExercise(COMP_SQUAT);
    const bench = storage.getRecordForExercise(COMP_BENCH);
    const deadlift = storage.getRecordForExercise(COMP_DEADLIFT);
    return {
      squat: squat?.e1rm ?? profile.squat1RM,
      bench: bench?.e1rm ?? profile.bench1RM,
      deadlift: deadlift?.e1rm ?? profile.deadlift1RM,
      squatRecord: squat,
      benchRecord: bench,
      deadliftRecord: deadlift,
      fromTraining: !!(squat || bench || deadlift),
    };
  }, [storage, profile]);

  useEffect(() => {
    const p = storage.getProfile();
    const total = p.squat1RM + p.bench1RM + p.deadlift1RM;
    const dots = calculateDOTS(p.bodyweight, total);
    setProfile({ ...p, total, dots });
  }, [storage]);

  const tabs: { id: Tab; label: string; icon: typeof Trophy }[] = [
    { id: 'scores', label: 'SCORES', icon: Trophy },
    { id: 'records', label: 'RECORDS', icon: Target },
    { id: 'competition', label: 'COMP', icon: Crosshair },
    { id: 'readiness', label: 'PRONTIDÃO', icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-text-muted">
            POWERLIFTING TRACKER
          </h1>
          <div className="text-2xl font-display font-bold text-accent-gold uppercase tracking-wider">
            PERFORMANCE
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 gap-1 bg-bg-card border border-border rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 py-2 rounded-md text-[10px] font-display font-semibold tracking-wider uppercase transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent-gold/15 text-accent-gold border border-accent-gold/30'
                  : 'text-text-muted hover:text-text-secondary border border-transparent'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'scores' && <ScoresTab profile={profile} />}
        {activeTab === 'records' && <RecordsTab profile={profile} bestE1RMs={bestE1RMs} />}
        {activeTab === 'competition' && <CompetitionTab profile={profile} bestE1RMs={bestE1RMs} />}
        {activeTab === 'readiness' && <ReadinessTab />}
      </div>
    </div>
  );
}

// ─── Scores Tab ────────────────────────────────────────────────────
function ScoresTab({ profile }: { profile: AthleteProfile }) {
  const dots = profile.dots;
  const strengthClass = getStrengthClass(dots);
  const classColor = getStrengthClassColor(strengthClass);
  const [showAltScores, setShowAltScores] = useState(false);

  const classThresholds: { label: StrengthClass; dots: number; color: string }[] = [
    { label: 'Classe III', dots: 250, color: 'bg-text-muted' },
    { label: 'Classe II', dots: 300, color: 'bg-accent-green' },
    { label: 'Classe I', dots: 350, color: 'bg-accent-blue' },
    { label: 'Master', dots: 400, color: 'bg-accent-purple' },
    { label: 'Elite', dots: 450, color: 'bg-accent-red' },
    { label: 'Elite Mundial', dots: 500, color: 'bg-accent-gold' },
  ];

  const progressPercentage = Math.min((dots / 500) * 100, 100);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Strength Classification + DOTS (primary) */}
      <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">
            CLASSIFICAÇÃO DE FORÇA
          </div>
          <Shield size={16} className={classColor} />
        </div>

        <div className="flex justify-between items-baseline">
          <div className={`text-2xl font-display font-bold uppercase tracking-wider ${classColor}`}>
            {strengthClass}
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono font-bold text-accent-gold">{dots.toFixed(1)}</div>
            <div className="text-[10px] font-mono text-text-muted">DOTS</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-accent-green via-accent-blue via-accent-purple to-accent-gold rounded-full transition-all duration-700"
              style={{ width: `${progressPercentage}%` }}
            />
            {classThresholds.map((t) => (
              <div
                key={t.label}
                className="absolute top-0 h-full w-0.5 bg-bg-primary/50"
                style={{ left: `${(t.dots / 500) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[9px] font-mono text-text-muted">
            <span>250</span><span>300</span><span>350</span><span>400</span><span>450</span><span>500+</span>
          </div>
        </div>

        {/* Next target */}
        {dots < 500 && (() => {
          const next = classThresholds.find(t => t.dots > dots);
          if (!next) return null;
          return (
            <div className="flex items-center gap-2 text-xs font-display text-text-secondary">
              <TrendingUp size={14} className="text-accent-gold" />
              <span>Faltam <strong className="text-text-primary font-mono">{(next.dots - dots).toFixed(1)}</strong> DOTS para <strong className={next.color.replace('bg-', 'text-')}>{next.label}</strong></span>
            </div>
          );
        })()}
      </div>

      {/* Totals */}
      <div className="bg-bg-card border border-border rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-secondary font-display">Total</span>
          <span className="font-mono font-bold text-text-primary">{profile.total} kg</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-secondary font-display">Peso Corporal</span>
          <span className="font-mono font-bold text-text-primary">{profile.bodyweight} kg</span>
        </div>
        <div className="flex justify-between items-center text-sm border-t border-border pt-2">
          <span className="text-text-secondary font-display">Classe IPF</span>
          <span className="font-mono font-bold text-accent-gold">{getWeightClass(profile.bodyweight)?.label || '—'}</span>
        </div>
      </div>

      {/* Alternative Scores (collapsible) */}
      <div className="bg-bg-card border border-border rounded-lg overflow-hidden">
        <button
          onClick={() => setShowAltScores(!showAltScores)}
          className="w-full p-4 flex justify-between items-center"
        >
          <span className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">
            OUTROS SISTEMAS DE PONTUAÇÃO
          </span>
          {showAltScores ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
        </button>
        {showAltScores && (
          <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
            <div className="flex items-start gap-2 text-xs text-text-muted font-display">
              <Info size={14} className="flex-shrink-0 mt-0.5" />
              <span>Diferentes federações usam diferentes fórmulas. DOTS é o padrão IPF atual. As outras são mostradas para referência.</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-bg-tertiary rounded-lg p-3 text-center">
                <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted mb-1">WILKS-2</div>
                <div className="text-xl font-mono font-bold text-text-primary">{calculateWilks2(profile.bodyweight, profile.total).toFixed(1)}</div>
                <div className="text-[9px] text-text-muted font-display">Revisão 2020</div>
              </div>
              <div className="bg-bg-tertiary rounded-lg p-3 text-center">
                <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted mb-1">IPF GL</div>
                <div className="text-xl font-mono font-bold text-text-primary">{calculateIPFGL(profile.bodyweight, profile.total).toFixed(1)}</div>
                <div className="text-[9px] text-text-muted font-display">Goodlift Points</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Records Tab ───────────────────────────────────────────────────
interface BestE1RMs {
  squat: number;
  bench: number;
  deadlift: number;
  squatRecord: PersonalRecord | undefined;
  benchRecord: PersonalRecord | undefined;
  deadliftRecord: PersonalRecord | undefined;
  fromTraining: boolean;
}

function RecordsTab({ profile, bestE1RMs }: { profile: AthleteProfile; bestE1RMs: BestE1RMs }) {
  const comparison = compareToWorldRecord(
    profile.bodyweight,
    bestE1RMs.squat,
    bestE1RMs.bench,
    bestE1RMs.deadlift,
  );

  const nearby = getNearbyWeightClasses(profile.bodyweight);
  const [showNearby, setShowNearby] = useState(false);

  if (!comparison) {
    return (
      <div className="bg-bg-card border border-border rounded-lg p-6 text-center animate-fade-in">
        <Trophy size={32} className="text-text-muted mx-auto mb-2" />
        <p className="text-sm text-text-muted font-display">
          Configure seu peso corporal e 1RMs nas Configurações para comparar com recordes mundiais.
        </p>
      </div>
    );
  }

  // Data source indicator
  const dataSource = bestE1RMs.fromTraining
    ? 'Baseado nos PRs reais dos treinos'
    : 'Baseado nos valores configurados (sem dados de treino)';

  const lifts: { key: keyof RecordComparison; label: string; color: string }[] = [
    { key: 'squat', label: 'AGACHAMENTO', color: 'text-accent-red' },
    { key: 'bench', label: 'SUPINO', color: 'text-accent-gold' },
    { key: 'deadlift', label: 'TERRA', color: 'text-accent-blue' },
    { key: 'total', label: 'TOTAL', color: 'text-text-primary' },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Weight Class Header */}
      <div className="bg-bg-card border border-accent-gold/30 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">
              CLASSE DE PESO IPF
            </div>
            <div className="text-3xl font-mono font-bold text-accent-gold">
              {comparison.weightClass}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">
              VS RECORDE MUNDIAL
            </div>
            <div className="text-2xl font-mono font-bold text-text-primary">
              {comparison.total.percentage}%
            </div>
          </div>
        </div>
        <div className="text-[10px] font-display text-text-muted mt-2">
          {dataSource}
        </div>
      </div>

      {/* Individual Lift Comparisons */}
      {lifts.map(({ key, label, color }) => {
        const data = comparison[key] as RecordComparison['squat'];
        const pct = data.percentage;
        const barColor =
          pct >= 100 ? 'bg-accent-gold' :
          pct >= 90 ? 'bg-accent-red' :
          pct >= 80 ? 'bg-accent-purple' :
          pct >= 70 ? 'bg-accent-blue' :
          'bg-accent-green';

        return (
          <div key={key} className="bg-bg-card border border-border rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-xs font-display font-semibold tracking-wider uppercase ${color}`}>{label}</span>
              <span className="text-xs font-mono text-text-muted">
                {pct >= 100 ? 'RECORDE SUPERADO!' : `Faltam ${data.deficit}kg`}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <div>
                <span className="text-2xl font-mono font-bold text-text-primary">{data.current}</span>
                <span className="text-sm text-text-muted font-mono ml-1">kg</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono text-text-muted">WR: </span>
                <span className="text-sm font-mono font-bold text-accent-gold">{data.record}</span>
                <span className="text-sm text-text-muted font-mono ml-0.5">kg</span>
              </div>
            </div>
            <div className="h-2.5 bg-bg-tertiary rounded-full overflow-hidden">
              <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
            <div className="text-right text-xs font-mono font-bold" style={{ color: pct >= 100 ? '#D4A017' : undefined }}>{pct}%</div>
          </div>
        );
      })}

      {/* Nearby Weight Classes */}
      {nearby && (
        <div className="bg-bg-card border border-border rounded-lg overflow-hidden">
          <button onClick={() => setShowNearby(!showNearby)} className="w-full p-4 flex justify-between items-center">
            <span className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">ANÁLISE DE CLASSES PRÓXIMAS</span>
            {showNearby ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
          </button>
          {showNearby && (
            <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
              {nearby.lower && <NearbyClassCard label={`Descer para ${nearby.lower.label}`} weightClass={nearby.lower.label} maxBW={nearby.lower.maxBW} currentBW={profile.bodyweight} direction="down" />}
              <div className="text-xs font-display text-accent-gold font-semibold text-center uppercase tracking-wider">Atual: {nearby.current.label}</div>
              {nearby.upper && <NearbyClassCard label={`Subir para ${nearby.upper.label}`} weightClass={nearby.upper.label} maxBW={nearby.upper.maxBW} currentBW={profile.bodyweight} direction="up" />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NearbyClassCard({ label, weightClass, maxBW, currentBW, direction }: {
  label: string; weightClass: string; maxBW: number; currentBW: number; direction: 'up' | 'down';
}) {
  const diff = direction === 'down' ? currentBW - maxBW : maxBW - currentBW;
  const records = maleWorldRecords.find(r => r.weightClass === weightClass);

  return (
    <div className="bg-bg-tertiary rounded-lg p-3 space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm font-display text-text-secondary">{label}</span>
        <span className={`text-xs font-mono font-bold ${direction === 'down' ? 'text-accent-red' : 'text-accent-green'}`}>
          {direction === 'down' ? `-${diff.toFixed(1)}kg` : `+${diff.toFixed(1)}kg`}
        </span>
      </div>
      {records && <div className="text-[10px] font-mono text-text-muted">WR Total: {records.total}kg (S:{records.squat} B:{records.bench} D:{records.deadlift})</div>}
    </div>
  );
}

// ─── Competition Tab ───────────────────────────────────────────────
function CompetitionTab({ profile, bestE1RMs }: { profile: AthleteProfile; bestE1RMs: BestE1RMs }) {
  const [conservative, setConservative] = useState(false);
  const [competitionDate, setCompetitionDate] = useState('');

  // Use real training PRs for attempt selection, with fallback to profile
  const squatStrategy = calculateAttemptStrategy(bestE1RMs.squat, 2.5, conservative);
  const benchStrategy = calculateAttemptStrategy(bestE1RMs.bench, 2.5, conservative);
  const deadliftStrategy = calculateAttemptStrategy(bestE1RMs.deadlift, 2.5, conservative);

  const projectedTotal = squatStrategy.third + benchStrategy.third + deadliftStrategy.third;
  const projectedSafeTotal = squatStrategy.second + benchStrategy.second + deadliftStrategy.second;

  const weeksOut = competitionDate
    ? Math.max(0, Math.ceil((new Date(competitionDate).getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000)))
    : null;

  const liftStrategies: { label: string; color: string; strategy: typeof squatStrategy; best: number; record?: PersonalRecord }[] = [
    { label: 'AGACHAMENTO', color: 'border-accent-red/30', strategy: squatStrategy, best: bestE1RMs.squat, record: bestE1RMs.squatRecord },
    { label: 'SUPINO', color: 'border-accent-gold/30', strategy: benchStrategy, best: bestE1RMs.bench, record: bestE1RMs.benchRecord },
    { label: 'TERRA', color: 'border-accent-blue/30', strategy: deadliftStrategy, best: bestE1RMs.deadlift, record: bestE1RMs.deadliftRecord },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Data source warning */}
      {!bestE1RMs.fromTraining && (
        <div className="bg-accent-gold/10 border border-accent-gold/30 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle size={16} className="text-accent-gold flex-shrink-0 mt-0.5" />
          <div className="text-xs font-display text-accent-gold">
            Usando valores manuais das Configurações. As tentativas serão mais precisas quando houver dados reais de treino.
          </div>
        </div>
      )}

      {/* Competition Date */}
      <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">DATA DA COMPETIÇÃO</div>
        <input
          type="date" value={competitionDate} onChange={(e) => setCompetitionDate(e.target.value)}
          className="w-full h-11 bg-bg-input border border-border-light rounded-md px-3 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-gold transition-colors"
        />
        {weeksOut !== null && (
          <div className="flex items-center gap-2">
            <Crosshair size={14} className="text-accent-gold" />
            <span className="text-sm font-display text-text-secondary">
              <strong className="text-accent-gold font-mono">{weeksOut}</strong> semanas para a competição
            </span>
          </div>
        )}
        {weeksOut !== null && weeksOut <= 4 && weeksOut > 1 && (
          <div className="bg-accent-red/10 border border-accent-red/30 rounded p-2 text-xs font-display text-accent-red">
            Fase de peaking! Reduza volume e mantenha intensidade alta.
          </div>
        )}
        {weeksOut !== null && weeksOut <= 1 && (
          <div className="bg-accent-gold/10 border border-accent-gold/30 rounded p-2 text-xs font-display text-accent-gold">
            Semana da competição! Foco em recuperação total. Corte de peso se necessário.
          </div>
        )}
      </div>

      {/* Strategy Mode */}
      <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">ESTRATÉGIA DE TENTATIVAS</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setConservative(false)}
            className={`py-2 rounded-md text-xs font-display font-semibold uppercase tracking-wider transition-colors ${
              !conservative ? 'bg-accent-red/15 text-accent-red border border-accent-red/30' : 'bg-bg-tertiary text-text-muted border border-border'
            }`}
          >Agressiva</button>
          <button
            onClick={() => setConservative(true)}
            className={`py-2 rounded-md text-xs font-display font-semibold uppercase tracking-wider transition-colors ${
              conservative ? 'bg-accent-green/15 text-accent-green border border-accent-green/30' : 'bg-bg-tertiary text-text-muted border border-border'
            }`}
          >Conservadora</button>
        </div>
      </div>

      {/* Attempt Cards */}
      {liftStrategies.map(({ label, color, strategy, best, record }) => (
        <div key={label} className={`bg-bg-card border ${color} rounded-lg p-4 space-y-3`}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-display font-semibold tracking-wider uppercase text-text-secondary">{label}</span>
            <div className="text-right">
              <span className="text-xs font-mono text-text-muted">Melhor e1RM: {best.toFixed(1)}kg</span>
              {record && (
                <div className="text-[9px] font-mono text-text-muted">
                  ({record.weight}x{record.reps} @RPE{record.rpe} — {record.date})
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { num: '1a', weight: strategy.opener, rpe: strategy.openerRPE, label: 'Opener' },
              { num: '2a', weight: strategy.second, rpe: strategy.secondRPE, label: '2nd' },
              { num: '3a', weight: strategy.third, rpe: strategy.thirdRPE, label: '3rd' },
            ].map((attempt) => (
              <div key={attempt.num} className="bg-bg-tertiary rounded-lg p-2 text-center">
                <div className="text-[9px] font-display text-text-muted uppercase tracking-wider">{attempt.num} — {attempt.label}</div>
                <div className="text-xl font-mono font-bold text-text-primary mt-0.5">{attempt.weight}</div>
                <div className="text-[9px] font-mono text-text-muted">RPE {attempt.rpe}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Projected Totals */}
      <div className="bg-bg-card border border-accent-gold/30 rounded-lg p-4 space-y-3">
        <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">TOTAL PROJETADO</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-[9px] font-display text-text-muted uppercase tracking-wider">SEGURO (2as tentativas)</div>
            <div className="text-2xl font-mono font-bold text-accent-green">{projectedSafeTotal}<span className="text-xs text-text-muted ml-1">kg</span></div>
          </div>
          <div className="text-center">
            <div className="text-[9px] font-display text-text-muted uppercase tracking-wider">MÁXIMO (3as tentativas)</div>
            <div className="text-2xl font-mono font-bold text-accent-gold">{projectedTotal}<span className="text-xs text-text-muted ml-1">kg</span></div>
          </div>
        </div>
        <div className="text-xs font-display text-text-muted text-center border-t border-border pt-2">
          DOTS projetado: <strong className="text-accent-gold font-mono">{calculateDOTS(profile.bodyweight, projectedTotal).toFixed(1)}</strong>
        </div>
      </div>

      <MeetDayChecklist />
    </div>
  );
}

function MeetDayChecklist() {
  const [expanded, setExpanded] = useState(false);
  const items = [
    { category: 'EQUIPAMENTO', list: ['Singlet aprovado', 'Cinto (10cm max)', 'Meias longas (terra)', 'Sapatilha/tênis', 'Munhequeiras', 'Joelheiras (sem wraps)'] },
    { category: 'NUTRIÇÃO', list: ['Refeição 2-3h antes', 'Carboidratos rápidos', 'Água e eletrólitos', 'Snacks entre tentativas', 'Cafeína (se usa)'] },
    { category: 'AQUECIMENTO', list: ['Chegar 1h antes do voo', 'Aquecimento geral 10min', 'Mobilidade específica', 'Rampas progressivas', 'Último aquecimento ~85% do opener'] },
  ];

  return (
    <div className="bg-bg-card border border-border rounded-lg overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 flex justify-between items-center">
        <span className="text-xs font-display font-semibold tracking-wider uppercase text-text-muted">CHECKLIST DIA DA COMPETIÇÃO</span>
        {expanded ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-3">
          {items.map((group) => (
            <div key={group.category} className="space-y-1.5">
              <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-accent-gold">{group.category}</div>
              {group.list.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-display text-text-secondary">
                  <div className="w-3 h-3 border border-border-light rounded-sm flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Readiness Tab (uses useSurveyTrends as single source of truth) ──
function ReadinessTab() {
  const storage = useStorage();
  const trends = useSurveyTrends();

  const latestPreSurveys = useMemo(() => storage.getRecentPreSurveys(1), [storage]);
  const hasPain = latestPreSurveys.length > 0 && latestPreSurveys[0].hasPain;

  const rec = useMemo(() => {
    if (!trends.hasSurveyData) return null;
    return getReadinessRecommendation(trends.readinessScore, hasPain);
  }, [trends, hasPain]);

  const levelColors: Record<ReadinessLevel, string> = {
    high: 'text-accent-green',
    normal: 'text-accent-blue',
    reduced: 'text-accent-gold',
    low: 'text-accent-red',
  };

  const levelBg: Record<ReadinessLevel, string> = {
    high: 'bg-accent-green/10 border-accent-green/30',
    normal: 'bg-accent-blue/10 border-accent-blue/30',
    reduced: 'bg-accent-gold/10 border-accent-gold/30',
    low: 'bg-accent-red/10 border-accent-red/30',
  };

  if (!trends.hasSurveyData) {
    return (
      <div className="bg-bg-card border border-border rounded-lg p-6 text-center animate-fade-in">
        <Brain size={32} className="text-text-muted mx-auto mb-2" />
        <p className="text-sm text-text-muted font-display">
          Preencha o survey pré-treino para ver recomendações de prontidão.
        </p>
        <p className="text-xs text-text-muted font-display mt-1">
          Os dados são coletados automaticamente antes de cada treino.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Readiness Level */}
      <div className={`border rounded-lg p-4 space-y-3 ${rec ? levelBg[rec.level] : 'bg-bg-card border-border'}`}>
        <div className="flex justify-between items-center">
          <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">
            PRONTIDÃO PARA TREINO
          </div>
          <Zap size={16} className={rec ? levelColors[rec.level] : 'text-text-muted'} />
        </div>
        <div className="flex justify-between items-baseline">
          <div className={`text-2xl font-display font-bold uppercase tracking-wider ${rec ? levelColors[rec.level] : 'text-text-muted'}`}>
            {rec?.label ?? '—'}
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-text-primary">{trends.readinessScore.toFixed(1)}</div>
            <div className="text-[9px] font-mono text-text-muted">/10</div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {rec && (
        <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
          <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">
            SUGESTÕES PARA HOJE
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">Carga</div>
              <p className="text-sm font-display text-text-secondary">{rec.loadGuidance}</p>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">Volume</div>
              <p className="text-sm font-display text-text-secondary">{rec.volumeGuidance}</p>
            </div>
            {rec.rpeAdjustment !== 0 && (
              <div className="bg-bg-tertiary rounded-lg p-3 flex justify-between items-center">
                <span className="text-xs font-display text-text-secondary">Ajuste RPE sugerido</span>
                <span className={`text-lg font-mono font-bold ${levelColors[rec.level]}`}>
                  {rec.rpeAdjustment > 0 ? '+' : ''}{rec.rpeAdjustment}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Survey Factors */}
      <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">
          FATORES ({trends.hasEnoughData ? 'média últimas sessões' : 'dados limitados'})
        </div>
        {[
          { label: 'Sono', value: trends.averages.sleepQuality, color: 'bg-accent-blue' },
          { label: 'Energia', value: trends.averages.energyLevel, color: 'bg-accent-green' },
          { label: 'Estresse', value: trends.averages.stressLevel, color: 'bg-accent-red' },
          { label: 'Motivação', value: trends.averages.motivation, color: 'bg-accent-purple' },
        ].map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-display text-text-secondary">{item.label}</span>
              <span className="font-mono text-text-muted">{item.value.toFixed(1)}/10</span>
            </div>
            <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
              <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${(item.value / 10) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Scientific rationale */}
      {rec && (
        <div className="bg-bg-card border border-border rounded-lg p-4 space-y-2">
          <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">
            RACIONAL
          </div>
          <p className="text-xs font-display text-text-muted leading-relaxed">
            {rec.rationale}
          </p>
        </div>
      )}

      {/* Alerts from survey trends */}
      {trends.alerts.length > 0 && (
        <div className="bg-bg-card border border-border rounded-lg p-4 space-y-2">
          <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">ALERTAS</div>
          {trends.alerts.map((alert, i) => (
            <div key={i} className={`flex items-center gap-2 text-xs font-display ${alert.type === 'danger' ? 'text-accent-red' : 'text-accent-gold'}`}>
              <AlertTriangle size={12} />
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
