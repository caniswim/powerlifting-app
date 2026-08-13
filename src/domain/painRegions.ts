import type { PainRegion, RestPainContext } from '../types';

/**
 * Rótulos e ORDEM DE EXIBIÇÃO das regiões de dor.
 *
 * A ordem das chaves é a ordem da grade na UI, e o peitoral vem primeiro por
 * decisão de segurança: é o tecido lesionado deste atleta e o único com gate
 * formal no programa (`PROGRAMA.md §1.2`). Região que exige registro fiel não
 * pode estar no fim de uma lista de 16 botões.
 */
export const painRegionLabels: Record<PainRegion, string> = {
  left_chest: 'Peitoral Esq',
  right_chest: 'Peitoral Dir',
  lower_back: 'Lombar',
  upper_back: 'Dorsal',
  left_shoulder: 'Ombro Esq',
  right_shoulder: 'Ombro Dir',
  left_knee: 'Joelho Esq',
  right_knee: 'Joelho Dir',
  left_hip: 'Quadril Esq',
  right_hip: 'Quadril Dir',
  left_elbow: 'Cotovelo Esq',
  right_elbow: 'Cotovelo Dir',
  left_wrist: 'Punho Esq',
  right_wrist: 'Punho Dir',
  neck: 'Pescoço',
  other: 'Outro',
};

/**
 * Rótulos e ORDEM dos momentos de dor FORA de sessão.
 *
 * `Record<RestPainContext, string>` de propósito: acrescentar um contexto ao
 * enumerado sem dar rótulo a ele reprova o `tsc`, e nenhuma lista de contextos
 * precisa ser mantida à mão em outro arquivo — a ordem das chaves aqui é a ordem
 * dos botões na tela e a ordem das gavetas no documento semanal.
 */
export const restPainContextLabels: Record<RestPainContext, string> = {
  repouso: 'Em repouso',
  ao_acordar: 'Ao acordar',
  apos_esforco_cotidiano: 'Após esforço do dia',
};

export const restPainContexts = Object.keys(restPainContextLabels) as RestPainContext[];
