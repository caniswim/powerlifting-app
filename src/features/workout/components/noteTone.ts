import type { NoteTone } from '../../../domain/prescriptionNotes';

/**
 * Cor por classe de segmento.
 *
 * Fica fora do domínio porque é decisão de apresentação, e fora dos arquivos de
 * componente porque exportar constante junto com componente derruba o fast
 * refresh do Vite.
 *
 * A escolha das cores não é decorativa: reaproveita o vocabulário que o app já
 * usa em outros lugares — vermelho é limite, ouro é o número que se executa,
 * verde é regra de competição — para o levantador não precisar aprender uma
 * segunda legenda dentro da tela de treino.
 */
export const TONE_STYLE: Record<NoteTone, { chip: string; rail: string }> = {
  parada: { chip: 'bg-accent-red/15 text-accent-red', rail: 'bg-accent-red/50' },
  execucao: { chip: 'bg-accent-blue/15 text-accent-blue', rail: 'bg-accent-blue/50' },
  dose: { chip: 'bg-accent-gold/15 text-accent-gold', rail: 'bg-accent-gold/50' },
  instrumento: { chip: 'bg-accent-purple/15 text-accent-purple', rail: 'bg-accent-purple/50' },
  ipf: { chip: 'bg-accent-green/15 text-accent-green', rail: 'bg-accent-green/50' },
  registro: { chip: 'bg-bg-tertiary text-text-muted', rail: 'bg-border-light' },
  meta: { chip: 'bg-bg-tertiary text-text-muted', rail: 'bg-border-light' },
  prosa: { chip: 'bg-bg-tertiary text-text-muted', rail: 'bg-border-light' },
};

export function toneStyle(tone: NoteTone) {
  return TONE_STYLE[tone];
}
