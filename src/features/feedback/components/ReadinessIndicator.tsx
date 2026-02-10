import type { SurveyTrends } from '../hooks/useSurveyTrends';

interface Props {
  trends: SurveyTrends;
}

export function ReadinessIndicator({ trends }: Props) {
  const score = trends.readinessScore;
  const color = score > 7 ? 'bg-accent-green' : score >= 5 ? 'bg-accent-gold' : 'bg-accent-red';
  const textColor = score > 7 ? 'text-accent-green' : score >= 5 ? 'text-accent-gold' : 'text-accent-red';

  return (
    <div className="bg-bg-card border border-border rounded-lg p-4 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-display font-semibold tracking-wider uppercase text-text-muted">
          PRONTIDÃO
        </span>
        <span className={`text-lg font-mono font-bold ${textColor}`}>
          {score.toFixed(1)}
        </span>
      </div>
      <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-mono text-text-muted">
        <span>0</span>
        <span>10</span>
      </div>
    </div>
  );
}
