/**
 * Catálogo de exercícios do Powerbuilding Phase 2.0 (Jeff Nippard).
 *
 * Os nomes são os rótulos verbatim do markdown de origem — o programa é a fonte
 * de verdade do vocabulário. Alguns ids já existiam no catálogo legado e são
 * reaproveitados de propósito (ver bloco "Reaproveitados"): isso preserva PRs,
 * histórico de e1RM e o Total estimado, que dependem de `exerciseId`.
 *
 * Este módulo precisa ser importado DEPOIS de `definitions.ts` — as
 * re-registrações abaixo sobrescrevem as definições legadas pelo id.
 */
import { registerExercise } from '../../domain/exerciseRegistry';

// ---------------------------------------------------------------------------
// Reaproveitados do catálogo legado (mesmo movimento, rótulo do programa novo)
// ---------------------------------------------------------------------------
registerExercise({ id: 'agachamento_low_bar', name: 'Back Squat', equipment: 'barbell', percentRef: 'squat', muscleMap: { quads: 1.0, 'glúteos': 0.5, erectors: 0.5 } });
registerExercise({ id: 'supino_wide_grip', name: 'Barbell Bench Press', equipment: 'barbell', percentRef: 'bench', muscleMap: { peito: 1.0, 'deltóide_anterior': 0.5, 'tríceps': 0.5 } });
registerExercise({ id: 'deadlift_sumo', name: 'Deadlift', equipment: 'barbell', percentRef: 'deadlift', muscleMap: { 'glúteos': 1.0, hamstrings: 0.5, erectors: 0.5, quads: 0.5 } });
registerExercise({ id: 'front_squat', name: 'Front Squat', equipment: 'barbell', muscleMap: { quads: 1.0, erectors: 0.5 } });
registerExercise({ id: 'hack_squat', name: 'Hack Squat', equipment: 'machine', muscleMap: { quads: 1.0 } });
registerExercise({ id: 'leg_extension', name: 'Leg Extension', equipment: 'machine', muscleMap: { quads: 1.0 } });
registerExercise({ id: 'leg_press', name: 'Leg Press', equipment: 'machine', muscleMap: { quads: 1.0, 'glúteos': 0.5 } });
registerExercise({ id: 'larsen_press', name: 'Larsen Press', equipment: 'barbell', muscleMap: { peito: 1.0, 'deltóide_anterior': 0.5, 'tríceps': 0.5 } });
registerExercise({ id: 'close_grip_bench', name: 'Close-Grip Bench Press', equipment: 'barbell', muscleMap: { 'tríceps': 1.0, peito: 0.5 } });
registerExercise({ id: 'face_pull', name: 'Seated Face Pull', equipment: 'machine', muscleMap: { 'deltóide_posterior': 1.0, 'trapézio': 0.5 } });
registerExercise({ id: 'remada_apoio_peito', name: 'Chest-Supported Row', equipment: 'dumbbell', muscleMap: { costas: 1.0, 'bíceps': 0.5, 'deltóide_posterior': 0.5 } });
registerExercise({ id: 'rosca_martelo', name: 'Hammer Curl', equipment: 'dumbbell', muscleMap: { 'bíceps': 1.0, braquial: 1.0 } });
registerExercise({ id: 'rosca_barra', name: 'Barbell or EZ Bar Curl', equipment: 'barbell', muscleMap: { 'bíceps': 1.0 } });
registerExercise({ id: 'rosca_cabo', name: 'Cable Curl', equipment: 'machine', muscleMap: { 'bíceps': 1.0 } });
registerExercise({ id: 'rosca_inclinada', name: 'Incline Dumbbell Curl', equipment: 'dumbbell', muscleMap: { 'bíceps': 1.0 } });
registerExercise({ id: 'elevacao_lateral', name: 'DB Lateral Raise', equipment: 'dumbbell', muscleMap: { 'deltóide_lateral': 1.0 } });
registerExercise({ id: 'triceps_overhead_cabo', name: 'Rope Overhead Triceps Extension', equipment: 'machine', muscleMap: { 'tríceps': 1.0 } });
registerExercise({ id: 'triceps_pulley', name: 'Triceps Pressdown', equipment: 'machine', muscleMap: { 'tríceps': 1.0 } });

