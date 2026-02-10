import { useState } from 'react';
import { Bot, ChevronDown, ChevronUp } from 'lucide-react';
import type { AIFeedback } from '../../../types';

interface Props {
  feedback: AIFeedback;
}

const periodLabels: Record<string, string> = {
  daily: 'Diário',
  weekly: 'Semanal',
  monthly: 'Mensal',
  quarterly: 'Trimestral',
};

export function AIFeedbackCard({ feedback }: Props) {
  const [expanded, setExpanded] = useState(false);

  const displayContent = feedback.content || 'Gerando feedback...';
  const isLong = displayContent.length > 150;
  const preview = isLong && !expanded ? displayContent.slice(0, 150) + '...' : displayContent;

  return (
    <div className="bg-bg-card border border-border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={16} className="text-accent-gold" />
          <span className="text-[10px] font-display font-semibold tracking-wider uppercase text-accent-gold">
            FEEDBACK IA
          </span>
        </div>
        <span className="text-[10px] font-mono text-text-muted px-2 py-0.5 bg-bg-tertiary rounded">
          {periodLabels[feedback.period] || feedback.period}
        </span>
      </div>
      <p className="text-sm font-display text-text-secondary leading-relaxed whitespace-pre-line">
        {preview}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs font-display text-accent-gold hover:text-accent-gold-bright transition-colors"
        >
          {expanded ? (
            <>Ver menos <ChevronUp size={12} /></>
          ) : (
            <>Ver mais <ChevronDown size={12} /></>
          )}
        </button>
      )}
    </div>
  );
}
