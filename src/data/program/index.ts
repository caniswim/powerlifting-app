import { buildMac1, buildMac2, buildMac3, buildMac4 } from './macrocycles';
import type { PrescribedWeek } from '../../types';

export const programData: PrescribedWeek[] = [
  ...buildMac1(),
  ...buildMac2(),
  ...buildMac3(),
  ...buildMac4(),
];

export function getWeekData(weekNumber: number): PrescribedWeek | undefined {
  return programData.find((w) => w.weekNumber === weekNumber);
}

// Re-export for backward compat
export { programData as default };
