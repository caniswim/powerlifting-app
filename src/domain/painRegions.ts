import type { PainNature, PainRegion, RestPainContext } from '../types';

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
  left_glute: 'Glúteo Esq',
  right_glute: 'Glúteo Dir',
  left_thigh: 'Coxa Esq',
  right_thigh: 'Coxa Dir',
  left_hamstring: 'Posterior Esq',
  right_hamstring: 'Posterior Dir',
  left_adductor: 'Adutor Esq',
  right_adductor: 'Adutor Dir',
  left_calf: 'Panturrilha Esq',
  right_calf: 'Panturrilha Dir',
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

/**
 * Rótulos e ORDEM da natureza do tecido.
 *
 * `Record<PainNature, string>` pelo mesmo motivo dos outros dois mapas deste
 * arquivo: acrescentar uma natureza ao enumerado sem rótulo reprova o `tsc`.
 *
 * A ordem NÃO é alfabética nem arbitrária — é a frequência esperada num
 * programa de força, e `nao_sei` fica por último porque é saída, não atalho.
 */
export const painNatureLabels: Record<PainNature, string> = {
  muscular: 'Muscular',
  tendao: 'Tendão',
  articular: 'Articular',
  nervo: 'Nervo',
  nao_sei: 'Não sei',
};

/**
 * Uma linha de desambiguação por natureza, exibida sob os botões.
 *
 * Existe porque a palavra sozinha não basta no momento do preenchimento: o
 * atleta que sente ardência descendo pela perna precisa saber que aquilo é
 * `nervo` e não `muscular`, e ele não vai abrir a documentação para descobrir.
 * O texto descreve SENSAÇÃO e COMPORTAMENTO, não diagnóstico — o app não
 * diagnostica, e nenhuma destas linhas deve ser lida como se diagnosticasse.
 */
export const painNatureHints: Record<PainNature, string> = {
  muscular: 'dor difusa no ventre do músculo, pior ao alongar, tende a passar em 24–72 h',
  tendao: 'dor em ponto fixo perto da articulação, esquenta e alivia, volta a doer depois',
  articular: 'dor dentro da articulação, ligada a ângulo ou profundidade',
  nervo: 'irradia, formiga, queima ou dormência — não fica onde começou',
  nao_sei: 'não force a classificação: em branco é melhor que errado',
};

export const painNatures = Object.keys(painNatureLabels) as PainNature[];
