import { exerciseNames } from '../../../data/exerciseMuscleMap';

interface PRFlashBannerProps {
  exerciseId: string;
  e1rm: number;
}

export function PRFlashBanner({ exerciseId, e1rm }: PRFlashBannerProps) {
  return (
    <div className="bg-accent-gold/20 border border-accent-gold/40 rounded-lg p-3 text-center animate-fade-in pr-glow">
      <div className="text-lg font-display font-bold text-accent-gold uppercase tracking-wider">
        NOVO PR!
      </div>
      <div className="text-sm font-mono text-accent-gold-bright">
        {exerciseNames[exerciseId]} — {e1rm.toFixed(1)} e1RM
      </div>
    </div>
  );
}