// ---------------------------------------------------------------------------
// Agachamento / quadríceps
// ---------------------------------------------------------------------------
registerExercise({ id: 'pin_squat', name: 'Pin Squat', equipment: 'barbell', percentRef: 'squat', muscleMap: { quads: 1.0, 'glúteos': 0.5, erectors: 0.5 } });
registerExercise({ id: 'box_squat', name: 'Box Squat', equipment: 'barbell', muscleMap: { quads: 1.0, 'glúteos': 0.5, erectors: 0.5 } });
registerExercise({ id: 'bulgarian_split_squat', name: 'Bulgarian Split Squat', equipment: 'dumbbell', unilateral: true, muscleMap: { quads: 1.0, 'glúteos': 0.5 } });
registerExercise({ id: 'unilateral_leg_press', name: 'Unilateral Leg Press', equipment: 'machine', unilateral: true, muscleMap: { quads: 1.0, 'glúteos': 0.5 } });
registerExercise({ id: 'eccentric_leg_extension', name: 'Eccentric-Accentuated Leg Extension', equipment: 'machine', muscleMap: { quads: 1.0 } });
registerExercise({ id: 'sissy_squat', name: 'Sissy Squat', equipment: 'bodyweight', bodyweightLoadable: true, muscleMap: { quads: 1.0 } });

// ---------------------------------------------------------------------------
// Terra / posterior
// ---------------------------------------------------------------------------
registerExercise({ id: 'reset_deadlift', name: 'Reset Deadlift', equipment: 'barbell', percentRef: 'deadlift', muscleMap: { 'glúteos': 1.0, hamstrings: 0.5, erectors: 0.5, costas: 0.5 } });
registerExercise({ id: 'opposite_stance_deadlift', name: 'Opposite Stance Deadlift', equipment: 'barbell', percentRef: 'deadlift', muscleMap: { 'glúteos': 1.0, quads: 0.5, hamstrings: 0.5, erectors: 0.5 } });
registerExercise({ id: 'block_pull_6', name: '6" Block Pull', equipment: 'barbell', percentRef: 'deadlift', muscleMap: { 'glúteos': 0.5, erectors: 0.5, hamstrings: 0.5, costas: 0.5, 'trapézio': 0.5 } });
registerExercise({ id: 'block_pull_4', name: '4" Block Pull', equipment: 'barbell', percentRef: 'deadlift', muscleMap: { 'glúteos': 0.5, erectors: 0.5, hamstrings: 0.5, costas: 0.5, 'trapézio': 0.5 } });
registerExercise({ id: 'block_pull_2', name: '2" Block Pull', equipment: 'barbell', percentRef: 'deadlift', muscleMap: { 'glúteos': 1.0, erectors: 0.5, hamstrings: 0.5, costas: 0.5, 'trapézio': 0.5 } });
registerExercise({ id: 'block_pull_1', name: '1" Block Pull', equipment: 'barbell', percentRef: 'deadlift', muscleMap: { 'glúteos': 1.0, erectors: 0.5, hamstrings: 0.5, costas: 0.5, 'trapézio': 0.5 } });
registerExercise({ id: 'barbell_rdl', name: 'Barbell RDL', equipment: 'barbell', muscleMap: { hamstrings: 1.0, 'glúteos': 0.5, erectors: 0.5 } });
registerExercise({ id: 'ghr', name: 'Glute-Ham Raise', equipment: 'bodyweight', bodyweightLoadable: true, muscleMap: { hamstrings: 1.0, 'glúteos': 0.5, erectors: 0.5 } });
registerExercise({ id: 'nordic_ham_curl', name: 'Nordic Ham Curl', equipment: 'bodyweight', bodyweightLoadable: true, muscleMap: { hamstrings: 1.0 } });
registerExercise({ id: 'leg_curl', name: 'Leg Curl (Choice)', equipment: 'machine', muscleMap: { hamstrings: 1.0 } });
registerExercise({ id: 'unilateral_leg_curl', name: 'Unilateral Leg Curl (Choice)', equipment: 'machine', unilateral: true, muscleMap: { hamstrings: 1.0 } });
registerExercise({ id: 'sliding_leg_curl', name: 'Sliding Leg Curl', equipment: 'bodyweight', bodyweightLoadable: true, muscleMap: { hamstrings: 1.0, 'glúteos': 0.5 } });
registerExercise({ id: 'single_leg_hip_thrust', name: 'Single-leg Hip Thrust', equipment: 'bodyweight', bodyweightLoadable: true, unilateral: true, muscleMap: { 'glúteos': 1.0, hamstrings: 0.5 } });
registerExercise({ id: 'cable_pull_through', name: 'Cable Pull-Through', equipment: 'machine', muscleMap: { 'glúteos': 1.0, hamstrings: 0.5 } });
registerExercise({ id: 'prisoner_back_extension', name: 'Prisoner Back Extension', equipment: 'bodyweight', bodyweightLoadable: true, muscleMap: { erectors: 1.0, 'glúteos': 0.5, hamstrings: 0.5 } });
registerExercise({ id: 'hip_abduction', name: 'Hip Abduction', equipment: 'machine', muscleMap: { abdutores: 1.0, 'glúteos': 0.5 } });

