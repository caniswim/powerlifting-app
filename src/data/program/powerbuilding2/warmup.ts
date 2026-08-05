/**
 * Protocolo de aquecimento do Powerbuilding Phase 2.0.
 *
 * Transcrito de source/WARMUP_ROUTINE.md. Os textos do programa ficam em
 * inglês, verbatim, como no restante da prescrição.
 */

export interface WarmupDrill {
  exercise: string;
  sets: string;
  repsOrTime: string;
  notes: string;
  optional?: boolean;
}

export const WARMUP_RATIONALE: { title: string; detail: string }[] = [
  {
    title: 'Raises core body temperature',
    detail:
      'Improves performance and lowers injury risk. If you train early in the morning, 5-10 minutes of low-to-moderate cardio beforehand is especially helpful.',
  },
  {
    title: 'Increases muscle activation',
    detail:
      "Dynamic drills (active movements through a joint's range of motion) improve force output more than passive stretching. Stay mentally engaged with the muscles you're activating rather than just going through the motions.",
  },
  {
    title: 'Reduces muscle soreness',
    detail:
      'A few minutes of light foam rolling before training can improve range of motion and help prevent injury.',
  },
];

/** Parte 1 — feito em toda sessão. */
export const GENERAL_WARMUP: WarmupDrill[] = [
  {
    exercise: 'Low intensity cardio',
    sets: 'N/A',
    repsOrTime: '5-10 min',
    notes: 'Any machine, elevate heart rate to ~100-135 bpm',
  },
  {
    exercise: 'Foam rolling / lacrosse ball',
    sets: 'N/A',
    repsOrTime: '2-3 min',
    notes:
      'Foam roll large muscle groups (quads, lats, calves). Optionally use a lacrosse ball on smaller areas (pecs, delts, hamstrings)',
  },
  { exercise: 'Front/Back Leg Swing', sets: '1', repsOrTime: '12 each leg', notes: 'Dynamic hip mobility' },
  { exercise: 'Side/Side Leg Swing', sets: '1', repsOrTime: '12 each leg', notes: 'Dynamic hip mobility' },
  { exercise: 'Standing Glute Squeeze', sets: '1', repsOrTime: '15 sec', notes: 'Squeeze your glutes as hard as possible' },
  { exercise: 'Prone Trap Raise', sets: '1', repsOrTime: '15 reps', notes: 'Mind-muscle connection with mid-back' },
  { exercise: 'Cable External Rotation', sets: '1', repsOrTime: '15 each side', notes: 'Rotator cuff activation', optional: true },
  { exercise: 'Cable Internal Rotation', sets: '1', repsOrTime: '15 each side', notes: 'Rotator cuff activation', optional: true },
  { exercise: 'Overhead Shrug', sets: '1', repsOrTime: '15 reps', notes: 'Light squeeze on traps at the top of each rep', optional: true },
];

/**
 * Parte 2 — pirâmide específica, só antes dos exercícios primários.
 * Percentuais do 1RM, exatamente como a tabela "%1RM" do documento.
 */
export const PYRAMID_STEPS: { label: string; percent: number | null; reps: string }[] = [
  { label: 'Bar', percent: null, reps: '15' },
  { label: '~40% 1RM', percent: 0.4, reps: '5' },
  { label: '~50% 1RM', percent: 0.5, reps: '4' },
  { label: '~60% 1RM', percent: 0.6, reps: '3' },
  { label: '~70-75% 1RM', percent: 0.725, reps: '2' },
];

/** Peso da barra olímpica, em kg — o documento usa 45 lb. */
export const BARBELL_WEIGHT_KG = 20;

export const WARMUP_NOTES: string[] = [
  'The "Warm-Up Sets" column in each workout table is a suggested number, not a fixed rule. If you\'re working up to a very heavy top set, you may need 5-6 warm-up sets to feel fully ready. If you\'re less experienced/strong, 3 sets may be enough.',
  "You're free to add more warm-up drills to the protocol above — just keep the total warm-up time to roughly 10-20 minutes. Don't rush it, but don't overdo it either.",
  "If you're feeling more sore than usual, an extra 3-5 minutes of foam rolling either before or after your session can help.",
];

export const WARMUP_SOURCE =
  'Warm-Up section and related FAQ, Powerbuilding Phase 2.0 (4x/Week) — Jeff Nippard.';
