/**
 * Mapa rótulo-do-markdown -> exerciseId do registry.
 *
 * A chave é o rótulo verbatim da coluna "Exercise" do markdown, já sem o
 * prefixo de superset (A1:, B2:, ...). Toda linha do programa precisa casar
 * aqui — o gerador falha se sobrar qualquer rótulo não mapeado, para que um
 * exercício novo nunca entre no app sem grupo muscular.
 *
 * `alt` são as variações que o próprio programa oferece ("[OR Box Squat]").
 */
export const EXERCISE_MAP = {
  // Agachamento / quadríceps
  'Back Squat': { id: 'agachamento_low_bar' },
  'Front Squat': { id: 'front_squat' },
  'Front Squat [OR Box Squat]': { id: 'front_squat', alt: [['Box Squat', 'box_squat']] },
  'Pin Squat': { id: 'pin_squat' },
  'Hack Squat': { id: 'hack_squat' },
  'Leg Press': { id: 'leg_press' },
  'Unilateral Leg Press': { id: 'unilateral_leg_press' },
  'Leg Extension': { id: 'leg_extension' },
  'Eccentric-Accentuated Leg Extension': { id: 'eccentric_leg_extension' },
  'Bulgarian Split Squat': { id: 'bulgarian_split_squat' },
  'Sissy Squat': { id: 'sissy_squat' },

  // Terra / posterior
  Deadlift: { id: 'deadlift_sumo' },
  'Reset Deadlift': { id: 'reset_deadlift' },
  'Opposite Stance Deadlift': { id: 'opposite_stance_deadlift' },
  '1" Block Pull': { id: 'block_pull_1' },
  '2" Block Pull': { id: 'block_pull_2' },
  '4" Block Pull': { id: 'block_pull_4' },
  '6" Block Pull': { id: 'block_pull_6' },
  'Barbell RDL': { id: 'barbell_rdl' },
  'Glute-Ham Raise [OR Nordic Ham Curl]': { id: 'ghr', alt: [['Nordic Ham Curl', 'nordic_ham_curl']] },
  'Glute-Ham Raise [OR Nordic]': { id: 'ghr', alt: [['Nordic Ham Curl', 'nordic_ham_curl']] },
  'Nordic Ham Curl': { id: 'nordic_ham_curl' },
  'Leg Curl (Choice)': { id: 'leg_curl' },
  'Unilateral Leg Curl (Choice)': { id: 'unilateral_leg_curl' },
  'Sliding Leg Curl': { id: 'sliding_leg_curl' },
  'Single-leg Hip Thrust': { id: 'single_leg_hip_thrust' },
  'Cable Pull-Through': { id: 'cable_pull_through' },
  'Prisoner Back Extension': { id: 'prisoner_back_extension' },
  'Hip Abduction': { id: 'hip_abduction' },

  // Panturrilha
  'Standing Calf Raise': { id: 'standing_calf_raise' },
  'Unilateral Standing Calf Raise': { id: 'unilateral_standing_calf_raise' },
  'Unilateral Standing Calf': { id: 'unilateral_standing_calf_raise' },
  'Enhanced-Eccentric Calf Raise': { id: 'enhanced_eccentric_calf_raise' },

  // Empurrar
  'Barbell Bench Press': { id: 'supino_wide_grip' },
  'Barbell Bench Press AMRAP': { id: 'supino_wide_grip' },
  'Barbell Bench Press (Back Off)': { id: 'supino_wide_grip' },
  'Pause Barbell Bench Press': { id: 'pause_bench_press' },
  'Close-Grip Bench Press': { id: 'close_grip_bench' },
  'Larsen Press': { id: 'larsen_press' },
  'Barbell Overhead Press': { id: 'ohp' },
  'Pause DB Incline Press': { id: 'pause_db_incline_press' },
  'Machine Incline Press': { id: 'machine_incline_press' },
  'Pec Flye': { id: 'pec_flye' },
  Dip: { id: 'dip' },
  'Deficit Push-up': { id: 'deficit_pushup' },
  'Triceps Pressdown': { id: 'triceps_pulley' },
  'Triceps Pressdown 21s': { id: 'triceps_pressdown_21s' },
  'Rope Overhead Triceps Extension': { id: 'triceps_overhead_cabo' },
  'Single-Arm Overhead Triceps Extension': { id: 'single_arm_oh_triceps_ext' },
  'Cable Triceps Kickback': { id: 'cable_triceps_kickback' },
  'Constant-Tension Cable Triceps Kickback': { id: 'constant_tension_kickback' },

  // Puxar
  'Weighted Pull-up': { id: 'weighted_pullup' },
  'Weighted Neutral-Grip Pull-up': { id: 'weighted_neutral_grip_pullup' },
  'Weighted Eccentric-Overload Pull-up': { id: 'eccentric_overload_pullup' },
  'Eccentric-Accentuated Pull-up': { id: 'eccentric_accentuated_pullup' },
  'Chin-up': { id: 'chinup' },
  'Wide-Grip Lat Pulldown': { id: 'wide_grip_lat_pulldown' },
  'Omni-Grip Lat Pulldown': { id: 'omni_grip_lat_pulldown' },
  'Single-Arm Pulldown': { id: 'single_arm_pulldown' },
  'Seated Cable Row': { id: 'seated_cable_row' },
  'Chest-Supported Row': { id: 'remada_apoio_peito' },
  'Machine Chest-Supported Row': { id: 'machine_chest_supported_row' },
  'Meadows Row': { id: 'meadows_row' },
  'One-Arm Row': { id: 'one_arm_row' },
  'Pendlay Row / Bent Over Row': { id: 'pendlay_row', alt: [['Bent Over Row', 'pendlay_row']] },

  // Bíceps
  'Barbell or EZ Bar Curl': { id: 'rosca_barra' },
  'Cable Curl': { id: 'rosca_cabo' },
  'Hammer Curl': { id: 'rosca_martelo' },
  'Hammer "Cheat" Curl': { id: 'hammer_cheat_curl' },
  'Incline Dumbbell Curl': { id: 'rosca_inclinada' },
  'Inverse Zottman Curl': { id: 'inverse_zottman_curl' },

  // Deltoides / trapézio / pescoço
  'Seated Face Pull': { id: 'face_pull' },
  'Cable Reverse Flye': { id: 'cable_reverse_flye' },
  'Egyptian Lateral Raise': { id: 'egyptian_lateral_raise' },
  'DB Lateral Raise': { id: 'elevacao_lateral' },
  'Dumbbell Lateral Raise 21s': { id: 'db_lateral_raise_21s' },
  'DB Lateral Raise ISO-Hold': { id: 'db_lateral_raise_iso_hold' },
  'Lateral Raise (Choice)': { id: 'lateral_raise_choice' },
  'Prone Trap Raise': { id: 'prone_trap_raise' },
  'Plate Shrug': { id: 'plate_shrug' },
  'Cable Shrug-In (TRAPS)': { id: 'cable_shrug_in' },
  'Wall Slide': { id: 'wall_slide' },
  'Neck Flexion/Extension (Optional)': { id: 'neck_flexion_extension' },

  // Core / preensão
  'Weighted Crunch': { id: 'weighted_crunch' },
  'Cable Crunch (ABS)': { id: 'cable_crunch' },
  'Hanging Leg Raise': { id: 'hanging_leg_raise' },
  'L-Sit Hold': { id: 'l_sit_hold' },
  'Long-Lever Plank (Optional)': { id: 'long_lever_plank' },
  'Barbell or DB Isometric Hold': { id: 'isometric_hold' },
};
