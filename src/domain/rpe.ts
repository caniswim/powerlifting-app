export function getRPEColor(rpe: number): string {
  if (rpe >= 9.5) return 'bg-accent-red text-white';
  if (rpe >= 9) return 'bg-accent-red-dim text-white';
  if (rpe >= 8) return 'bg-accent-gold text-black';
  if (rpe >= 7) return 'bg-accent-green-dim text-white';
  return 'bg-bg-tertiary text-text-secondary';
}
