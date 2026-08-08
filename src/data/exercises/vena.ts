/**
 * Catálogo de exercícios do Bloco 1 — "Ficar Legal" (vena-block1).
 *
 * Só os movimentos que o bloco introduz. Tudo o que já existia no catálogo é
 * reaproveitado pelo id (ver `scripts/exercise-map.mjs`), para preservar PRs,
 * e1RM e histórico.
 *
 * Por que ids NOVOS para agacho, supino e terra: o padrão de execução muda no
 * Bloco 1 (profundidade legal, pausa de competição real, sem strap com parada
 * morta). São marcas de ~215/160/240 contra as ~250/170/268 declaradas
 * (`baseline.md` §4). Reutilizar `agachamento_low_bar`, `supino_wide_grip` e
 * `deadlift_sumo` misturaria os dois padrões no mesmo histórico de e1RM.
 *
 * Todos declaram `percentRef`. Os percentuais deste programa são contra a
 * marca LEGAL (215/160/240), não contra a declarada, e é `trainingMax` no
 * perfil que carrega esse número — o "technical max" de Brett Gibbs, o maior
 * peso movido sem degradar a técnica. Ver `src/domain/referenceMax.ts`.
 * A calibração das semanas 1–3 é o que alimenta e re-ancora esse valor.
 */
import { registerExercise } from '../../domain/exerciseRegistry';

registerExercise({
  id: 'agachamento_low_bar_legal',
  name: 'Agachamento Low Bar (Profundidade Legal)',
  equipment: 'barbell',
  percentRef: 'squat',
  muscleMap: { quads: 1.0, 'glúteos': 0.5, erectors: 0.5, 'abdômen': 0.5 },
});

registerExercise({
  id: 'agachamento_high_bar',
  name: 'Agachamento High Bar',
  equipment: 'barbell',
  percentRef: 'squat',
  muscleMap: { quads: 1.0, 'glúteos': 0.5, erectors: 0.5 },
});

registerExercise({
  id: 'agachamento_pausa_acima_paralelo',
  name: 'Agachamento com Pausa Acima do Paralelo',
  equipment: 'barbell',
  percentRef: 'squat',
  muscleMap: { quads: 1.0, 'glúteos': 0.5, erectors: 0.5 },
});

registerExercise({
  id: 'supino_pausado_competicao',
  name: 'Supino Pausado (Competição)',
  equipment: 'barbell',
  percentRef: 'bench',
  muscleMap: { peito: 1.0, 'deltóide_anterior': 0.5, 'tríceps': 0.5 },
});

registerExercise({
  id: 'terra_sumo_sem_strap',
  name: 'Terra Sumo (Sem Strap)',
  equipment: 'barbell',
  percentRef: 'deadlift',
  // Costas entra com crédito PARCIAL (0,5), não cheio: no sumo o dorsal é
  // estabilizador isométrico, não agonista. `design.md` §10-B fixa o crédito de
  // série indireta em 0,5 (Pelland 2025; confirmado por Mannarino, 0,47), e
  // 1,0 era o único secundário do mapa com peso cheio — ao lado do agonista
  // glúteos, e contra os 0,5 que agacho e supino dão a TODOS os seus
  // secundários. A correção anterior consertava um bug real (crédito zero) e
  // passou do ponto na direção oposta: levava `costas` de 12 diretas a 20
  // ponderadas; a 0,5 são 16, e as relações de R4 (costas > bíceps > delt
  // lateral) continuam valendo.
  muscleMap: { 'glúteos': 1.0, quads: 0.5, erectors: 0.5, hamstrings: 0.5, costas: 0.5, 'trapézio': 0.5, 'antebraço': 0.5 },
});

registerExercise({
  id: 'stiff_legged_deadlift',
  name: 'Stiff-Legged Deadlift',
  equipment: 'barbell',
  muscleMap: { hamstrings: 1.0, erectors: 1.0, 'glúteos': 0.5 },
});

registerExercise({
  id: 'crucifixo_halter',
  name: 'Crucifixo com Halteres em Posição Alongada',
  equipment: 'dumbbell',
  muscleMap: { peito: 1.0, 'deltóide_anterior': 0.5 },
});

registerExercise({
  id: 'puxada_neutra',
  name: 'Puxada Vertical (Pegada Neutra)',
  equipment: 'machine',
  // Substitui a barra fixa com peso do roster de elites: barra fixa NÃO está no
  // inventário confirmado da academia (design.md §0-B) e a máquina de puxada
  // está. A dose de costas foi preservada, o aparelho não.
  muscleMap: { costas: 1.0, 'bíceps': 0.5, 'deltóide_posterior': 0.5 },
});

registerExercise({
  id: 'crucifixo_peck_deck',
  name: 'Crucifixo no Peck Deck',
  equipment: 'machine',
  // ⚠️ Zero ocorrências de crucifixo/peck deck/voador no corpus do canal: esta
  // linha é [interpretação] com procedência externa (Nippard PB2.0). Peck deck
  // e não halter porque a única dose que Vena documenta como recuperável dia a
  // dia é em máquina "bem estável" [R20 @03:36] [PESSOAL].
  muscleMap: { peito: 1.0, 'deltóide_anterior': 0.5 },
});
