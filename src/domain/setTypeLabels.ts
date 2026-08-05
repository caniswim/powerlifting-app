import type { SetType } from '../types';

export const setTypeLabels: Record<SetType, string> = {
  warmup: 'Aquecimento',
  working: 'Trabalho',
  top: 'Top Set',
  backoff: 'Back-off',
  amrap: 'AMRAP',
  dropset: 'Dropset',
  cluster: 'Cluster',
  timed: 'Isometria',
};

export const setTypeBadgeClass: Record<SetType, string> = {
  warmup: 'bg-bg-tertiary text-text-muted',
  working: 'bg-bg-tertiary text-text-secondary',
  top: 'bg-accent-gold/20 text-accent-gold',
  backoff: 'bg-accent-blue/20 text-accent-blue',
  amrap: 'bg-accent-red/20 text-accent-red',
  dropset: 'bg-accent-purple/20 text-accent-purple',
  cluster: 'bg-accent-purple/20 text-accent-purple',
  timed: 'bg-accent-blue/20 text-accent-blue',
};

/** "3-4 MIN" já vem do programa; este formata segundos para o cronômetro. */
export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
