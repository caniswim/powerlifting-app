// Escala de RPE oferecida no registo de séries. Vai abaixo de 6 para cobrir
// aquecimentos, trabalho técnico e semanas de deload (RPE 5,5).
export const RPE_SCALE = [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

export function getRPEColor(rpe: number): string {
  if (rpe >= 9.5) return 'bg-accent-red text-white';
  if (rpe >= 9) return 'bg-accent-red-dim text-white';
  if (rpe >= 8) return 'bg-accent-gold text-black';
  if (rpe >= 7) return 'bg-accent-green-dim text-white';
  return 'bg-bg-tertiary text-text-secondary';
}

export function getRIRText(rpe: number): string {
  if (rpe >= 10) return 'Até a falha';
  if (rpe >= 9.5) return '0–1 rep na reserva';
  if (rpe >= 9) return '1 rep na reserva';
  if (rpe >= 8.5) return '1–2 reps na reserva';
  if (rpe >= 8) return '2 reps na reserva';
  if (rpe >= 7.5) return '2–3 reps na reserva';
  if (rpe >= 7) return '3 reps na reserva';
  if (rpe >= 6.5) return '3–4 reps na reserva';
  if (rpe >= 6) return '4 reps na reserva';
  if (rpe >= 5.5) return '4–5 reps na reserva';
  if (rpe >= 5) return '5 reps na reserva';
  if (rpe >= 4.5) return '5–6 reps na reserva';
  return '6+ reps na reserva';
}
