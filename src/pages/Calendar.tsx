import { useState, useEffect, useMemo, useCallback } from 'react';
import { useStorage } from '../contexts/StorageContext';
import type { PrescribedWeek, PrescribedDay, PrescribedExercise, WorkoutLog, BlockType } from '../types';
import { Check, X } from 'lucide-react';
import { blockTypeColors, blockTypeLabels } from '../domain/blockTypeConfig';
import { dayTypePtLabels, dayTypeAbbrev } from '../domain/dayTypeLabels';
import { getSessionData, getTotalSessions, getWeeks } from '../services/scheduling';
import { getProgram } from '../data/program/programs';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Block {
  name: string;
  type: BlockType;
  objective: string;
  weeks: PrescribedWeek[];
}

/** Mesociclos derivados do próprio programa, em vez de uma lista fixa. */
function deriveMacrocycles(weeks: PrescribedWeek[]) {
  const byMacro = new Map<number, PrescribedWeek[]>();
  for (const w of weeks) {
    if (!byMacro.has(w.macrocycle)) byMacro.set(w.macrocycle, []);
    byMacro.get(w.macrocycle)!.push(w);
  }
  return [...byMacro.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([id, macroWeeks]) => ({
      id,
      label: `MAC ${id}`,
      desc: macroWeeks[0].blockObjective,
      weeks: `${macroWeeks[0].weekNumber}-${macroWeeks[macroWeeks.length - 1].weekNumber}`,
    }));
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Calendar() {
  const storage = useStorage();
  const programId = storage.getActiveProgramId();
  const program = getProgram(programId);
  const allWeeks = getWeeks(programId);
  const totalSessions = getTotalSessions(programId);
  const macrocycles = useMemo(() => deriveMacrocycles(allWeeks), [allWeeks]);

  const [currentWeek, setCurrentWeek] = useState(1);
  const [completedWorkouts, setCompletedWorkouts] = useState<WorkoutLog[]>([]);
  const [activeMacro, setActiveMacro] = useState(() => allWeeks[0]?.macrocycle ?? 1);
  const [selectedDay, setSelectedDay] = useState<{ week: PrescribedWeek; day: PrescribedDay; dayIndex: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const sessionIndex = storage.getSessionIndex();

  useEffect(() => {
    const session = getSessionData(Math.min(sessionIndex, totalSessions - 1), programId);
    const cw = session?.weekNumber ?? 1;
    setCurrentWeek(cw);
    // Só os treinos deste programa — logs de outro programa não podem marcar
    // dias como concluídos por coincidência de semana + tipo de dia.
    setCompletedWorkouts(
      storage.getWorkouts().filter((w) => w.completed && (w.programId ?? 'legacy-52w') === programId),
    );
    setActiveMacro(session?.week.macrocycle ?? allWeeks[0]?.macrocycle ?? 1);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Group weeks into blocks for the active macrocycle
  const blocks = useMemo(() => {
    const macroWeeks = allWeeks.filter((w) => w.macrocycle === activeMacro);
    const blockMap = new Map<string, Block>();

    for (const w of macroWeeks) {
      const key = w.blockName;
      if (!blockMap.has(key)) {
        blockMap.set(key, {
          name: w.blockName,
          type: w.blockType,
          objective: w.blockObjective,
          weeks: [],
        });
      }
      blockMap.get(key)!.weeks.push(w);
    }

    return Array.from(blockMap.values());
  }, [allWeeks, activeMacro]);

  // Map of completed counts per week+dayType (handles duplicate arms_shoulders)
  const completedCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const w of completedWorkouts) {
      const key = `${w.weekNumber}-${w.dayType}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return counts;
  }, [completedWorkouts]);

  const isDayCompleted = useCallback(
    (weekNum: number, dayType: string, dayIndex: number) => {
      const key = `${weekNum}-${dayType}`;
      const completedCount = completedCounts.get(key) || 0;
      // Count how many days of this type appear at or before this index
      const weekData = allWeeks.find((w) => w.weekNumber === weekNum);
      if (!weekData) return false;
      let typeOccurrence = 0;
      for (let i = 0; i <= dayIndex; i++) {
        if (i < weekData.days.length && weekData.days[i].dayType === dayType) {
          typeOccurrence++;
        }
      }
      return completedCount >= typeOccurrence;
    },
    [completedCounts, allWeeks],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-text-muted font-display text-lg tracking-wide">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <div className="max-w-lg mx-auto px-4 pt-6">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold font-display text-accent-gold tracking-wider uppercase">
            Programação
          </h1>
          <p className="text-text-muted font-display text-sm mt-1">
            {program.name} · Semana <span className="font-mono text-text-secondary">{currentWeek}</span> / {allWeeks.length}
            <span className="ml-2 font-mono text-text-muted">· Sessão {Math.min(sessionIndex + 1, totalSessions)} / {totalSessions}</span>
          </p>
        </header>

        {/* Macrocycle Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-none pb-1">
          {macrocycles.map((mac) => {
            const isActive = mac.id === activeMacro;
            return (
              <button
                key={mac.id}
                onClick={() => setActiveMacro(mac.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg border font-display text-sm tracking-wide transition-all ${
                  isActive
                    ? 'bg-accent-gold/15 border-accent-gold/40 text-accent-gold'
                    : 'bg-bg-card border-border text-text-muted hover:text-text-secondary hover:border-border-light'
                }`}
              >
                <span className="font-semibold">{mac.label}</span>
                <span className="block text-[10px] opacity-70">{mac.weeks}</span>
              </button>
            );
          })}
        </div>

        {/* Macrocycle Description */}
        <div className="mb-6 px-1">
          <p className="text-text-secondary font-display text-sm">
            {macrocycles.find((m) => m.id === activeMacro)?.desc}
          </p>
        </div>

        {/* Blocks */}
        <div className="space-y-6">
          {blocks.map((block) => {
            const colors = blockTypeColors[block.type];
            return (
              <div
                key={block.name}
                className="animate-fade-in"
              >
                {/* Block Header */}
                <div className={`flex items-center gap-3 mb-3`}>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold font-display tracking-widest uppercase ${colors.bg} ${colors.accent} border ${colors.border}`}>
                    {blockTypeLabels[block.type]}
                  </div>
                  <h2 className="font-display font-semibold text-text-primary text-sm tracking-wide">
                    {block.name}
                  </h2>
                </div>

                {/* Block Objective */}
                <p className="text-text-muted text-xs font-display mb-3 pl-1 leading-relaxed">
                  {block.objective}
                </p>

                {/* Week Grid */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {block.weeks.map((w) => {
                    const isCurrent = w.weekNumber === currentWeek;
                    const isDeload = w.isDeload;

                    return (
                      <div
                        key={w.weekNumber}
                        className={`bg-bg-card rounded-lg border p-3 transition-all ${
                          isCurrent
                            ? 'border-accent-gold/60 shadow-[0_0_8px_rgba(212,160,23,0.15)]'
                            : isDeload
                              ? 'border-accent-blue/30'
                              : 'border-border'
                        }`}
                      >
                        {/* Week Label */}
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-mono text-xs font-bold ${
                            isCurrent ? 'text-accent-gold' : isDeload ? 'text-accent-blue' : 'text-text-secondary'
                          }`}>
                            W{w.weekNumber}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-display font-bold text-accent-gold bg-accent-gold/10 px-1.5 py-0.5 rounded tracking-wider">
                              ATUAL
                            </span>
                          )}
                          {isDeload && !isCurrent && (
                            <span className="text-[9px] font-display font-bold text-accent-blue bg-accent-blue/10 px-1.5 py-0.5 rounded tracking-wider">
                              DELOAD
                            </span>
                          )}
                        </div>

                        {/* Day Indicators */}
                        <div className="flex gap-1">
                          {w.days.map((d, i) => {
                            const completed = isDayCompleted(w.weekNumber, d.dayType, i);
                            const isMini = d.dayType === 'arms_shoulders' || d.dayType === 'arms_hypertrophy';
                            return (
                              <button
                                key={`${d.dayType}-${i}`}
                                onClick={() => setSelectedDay({ week: w, day: d, dayIndex: i })}
                                className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded transition-all ${
                                  completed
                                    ? isMini
                                      ? 'bg-accent-purple/15 hover:bg-accent-purple/25'
                                      : 'bg-accent-green/15 hover:bg-accent-green/25'
                                    : isMini
                                      ? 'bg-accent-purple/10 hover:bg-accent-purple/15'
                                      : isDeload
                                        ? 'bg-accent-blue/5 hover:bg-accent-blue/10'
                                        : 'bg-bg-tertiary hover:bg-bg-input'
                                }`}
                              >
                                <span className={`text-[8px] font-display font-semibold ${
                                  completed
                                    ? isMini ? 'text-accent-purple' : 'text-accent-green'
                                    : isMini ? 'text-accent-purple/70' : 'text-text-muted'
                                }`}>
                                  {dayTypeAbbrev[d.dayType]}
                                </span>
                                {completed ? (
                                  <Check size={11} className={isMini ? 'text-accent-purple' : 'text-accent-green'} strokeWidth={3} />
                                ) : (
                                  <div className={`w-1.5 h-1.5 rounded-full ${
                                    isMini ? 'bg-accent-purple/40' : isDeload ? 'bg-accent-blue/40' : 'bg-text-muted/30'
                                  }`} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-8 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-muted font-display text-xs tracking-wide uppercase">Progresso Geral</span>
            <span className="font-mono text-xs text-text-secondary">
              {completedWorkouts.length} / {totalSessions}
            </span>
          </div>
          <div className="w-full h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-gold rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (completedWorkouts.length / totalSessions) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Day Detail Modal */}
      {selectedDay && (
        <DayDetailModal
          week={selectedDay.week}
          day={selectedDay.day}
          isCompleted={isDayCompleted(selectedDay.week.weekNumber, selectedDay.day.dayType, selectedDay.dayIndex)}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Day Detail Modal
// ---------------------------------------------------------------------------

function DayDetailModal({
  week,
  day,
  isCompleted,
  onClose,
}: {
  week: PrescribedWeek;
  day: PrescribedDay;
  isCompleted: boolean;
  onClose: () => void;
}) {
  const colors = blockTypeColors[week.blockType];

  // Lock body scroll on iOS when modal is open
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-bg-card border-t border-border rounded-t-2xl animate-fade-in max-h-[80vh] overflow-y-auto overscroll-contain"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-bg-card border-b border-border px-4 pt-4 pb-3 z-10">
          {/* Drag Handle */}
          <div className="w-10 h-1 bg-border-light rounded-full mx-auto mb-3" />

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-text-secondary">W{week.weekNumber}</span>
                <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-display tracking-widest uppercase ${colors.bg} ${colors.accent} border ${colors.border}`}>
                  {blockTypeLabels[week.blockType]}
                </div>
                {day.dayType === 'arms_shoulders' && (
                  <span className="text-[9px] font-display font-bold text-accent-purple bg-accent-purple/10 px-1.5 py-0.5 rounded tracking-wider border border-accent-purple/20">
                    MINI ~20min
                  </span>
                )}
                {day.dayType === 'arms_hypertrophy' && (
                  <span className="text-[9px] font-display font-bold text-accent-purple bg-accent-purple/10 px-1.5 py-0.5 rounded tracking-wider border border-accent-purple/20">
                    ARM DAY
                  </span>
                )}
                {isCompleted && (
                  <span className="text-[9px] font-display font-bold text-accent-green bg-accent-green/10 px-1.5 py-0.5 rounded tracking-wider">
                    COMPLETO
                  </span>
                )}
              </div>
              <h3 className="font-display font-semibold text-text-primary text-base tracking-wide">
                {day.dayLabel}
              </h3>
              <p className="text-text-muted text-xs font-display mt-0.5">
                {dayTypePtLabels[day.dayType] ?? day.dayType}
                {day.restNote ? ` · ${day.restNote}` : ''}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-bg-tertiary text-text-muted hover:text-text-primary transition-colors"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Exercise List */}
        <div className="px-4 py-3 space-y-2">
          {day.exercises.map((exercise, idx) => (
            <ExerciseRow key={`${exercise.exerciseId}-${idx}`} exercise={exercise} index={idx} />
          ))}
        </div>

        {/* Block Objective */}
        <div className="px-4 pb-8 pt-2">
          <div className="bg-bg-tertiary rounded-lg p-3 border border-border">
            <p className="text-[10px] font-display font-bold text-text-muted tracking-wider uppercase mb-1">
              Objetivo do Bloco
            </p>
            <p className="text-text-secondary text-xs font-display leading-relaxed">
              {week.blockObjective}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exercise Row
// ---------------------------------------------------------------------------

/**
 * Uma linha da tabela do programa, com todas as colunas do material de origem:
 * aquecimento, séries × reps, %1RM, RPE, descanso e a nota completa.
 */
function ExerciseRow({ exercise, index }: { exercise: PrescribedExercise; index: number }) {
  return (
    <div className={`bg-bg-tertiary rounded-lg p-3 border border-border ${
      exercise.supersetGroup ? 'border-l-2 border-l-accent-purple/60' : ''
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {exercise.supersetGroup ? (
              <span className="inline-flex items-center justify-center px-1 h-5 rounded bg-accent-purple/20 text-accent-purple text-[10px] font-mono font-bold flex-shrink-0">
                {exercise.supersetGroup}{exercise.supersetOrder ?? ''}
              </span>
            ) : (
              <span className="font-mono text-[10px] text-text-muted">{index + 1}.</span>
            )}
            <h4 className="font-display font-semibold text-text-primary text-sm truncate">
              {exercise.exerciseName}
            </h4>
            {exercise.optional && (
              <span className="px-1 py-0.5 rounded bg-bg-card text-text-muted text-[8px] font-display uppercase tracking-wider flex-shrink-0">
                Opt
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 ml-7 text-[10px] font-mono text-text-muted">
            {exercise.warmupSets ? <span>{exercise.warmupSets} aquec.</span> : null}
            {exercise.percent1RM && <span className="text-accent-gold">{exercise.percent1RM}</span>}
            {exercise.restLabel && <span>desc. {exercise.restLabel}</span>}
            {exercise.perSide && <span className="text-accent-purple">cada lado</span>}
            {exercise.alternatives?.length ? <span>ou {exercise.alternatives.join(' / ')}</span> : null}
          </div>
          {exercise.notes && (
            <p className="text-text-muted text-[11px] font-display mt-1 ml-7 italic leading-relaxed">
              {exercise.notes}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <span className="font-mono text-sm font-bold text-text-primary">
              {exercise.sets}x{exercise.reps}
            </span>
          </div>
          <div className="bg-bg-input rounded px-1.5 py-0.5 border border-border">
            <span className="font-mono text-[10px] text-accent-gold font-semibold">
              RPE {exercise.rpe}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
