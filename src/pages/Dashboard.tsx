import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStorage } from '../contexts/StorageContext';
import {
  getSessionData,
  getNextTrainingDate,
  shouldShowRestWarning,
  getRestDaysAfterSession,
  getTotalSessions,
  getTotalWeeks,
  getProgram,
} from '../data/programData';
import { calculateDOTS } from '../utils/calculations';
import { exerciseNames } from '../data/exerciseMuscleMap';
import type { AthleteProfile, PersonalRecord, ProgramSession } from '../types';
import { Zap, Battery, Check, Circle, Minus } from 'lucide-react';
import { dayTypeShortLabels, dayTypeAbbrev } from '../domain/dayTypeLabels';
import { blockTypeLabels, blockTypeBadgeClass } from '../domain/blockTypeConfig';
import { useSurveyTrends } from '../features/feedback/hooks/useSurveyTrends';
import { ReadinessIndicator } from '../features/feedback/components/ReadinessIndicator';
import { TrendSparklines } from '../features/feedback/components/TrendSparklines';
import { AlertsBanner } from '../features/feedback/components/AlertsBanner';

export default function Dashboard() {
  const storage = useStorage();
  const programId = storage.getActiveProgramId();
  const program = getProgram(programId);

  const [profile, setProfile] = useState<AthleteProfile>(() => storage.getProfile());
  const [sessionIndex, setSessionIdx] = useState(() => storage.getSessionIndex());
  const [nextSession, setNextSession] = useState<ProgramSession | null>(null);
  const [recentPRs, setRecentPRs] = useState<PersonalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNextDeload, setIsNextDeload] = useState(false);
  const [recommendedDate, setRecommendedDate] = useState<Date | null>(null);
  const [isRestDay, setIsRestDay] = useState(false);
  const [lastWorkoutDateStr, setLastWorkoutDateStr] = useState<string | null>(null);

  const totalSessions = getTotalSessions(programId);
  const totalWeeks = getTotalWeeks(programId);
  const currentWeek = nextSession?.weekNumber ?? storage.getCurrentWeek();
  // A semana do programa pode ter 4 ou 5 dias, então a grade do ciclo vem do
  // próprio programa em vez de uma constante de 6 sessões.
  const cycleDays = nextSession?.week.days ?? program.weeks[0].days;
  const cyclePosition = nextSession?.dayIndex ?? 0;

  const trends = useSurveyTrends();

  useEffect(() => {
    const p = storage.getProfile();
    const total = p.squat1RM + p.bench1RM + p.deadlift1RM;
    const dots = calculateDOTS(p.bodyweight, total);
    setProfile({ ...p, total, dots });

    const idx = storage.getSessionIndex();
    setSessionIdx(idx);

    // Load records from last 30 days
    const records = storage.getRecords();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = records.filter(
      (r) => new Date(r.date) >= thirtyDaysAgo
    );
    setRecentPRs(recent);

    // Load session data
    const session = getSessionData(idx, programId);
    setNextSession(session);

    // Check rest / recommended date
    const lastCompleted = storage.getLastCompletedWorkout();
    if (lastCompleted) {
      setLastWorkoutDateStr(lastCompleted.date);
      const restDays = lastCompleted.sessionIndex !== undefined
        ? getRestDaysAfterSession(lastCompleted.sessionIndex, lastCompleted.programId)
        : lastCompleted.dayIndex === 5 ? 1 : 0;
      setRecommendedDate(getNextTrainingDate(lastCompleted.date, restDays));
      setIsRestDay(shouldShowRestWarning(lastCompleted.date, restDays));
    }

    // Check if next week is deload
    if (session) {
      const nextWeek = program.weeks.find((w) => w.weekNumber === session.weekNumber + 1);
      setIsNextDeload(nextWeek?.isDeload ?? false);
    }

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (d: Date) => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    return `${days[d.getDay()]}, ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const formatLastWorkout = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    return `${diffDays} dias atrás`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const programComplete = sessionIndex >= totalSessions;

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-text-muted">
            {program.name}
          </h1>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-mono font-bold text-accent-gold">
              S{currentWeek}
            </span>
            <span className="text-sm font-display text-text-secondary">
              / {totalWeeks}
            </span>
            <span className="text-xs font-mono text-text-muted ml-2">
              Sessão {Math.min(sessionIndex + 1, totalSessions)}/{totalSessions}
            </span>
          </div>
          {nextSession && (
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 text-xs font-display font-semibold tracking-wider uppercase border rounded ${
                blockTypeBadgeClass[nextSession.week.blockType]
              }`}>
                {blockTypeLabels[nextSession.week.blockType]}
              </span>
              <span className="text-xs text-text-muted font-display">
                Macro {nextSession.week.macrocycle} — {nextSession.week.blockName}
              </span>
            </div>
          )}
        </div>

        {/* Deload Warning */}
        {isNextDeload && (
          <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-3 flex items-center gap-3">
            <Zap size={20} className="text-accent-blue flex-shrink-0" />
            <div>
              <p className="text-sm font-display font-semibold text-accent-blue uppercase tracking-wider">
                Próxima semana: DELOAD
              </p>
              <p className="text-xs text-text-muted font-display">
                Reduza volume e intensidade. Mantenha frequência.
              </p>
            </div>
          </div>
        )}

        {/* Current Deload Banner */}
        {nextSession?.week.isDeload && (
          <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-3 flex items-center gap-3">
            <Battery size={24} className="text-accent-blue flex-shrink-0" />
            <div>
              <p className="text-sm font-display font-semibold text-accent-blue uppercase tracking-wider">
                SEMANA DE DELOAD
              </p>
              <p className="text-xs text-text-muted font-display">
                50% do volume. RPE 5-6. Recuperação ativa.
              </p>
            </div>
          </div>
        )}

        {/* e1RM Cards */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'SQT', value: profile.squat1RM, color: 'text-accent-red' },
            { label: 'BNC', value: profile.bench1RM, color: 'text-accent-gold' },
            { label: 'DLF', value: profile.deadlift1RM, color: 'text-accent-blue' },
          ].map((lift) => (
            <div key={lift.label} className="bg-bg-card border border-border rounded-lg p-3 text-center">
              <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted mb-1">
                {lift.label}
              </div>
              <div className={`text-2xl font-mono font-bold ${lift.color}`}>
                {lift.value}
              </div>
              <div className="text-[10px] text-text-muted font-mono">kg</div>
            </div>
          ))}
        </div>

        {/* Total + DOTS */}
        <div className="bg-bg-card border border-border rounded-lg p-4 flex justify-between items-center">
          <div>
            <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">
              TOTAL
            </div>
            <div className="text-3xl font-mono font-bold text-text-primary">
              {profile.total}<span className="text-sm text-text-muted ml-1">kg</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">
              DOTS
            </div>
            <div className="text-2xl font-mono font-bold text-accent-gold">
              {profile.dots.toFixed(1)}
            </div>
            <div className="text-[10px] text-text-muted font-display">
              @ {profile.bodyweight}kg
            </div>
          </div>
        </div>

        {/* Next Workout Card */}
        {!programComplete && nextSession ? (
          <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">
                  PRÓXIMO TREINO
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-display font-bold text-text-primary uppercase tracking-wider">
                    {dayTypeShortLabels[nextSession.day.dayType]}
                  </span>
                  {nextSession.day.dayType === 'arms_shoulders' && (
                    <span className="text-[9px] font-display font-bold text-accent-purple bg-accent-purple/10 px-1.5 py-0.5 rounded tracking-wider ml-1">
                      MINI ~20min
                    </span>
                  )}
                </div>
              </div>
              {recommendedDate && (
                <div className="text-right">
                  <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">
                    RECOMENDADO
                  </div>
                  <div className={`text-xs font-mono font-semibold ${isRestDay ? 'text-accent-gold' : 'text-accent-green'}`}>
                    {formatDate(recommendedDate)}
                  </div>
                </div>
              )}
            </div>

            {lastWorkoutDateStr && (
              <div className="text-xs font-mono text-text-muted">
                Último treino: {formatLastWorkout(lastWorkoutDateStr)}
              </div>
            )}

            {/* Exercise preview */}
            <div className="space-y-1.5 border-t border-border pt-3">
              {nextSession.day.exercises.map((ex, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary font-display truncate pr-2">
                    {ex.exerciseName}
                  </span>
                  <span className="text-text-muted font-mono text-xs whitespace-nowrap">
                    {ex.sets}x{ex.reps} @{ex.rpe}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/workout"
              className={`block w-full h-14 rounded-lg font-display font-bold text-lg uppercase tracking-wider text-center leading-[3.5rem] transition-all ${
                isRestDay
                  ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/40'
                  : 'bg-accent-gold text-black hover:bg-accent-gold-bright active:scale-[0.98]'
              }`}
            >
              {isRestDay ? 'TREINAR (DIA DE DESCANSO)' : 'INICIAR TREINO'}
            </Link>
          </div>
        ) : programComplete ? (
          <div className="bg-bg-card border border-accent-gold/30 rounded-lg p-6 text-center">
            <div className="text-lg font-display font-bold text-accent-gold uppercase tracking-wider">
              PROGRAMA COMPLETO!
            </div>
            <div className="text-xs text-text-muted font-display mt-1">
              Todas as {totalSessions} sessões foram concluídas.
            </div>
          </div>
        ) : null}

        {/* Prontidão e tendências — derivadas dos surveys, sem IA */}
        {trends.hasSurveyData && (
          <>
            <ReadinessIndicator trends={trends} />
            {trends.alerts.length > 0 && <AlertsBanner alerts={trends.alerts} />}
            {trends.hasEnoughData && <TrendSparklines data={trends.sparklineData} />}
          </>
        )}

        {/* Recent PRs */}
        {recentPRs.length > 0 && (
          <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
            <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-accent-gold">
              PRs RECENTES (30 DIAS)
            </div>
            <div className="space-y-2">
              {recentPRs.slice(0, 5).map((pr, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary font-display truncate pr-2">
                    {exerciseNames[pr.exerciseId] || pr.exerciseId}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-accent-gold">
                      {pr.e1rm.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">e1RM</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cycle Progress — dias da semana atual do programa */}
        <div className="bg-bg-card border border-border rounded-lg p-4">
          <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted mb-3">
            PROGRESSO DA SEMANA — {cycleDays.length} DIAS
          </div>
          <div className={`grid gap-2 ${cycleDays.length === 5 ? 'grid-cols-5' : 'grid-cols-4'}`}>
            {cycleDays.map((day, i) => {
              const label = dayTypeAbbrev[day.dayType];
              const isCompleted = i < cyclePosition;
              const isCurrent = i === cyclePosition;
              const isArmDay = day.dayType === 'arms_hypertrophy' || day.dayType === 'arms_shoulders';

              return (
                <div
                  key={`${label}-${i}`}
                  className={`text-center py-2 rounded border ${
                    isCompleted
                      ? 'bg-accent-green/20 border-accent-green/30 text-accent-green'
                      : isCurrent && isArmDay
                      ? 'bg-accent-purple/10 border-accent-purple/30 text-accent-purple'
                      : isCurrent
                      ? 'bg-accent-gold/10 border-accent-gold/30 text-accent-gold'
                      : 'bg-bg-tertiary border-border text-text-muted'
                  }`}
                >
                  <div className="text-[10px] font-display font-semibold tracking-wider">
                    {label}
                  </div>
                  <div className="flex items-center justify-center mt-0.5">
                    {isCompleted ? <Check size={18} /> : isCurrent ? <Circle size={10} fill="currentColor" /> : <Minus size={14} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Block Objective */}
        {nextSession && !nextSession.week.isDeload && (
          <div className="bg-bg-card border border-border rounded-lg p-4">
            <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted mb-1">
              OBJETIVO DO BLOCO
            </div>
            <p className="text-sm text-text-secondary font-display leading-relaxed">
              {nextSession.week.blockObjective}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
