/**
 * Antropometria do atleta — medida com fita métrica em agosto de 2026.
 *
 * Está versionada aqui porque é o insumo que decide escolha de exercício,
 * abertura de agachamento, estilo de terra e largura de pegada, e porque
 * medida perdida é medida que vira chute na próxima decisão.
 *
 * As razões derivadas foram conferidas entre si: a altura do trocânter
 * (93,5 cm) dá 52,5% da estatura, dentro do esperado, o que valida o conjunto
 * — medidas inconsistentes teriam estourado esse cruzamento.
 */

export interface Measurement {
  label: string;
  value: string;
  /** Leitura da medida: o que ela significa para o levantamento. */
  note?: string;
}

export interface MeasurementGroup {
  title: string;
  items: Measurement[];
}

export const MEASURED_ON = 'Agosto de 2026';

export const ANTHROPOMETRY: MeasurementGroup[] = [
  {
    title: 'Corpo',
    items: [
      { label: 'Idade', value: '28 anos' },
      { label: 'Estatura', value: '178 cm' },
      { label: 'Peso', value: '87 kg', note: 'estável em 2600 kcal' },
      { label: 'Gordura corporal', value: '~15%', note: 'estimada — ~74 kg de massa magra' },
    ],
  },
  {
    title: 'Alavancas — membros superiores',
    items: [
      { label: 'Envergadura', value: '184 cm', note: 'índice de macaco +6: braços longos' },
      { label: 'Úmero', value: '31 cm' },
      { label: 'Antebraço', value: '25 cm' },
      {
        label: 'Razão úmero:antebraço',
        value: '1,24',
        note: 'média 1,15–1,20 → úmero longo. Põe o peitoral em comprimento máximo em toda repetição de supino',
      },
      { label: 'Largura de ombro', value: '48 cm' },
      { label: 'Punho', value: '18 cm' },
    ],
  },
  {
    title: 'Alavancas — tronco e membros inferiores',
    items: [
      {
        label: 'Altura sentado',
        value: '98 cm',
        note: '55,1% da estatura (média ~52%) → tronco longo. Pesa contra o terra convencional',
      },
      {
        label: 'Fêmur',
        value: '44 cm',
        note: '24,7% da estatura (média 26–27%) → fêmur curto: exige MENOS inclinação para atingir profundidade',
      },
      { label: 'Fêmur ao chão', value: '49,5 cm', note: 'da fenda do joelho ao calcanhar' },
      {
        label: 'Razão fêmur:tíbia',
        value: '1,04',
        note: 'média 1,15–1,25 → fêmur curto em relação à tíbia',
      },
      { label: 'Altura do trocânter', value: '93,5 cm', note: '52,5% da estatura — cruzamento que valida o conjunto' },
      { label: 'Largura de quadril', value: '37 cm' },
      { label: 'Tornozelo', value: '24 cm' },
    ],
  },
  {
    title: 'Supino — pegada',
    items: [
      {
        label: 'Distância entre indicadores',
        value: '65,2 cm',
        note: '1,36× a largura de ombro. Legal na IPF com folga (limite 81 cm)',
      },
      {
        label: 'Método',
        value: 'invariante projetivo',
        note: 'medida por foto usando o intervalo de 5 cm entre anéis da barra como régua interna; desvio abaixo de 0,01%',
      },
    ],
  },
];

/**
 * O que a antropometria decide — e o que ela NÃO decide.
 *
 * A segunda parte importa tanto quanto a primeira: a leitura popular de que
 * braço longo e fêmur curto "pedem" um estilo de terra não se sustenta. O braço
 * de momento no quadril é o mesmo em sumo e convencional; o que de fato pesa
 * aqui é o tronco longo, e ele pesa CONTRA o convencional.
 */
export const ANTHROPOMETRY_READING = [
  'Fêmur curto exige menos inclinação de tronco para atingir a profundidade legal — a inclinação atual é erro corrigível, não imposição de alavanca.',
  'Úmero longo mantém o peitoral em comprimento máximo em toda repetição de supino: é o amplificador permanente do risco na articulação lesionada.',
  'Tronco longo pesa contra o terra convencional. Braço longo e fêmur curto são neutros na escolha do estilo.',
  'Braço longo indica stiff-legged em vez de RDL quando o programa pedir trabalho de hinge.',
];
