import type { TrainingProgram } from '../../types';
import { programData as legacyWeeks } from './index';
import { powerbuilding2Weeks, POWERBUILDING2_SOURCE_HASH } from './powerbuilding2/generated';

/** Programa original do app (52 semanas / 6 dias). Mantido para o histórico. */
export const LEGACY_PROGRAM_ID = 'legacy-52w';

export const POWERBUILDING2_ID = 'powerbuilding-2.0';

export const programs: TrainingProgram[] = [
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
