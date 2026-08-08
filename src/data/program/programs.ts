import type { TrainingProgram } from '../../types';
import { programData as legacyWeeks } from './index';
import { powerbuilding2Weeks, POWERBUILDING2_SOURCE_HASH } from './powerbuilding2/generated';
import { venaBlock1Weeks, VENA_BLOCK1_SOURCE_HASH } from './vena-block1/generated';

/** Programa original do app (52 semanas / 6 dias). Mantido para o histórico. */
export const LEGACY_PROGRAM_ID = 'legacy-52w';

export const POWERBUILDING2_ID = 'powerbuilding-2.0';

export const VENA_BLOCK1_ID = 'vena-block1';

export const programs: TrainingProgram[] = [
  {
    id: VENA_BLOCK1_ID,
    name: 'Bloco 1 — Ficar Legal',
    description:
      '18 semanas (16 de bloco + 2 de taper e simulado), 5 dias/semana. Agacho 3x, supino 4x, terra 2x. As semanas 1–3 descobrem as marcas legais por teto de RPE (6 → 7 → 8); a partir da 4 a carga sai de percentual da marca LEGAL (agacho 215, supino 160, terra 240), nunca da declarada. A prioridade do bloco não é ficar mais forte, é ficar legal.',
    source: `PROGRAMA.md (sha256 ${VENA_BLOCK1_SOURCE_HASH})`,
    weeks: venaBlock1Weeks,
  },
  {
    id: POWERBUILDING2_ID,
    name: 'Powerbuilding Phase 2.0',
    author: 'Jeff Nippard',
    description:
      '12 semanas alternando semanas full body de 5 dias e semanas upper/lower de 4 dias. Semana 8 é semi-deload; não há teste formal de 1RM no fim.',
    source: `COMPLETE_WORKOUTS.md (sha256 ${POWERBUILDING2_SOURCE_HASH})`,
    weeks: powerbuilding2Weeks,
  },
  {
    id: LEGACY_PROGRAM_ID,
    name: 'Programa 52 semanas',
    description: 'Programa anterior do app: 4 macrociclos de 13 semanas, 6 sessões por semana.',
    weeks: legacyWeeks,
  },
];

/** Programa carregado quando não há nenhum selecionado. */
export const DEFAULT_PROGRAM_ID = POWERBUILDING2_ID;

export function getProgram(programId?: string): TrainingProgram {
  return programs.find((p) => p.id === programId) ?? programs.find((p) => p.id === DEFAULT_PROGRAM_ID)!;
}

export function listPrograms(): TrainingProgram[] {
  return programs;
}
