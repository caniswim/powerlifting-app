import { AlertTriangle } from 'lucide-react';
import type { SurveyAlert } from '../hooks/useSurveyTrends';

interface Props {
  alerts: SurveyAlert[];
}

export function AlertsBanner({ alerts }: Props) {
  if (alerts.length === 0) return null;

  return (
    <div className="bg-accent-red/10 border border-accent-red/30 rounded-lg p-3 space-y-2">
      {alerts.map((alert, i) => (
        <div key={i} className="flex items-center gap-2">
          <AlertTriangle
            size={14}
            className={alert.type === 'danger' ? 'text-accent-red' : 'text-accent-gold'}
          />
          <span className="text-xs font-display text-text-secondary">
            {alert.message}
          </span>
        </div>
      ))}
    </div>
  );
}