// ---------------------------------------------------------------------------
// Panturrilha
// ---------------------------------------------------------------------------
registerExercise({ id: 'standing_calf_raise', name: 'Standing Calf Raise', equipment: 'machine', muscleMap: { panturrilha: 1.0 } });
registerExercise({ id: 'unilateral_standing_calf_raise', name: 'Unilateral Standing Calf Raise', equipment: 'machine', unilateral: true, muscleMap: { panturrilha: 1.0 } });
registerExercise({ id: 'enhanced_eccentric_calf_raise', name: 'Enhanced-Eccentric Calf Raise', equipment: 'machine', unilateral: true, muscleMap: { panturrilha: 1.0 } });

// ---------------------------------------------------------------------------
// Empurrar — peito / ombro / tríceps
// ---------------------------------------------------------------------------
registerExercise({ id: 'pause_bench_press', name: 'Pause Barbell Bench Press', equipment: 'barbell', percentRef: 'bench', muscleMap: { peito: 1.0, 'deltóide_anterior': 0.5, 'tríceps': 0.5 } });
registerExercise({ id: 'ohp', name: 'Barbell Overhead Press', equipment: 'barbell', percentRef: 'ohp', muscleMap: { 'deltóide_anterior': 1.0, 'tríceps': 0.5, 'deltóide_lateral': 0.5 } });
registerExercise({ id: 'pause_db_incline_press', name: 'Pause DB Incline Press', equipment: 'dumbbell', muscleMap: { peito: 1.0, 'deltóide_anterior': 0.5, 'tríceps': 0.5 } });
registerExercise({ id: 'machine_incline_press', name: 'Machine Incline Press', equipment: 'machine', muscleMap: { peito: 1.0, 'deltóide_anterior': 0.5, 'tríceps': 0.5 } });
registerExercise({ id: 'pec_flye', name: 'Pec Flye', equipment: 'machine', muscleMap: { peito: 1.0 } });
registerExercise({ id: 'dip', name: 'Dip', equipment: 'bodyweight', bodyweightLoadable: true, muscleMap: { peito: 1.0, 'tríceps': 1.0, 'deltóide_anterior': 0.5 } });
registerExercise({ id: 'deficit_pushup', name: 'Deficit Push-up', equipment: 'bodyweight', bodyweightLoadable: true, muscleMap: { peito: 1.0, 'tríceps': 0.5, 'deltóide_anterior': 0.5 } });
registerExercise({ id: 'triceps_pressdown_21s', name: 'Triceps Pressdown 21s', equipment: 'machine', muscleMap: { 'tríceps': 1.0 } });
registerExercise({ id: 'cable_triceps_kickback', name: 'Cable Triceps Kickback', equipment: 'machine', muscleMap: { 'tríceps': 1.0 } });
registerExercise({ id: 'constant_tension_kickback', name: 'Constant-Tension Cable Triceps Kickback', equipment: 'machine', muscleMap: { 'tríceps': 1.0 } });
registerExercise({ id: 'single_arm_oh_triceps_ext', name: 'Single-Arm Overhead Triceps Extension', equipment: 'machine', unilateral: true, muscleMap: { 'tríceps': 1.0 } });

