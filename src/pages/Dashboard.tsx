import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, getWorkouts, getRecords, getCurrentWeek } from '../services/storage';
import { calculateDOTS } from '../utils/calculations';
import { exerciseNames } from '../data/exerciseMuscleMap';
import type { AthleteProfile, PersonalRecord, PrescribedWeek } from '../types';

// Lazy import programData to avoid blocking if not yet generated
let programDataCache: PrescribedWeek[] | null = null;
async function loadProgramData() {
  if (programDataCache) return programDataCache;
  try {
    const mod = await import('../data/programData');
    programDataCache = mod.programData;
    return programDataCache;
  } catch {
    return [];
  }
}

const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const dayTypeLabels = {
  squat_emphasis: 'LOWER — Squat',
  bench_emphasis: 'UPPER — Bench',
  deadlift_emphasis: 'LOWER — Deadlift',
  bench_volume: 'UPPER — Volume',
} as const;

export default function Dashboard() {
  const [profile, setProfile] = useState<AthleteProfile>(getProfile);
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek);
  const [weekData, setWeekData] = useState<PrescribedWeek | null>(null);
  const [recentPRs, setRecentPRs] = useState<PersonalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = getProfile();
    const total = p.squat1RM + p.bench1RM + p.deadlift1RM;
    const dots = calculateDOTS(p.bodyweight, total);
    setProfile({ ...p, total, dots });
    setCurrentWeek(getCurrentWeek());

    // Load records from last 30 days
    const records = getRecords();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = records.filter(
      (r) => new Date(r.date) >= thirtyDaysAgo
    );
    setRecentPRs(recent);

    // Load program data
    loadProgramData().then((data) => {
      const week = data.find((w) => w.weekNumber === getCurrentWeek());
      setWeekData(week || null);
      setLoading(false);
    });
  }, []);

  const today = new Date().getDay();
  const todayDayType = today === 1 ? 'squat_emphasis'
    : today === 2 ? 'bench_emphasis'
    : today === 4 ? 'deadlift_emphasis'
    : today === 5 ? 'bench_volume'
    : null;

  const todayWorkout = useMemo(() => {
    if (!weekData || !todayDayType) return null;
    return weekData.days.find((d) => d.dayType === todayDayType) || null;
  }, [weekData, todayDayType]);

  const [isNextDeload, setIsNextDeload] = useState(false);
  useEffect(() => {
    loadProgramData().then((data) => {
      const nextWeek = data.find((w) => w.weekNumber === currentWeek + 1);
      setIsNextDeload(nextWeek?.isDeload ?? false);
    });
  }, [currentWeek]);

  // Check completed workouts this week
  const weekWorkouts = getWorkouts().filter((w) => w.weekNumber === currentWeek);
  const completedToday = weekWorkouts.some(
    (w) => w.dayType === todayDayType && w.completed
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-text-muted">
            POWERLIFTING TRACKER
          </h1>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-mono font-bold text-accent-gold">
              S{currentWeek}
            </span>
            <span className="text-sm font-display text-text-secondary">
              / 52
            </span>
          </div>
          {weekData && (
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 text-xs font-display font-semibold tracking-wider uppercase border rounded ${
                weekData.isDeload
                  ? 'bg-accent-blue/20 text-accent-blue border-accent-blue/30'
                  : weekData.blockType === 'accumulation'
                  ? 'bg-accent-green/20 text-accent-green border-accent-green/30'
                  : weekData.blockType === 'transmutation'
                  ? 'bg-accent-gold/20 text-accent-gold border-accent-gold/30'
                  : 'bg-accent-red/20 text-accent-red border-accent-red/30'
              }`}>
                {weekData.blockType === 'accumulation' ? 'ACUMULAÇÃO' :
                 weekData.blockType === 'transmutation' ? 'TRANSMUTAÇÃO' :
                 weekData.blockType === 'intensification' ? 'INTENSIFICAÇÃO' :
                 weekData.blockType === 'realization' ? 'REALIZAÇÃO' :
                 'DELOAD'}
              </span>
              <span className="text-xs text-text-muted font-display">
                Macro {weekData.macrocycle} — {weekData.blockName}
              </span>
            </div>
          )}
        </div>

        {/* Deload Warning */}
        {isNextDeload && (
          <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-3 flex items-center gap-3">
            <span className="text-accent-blue text-lg">⚡</span>
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
        {weekData?.isDeload && (
          <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-3 flex items-center gap-3">
            <span className="text-accent-blue text-2xl">◇</span>
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

        {/* Today's Workout */}
        {todayDayType ? (
          <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">
                  {dayNames[today]} — HOJE
                </div>
                <div className="text-sm font-display font-bold text-text-primary uppercase tracking-wider mt-0.5">
                  {dayTypeLabels[todayDayType]}
                </div>
              </div>
              {completedToday && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-display font-semibold tracking-wider uppercase border rounded bg-accent-green/20 text-accent-green border-accent-green/30">
                  CONCLUÍDO
                </span>
              )}
            </div>

            {todayWorkout && (
              <div className="space-y-1.5 border-t border-border pt-3">
                {todayWorkout.exercises.map((ex, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-text-secondary font-display truncate pr-2">
                      {ex.exerciseName}
                    </span>
                    <span className="text-text-muted font-mono text-xs whitespace-nowrap">
                      {ex.sets}×{ex.reps} @{ex.rpe}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Link
              to="/workout"
              className={`block w-full h-14 rounded-lg font-display font-bold text-lg uppercase tracking-wider text-center leading-[3.5rem] transition-all ${
                completedToday
                  ? 'bg-bg-tertiary text-text-muted border border-border'
                  : 'bg-accent-gold text-black hover:bg-accent-gold-bright active:scale-[0.98]'
              }`}
            >
              {completedToday ? 'VER TREINO' : 'INICIAR TREINO'}
            </Link>
          </div>
        ) : (
          <div className="bg-bg-card border border-border rounded-lg p-6 text-center">
            <div className="text-2xl mb-2">◇</div>
            <div className="text-sm font-display font-semibold text-text-secondary uppercase tracking-wider">
              DIA DE DESCANSO
            </div>
            <div className="text-xs text-text-muted font-display mt-1">
              Caminhada 20-45min. Mobilidade opcional.
            </div>
          </div>
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

        {/* Week Progress */}
        <div className="bg-bg-card border border-border rounded-lg p-4">
          <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted mb-3">
            PROGRESSO DA SEMANA
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['SEG', 'TER', 'QUI', 'SEX'].map((day, i) => {
              const dayTypes = ['squat_emphasis', 'bench_emphasis', 'deadlift_emphasis', 'bench_volume'] as const;
              const isCompleted = weekWorkouts.some(
                (w) => w.dayType === dayTypes[i] && w.completed
              );
              const isToday =
                (today === 1 && i === 0) ||
                (today === 2 && i === 1) ||
                (today === 4 && i === 2) ||
                (today === 5 && i === 3);

              return (
                <div
                  key={day}
                  className={`text-center py-2 rounded border ${
                    isCompleted
                      ? 'bg-accent-green/20 border-accent-green/30 text-accent-green'
                      : isToday
                      ? 'bg-accent-gold/10 border-accent-gold/30 text-accent-gold'
                      : 'bg-bg-tertiary border-border text-text-muted'
                  }`}
                >
                  <div className="text-[10px] font-display font-semibold tracking-wider">
                    {day}
                  </div>
                  <div className="text-lg mt-0.5">
                    {isCompleted ? '✓' : isToday ? '◆' : '·'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Block Objective */}
        {weekData && !weekData.isDeload && (
          <div className="bg-bg-card border border-border rounded-lg p-4">
            <div className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted mb-1">
              OBJETIVO DO BLOCO
            </div>
            <p className="text-sm text-text-secondary font-display leading-relaxed">
              {weekData.blockObjective}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
