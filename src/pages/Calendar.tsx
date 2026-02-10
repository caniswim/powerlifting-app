import { useState, useEffect, useMemo, useCallback } from 'react';
import { useStorage } from '../contexts/StorageContext';
import type { PrescribedWeek, PrescribedDay, PrescribedExercise, WorkoutLog, BlockType } from '../types';
import { Check, X } from 'lucide-react';
import { blockTypeColors, blockTypeLabels } from '../domain/blockTypeConfig';
import { dayTypePtLabels } from '../domain/dayTypeLabels';

// ---------------------------------------------------------------------------
// Data loader
// ---------------------------------------------------------------------------

let programDataCache: PrescribedWeek[] | null = null;
async function loadProgramData(): Promise<PrescribedWeek[]> {
  if (programDataCache) return programDataCache;
  try {
    const mod = await import('../data/programData');
    programDataCache = mod.programData;
    return programDataCache;
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MACROCYCLES = [
  { id: 1, label: 'MAC 1', desc: 'Fundação Hipertrófica', weeks: '1-13' },
  { id: 2, label: 'MAC 2', desc: 'Hipertrofia + Força', weeks: '14-26' },
  { id: 3, label: 'MAC 3', desc: 'Segundo Ciclo Hipertrófico', weeks: '27-39' },
  { id: 4, label: 'MAC 4', desc: 'Força + Realização', weeks: '40-52' },
];

const DAY_SHORT_LABELS = ['SQ', 'BP', 'DL', 'BV'];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Block {
  name: string;
  type: BlockType;
  objective: string;
  weeks: PrescribedWeek[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Calendar() {
  const storage = useStorage();
  const [allWeeks, setAllWeeks] = useState<PrescribedWeek[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [completedWorkouts, setCompletedWorkouts] = useState<WorkoutLog[]>([]);
  const [activeMacro, setActiveMacro] = useState(1);
  const [selectedDay, setSelectedDay] = useState<{ week: PrescribedWeek; day: PrescribedDay } | null>(null);
  const [loading, setLoading] = useState(true);

  const sessionIndex = storage.getSessionIndex();

  useEffect(() => {
    const cw = Math.floor(sessionIndex / 4) + 1;
    setCurrentWeek(cw);
    setCompletedWorkouts(storage.getWorkouts().filter((w) => w.completed));

    // Auto-select the macrocycle containing the current week
    const macroForCurrentWeek = cw <= 13 ? 1 : cw <= 26 ? 2 : cw <= 39 ? 3 : 4;
    setActiveMacro(macroForCurrentWeek);

    loadProgramData().then((data) => {
      setAllWeeks(data);
      setLoading(false);
    });
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

  // Set of completed week+dayType combos for quick lookup
  const completedSet = useMemo(() => {
    const set = new Set<string>();
    for (const w of completedWorkouts) {
      set.add(`${w.weekNumber}-${w.dayType}`);
    }
    return set;
  }, [completedWorkouts]);

  const isDayCompleted = useCallback(
    (weekNum: number, dayType: string) => completedSet.has(`${weekNum}-${dayType}`),
    [completedSet],
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
            Semana atual: <span className="font-mono text-text-secondary">{currentWeek}</span> / 52
            <span className="ml-2 font-mono text-text-muted">· Sessão {sessionIndex + 1} / 208</span>
          </p>
        </header>

        {/* Macrocycle Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-none pb-1">
          {MACROCYCLES.map((mac) => {
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
            {MACROCYCLES.find((m) => m.id === activeMacro)?.desc}
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
                            const completed = isDayCompleted(w.weekNumber, d.dayType);
                            return (
                              <button
                                key={d.dayType}
                                onClick={() => setSelectedDay({ week: w, day: d })}
                                className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded transition-all ${
                                  completed
                                    ? 'bg-accent-green/15 hover:bg-accent-green/25'
                                    : isDeload
                                      ? 'bg-accent-blue/5 hover:bg-accent-blue/10'
                                      : 'bg-bg-tertiary hover:bg-bg-input'
                                }`}
                              >
                                <span className={`text-[9px] font-display font-semibold ${
                                  completed ? 'text-accent-green' : 'text-text-muted'
                                }`}>
                                  {DAY_SHORT_LABELS[i]}
                                </span>
                                {completed ? (
                                  <Check size={12} className="text-accent-green" strokeWidth={3} />
                                ) : (
                                  <div className={`w-1.5 h-1.5 rounded-full ${
                                    isDeload ? 'bg-accent-blue/40' : 'bg-text-muted/30'
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
              {completedWorkouts.length} / {allWeeks.length * 4}
            </span>
          </div>
          <div className="w-full h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-gold rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (completedWorkouts.length / (allWeeks.length * 4)) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Day Detail Modal */}
      {selectedDay && (
        <DayDetailModal
          week={selectedDay.week}
          day={selectedDay.day}
          isCompleted={isDayCompleted(selectedDay.week.weekNumber, selectedDay.day.dayType)}
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

function ExerciseRow({ exercise, index }: { exercise: PrescribedExercise; index: number }) {
  return (
    <div className="bg-bg-tertiary rounded-lg p-3 border border-border">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-text-muted">{index + 1}.</span>
            <h4 className="font-display font-semibold text-text-primary text-sm truncate">
              {exercise.exerciseName}
            </h4>
          </div>
          {exercise.notes && (
            <p className="text-text-muted text-[11px] font-display mt-0.5 ml-5 italic">
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