// ---------------------------------------------------------------------------
// Puxar — costas / bíceps
// ---------------------------------------------------------------------------
registerExercise({ id: 'weighted_pullup', name: 'Weighted Pull-up', equipment: 'bodyweight', bodyweightLoadable: true, muscleMap: { costas: 1.0, 'bíceps': 0.5, braquial: 0.5 } });
registerExercise({ id: 'weighted_neutral_grip_pullup', name: 'Weighted Neutral-Grip Pull-up', equipment: 'bodyweight', bodyweightLoadable: true, muscleMap: { costas: 1.0, 'bíceps': 0.5, braquial: 0.5 } });
registerExercise({ id: 'eccentric_overload_pullup', name: 'Weighted Eccentric-Overload Pull-up', equipment: 'bodyweight', bodyweightLoadable: true, muscleMap: { costas: 1.0, 'bíceps': 0.5 } });
registerExercise({ id: 'eccentric_accentuated_pullup', name: 'Eccentric-Accentuated Pull-up', equipment: 'bodyweight', bodyweightLoadable: true, muscleMap: { costas: 1.0, 'bíceps': 0.5 } });
registerExercise({ id: 'chinup', name: 'Chin-up', equipment: 'bodyweight', bodyweightLoadable: true, muscleMap: { costas: 1.0, 'bíceps': 0.75 } });
registerExercise({ id: 'wide_grip_lat_pulldown', name: 'Wide-Grip Lat Pulldown', equipment: 'machine', muscleMap: { costas: 1.0, 'bíceps': 0.5 } });
registerExercise({ id: 'omni_grip_lat_pulldown', name: 'Omni-Grip Lat Pulldown', equipment: 'machine', muscleMap: { costas: 1.0, 'bíceps': 0.5 } });
registerExercise({ id: 'single_arm_pulldown', name: 'Single-Arm Pulldown', equipment: 'machine', unilateral: true, muscleMap: { costas: 1.0, 'bíceps': 0.5 } });
registerExercise({ id: 'seated_cable_row', name: 'Seated Cable Row', equipment: 'machine', muscleMap: { costas: 1.0, 'bíceps': 0.5, 'deltóide_posterior': 0.5 } });
registerExercise({ id: 'machine_chest_supported_row', name: 'Machine Chest-Supported Row', equipment: 'machine', muscleMap: { costas: 1.0, 'bíceps': 0.5, 'deltóide_posterior': 0.5 } });
registerExercise({ id: 'meadows_row', name: 'Meadows Row', equipment: 'barbell', unilateral: true, muscleMap: { costas: 1.0, 'bíceps': 0.5, 'deltóide_posterior': 0.5 } });
registerExercise({ id: 'one_arm_row', name: 'One-Arm Row', equipment: 'dumbbell', unilateral: true, muscleMap: { costas: 1.0, 'bíceps': 0.5 } });
registerExercise({ id: 'pendlay_row', name: 'Pendlay Row / Bent Over Row', equipment: 'barbell', muscleMap: { costas: 1.0, 'bíceps': 0.5, erectors: 0.5 } });
registerExercise({ id: 'hammer_cheat_curl', name: 'Hammer "Cheat" Curl', equipment: 'dumbbell', muscleMap: { 'bíceps': 1.0, braquial: 1.0 } });
registerExercise({ id: 'inverse_zottman_curl', name: 'Inverse Zottman Curl', equipment: 'dumbbell', muscleMap: { 'bíceps': 1.0, braquial: 0.5, 'antebraço': 0.5 } });

// ---------------------------------------------------------------------------
// Deltoides / trapézio / pescoço
// ---------------------------------------------------------------------------
registerExercise({ id: 'egyptian_lateral_raise', name: 'Egyptian Lateral Raise', equipment: 'machine', muscleMap: { 'deltóide_lateral': 1.0 } });
registerExercise({ id: 'db_lateral_raise_21s', name: 'Dumbbell Lateral Raise 21s', equipment: 'dumbbell', muscleMap: { 'deltóide_lateral': 1.0 } });
registerExercise({ id: 'db_lateral_raise_iso_hold', name: 'DB Lateral Raise ISO-Hold', equipment: 'dumbbell', unit: 'seconds', muscleMap: { 'deltóide_lateral': 1.0 } });
registerExercise({ id: 'lateral_raise_choice', name: 'Lateral Raise (Choice)', equipment: 'dumbbell', muscleMap: { 'deltóide_lateral': 1.0 } });
registerExercise({ id: 'cable_reverse_flye', name: 'Cable Reverse Flye', equipment: 'machine', muscleMap: { 'deltóide_posterior': 1.0 } });
registerExercise({ id: 'prone_trap_raise', name: 'Prone Trap Raise', equipment: 'dumbbell', muscleMap: { 'trapézio': 1.0, 'deltóide_posterior': 0.5 } });
registerExercise({ id: 'plate_shrug', name: 'Plate Shrug', equipment: 'dumbbell', muscleMap: { 'trapézio': 1.0 } });
registerExercise({ id: 'cable_shrug_in', name: 'Cable Shrug-In', equipment: 'machine', muscleMap: { 'trapézio': 1.0 } });
registerExercise({ id: 'wall_slide', name: 'Wall Slide', equipment: 'bodyweight', muscleMap: { 'trapézio': 0.5, 'deltóide_posterior': 0.5 } });
registerExercise({ id: 'neck_flexion_extension', name: 'Neck Flexion/Extension', equipment: 'bodyweight', bodyweightLoadable: true, muscleMap: { 'pescoço': 1.0 } });

// ---------------------------------------------------------------------------
// Core / preensão
// ---------------------------------------------------------------------------
registerExercise({ id: 'weighted_crunch', name: 'Weighted Crunch', equipment: 'dumbbell', muscleMap: { 'abdômen': 1.0 } });
registerExercise({ id: 'cable_crunch', name: 'Cable Crunch', equipment: 'machine', muscleMap: { 'abdômen': 1.0 } });
registerExercise({ id: 'hanging_leg_raise', name: 'Hanging Leg Raise', equipment: 'bodyweight', bodyweightLoadable: true, muscleMap: { 'abdômen': 1.0 } });
registerExercise({ id: 'l_sit_hold', name: 'L-Sit Hold', equipment: 'bodyweight', bodyweightLoadable: true, unit: 'seconds', muscleMap: { 'abdômen': 1.0 } });
registerExercise({ id: 'long_lever_plank', name: 'Long-Lever Plank', equipment: 'bodyweight', bodyweightLoadable: true, unit: 'seconds', muscleMap: { 'abdômen': 1.0 } });
registerExercise({ id: 'isometric_hold', name: 'Barbell or DB Isometric Hold', equipment: 'barbell', unit: 'seconds', muscleMap: { 'antebraço': 1.0, 'trapézio': 0.5 } });
