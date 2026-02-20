// IPF Classic (Raw) World Records - Drug Tested (as of 2024/2025)
// Source: IPF/Goodlift official records for classic powerlifting

export interface WeightClassInfo {
  label: string;
  maxBW: number;    // upper limit in kg (999 = SHW)
  minBW: number;    // lower limit in kg
}

export const maleWeightClasses: WeightClassInfo[] = [
  { label: '59kg', minBW: 0, maxBW: 59 },
  { label: '66kg', minBW: 59.01, maxBW: 66 },
  { label: '74kg', minBW: 66.01, maxBW: 74 },
  { label: '83kg', minBW: 74.01, maxBW: 83 },
  { label: '93kg', minBW: 83.01, maxBW: 93 },
  { label: '105kg', minBW: 93.01, maxBW: 105 },
  { label: '120kg', minBW: 105.01, maxBW: 120 },
  { label: '120+kg', minBW: 120.01, maxBW: 999 },
];

export const femaleWeightClasses: WeightClassInfo[] = [
  { label: '47kg', minBW: 0, maxBW: 47 },
  { label: '52kg', minBW: 47.01, maxBW: 52 },
  { label: '57kg', minBW: 52.01, maxBW: 57 },
  { label: '63kg', minBW: 57.01, maxBW: 63 },
  { label: '69kg', minBW: 63.01, maxBW: 69 },
  { label: '76kg', minBW: 69.01, maxBW: 76 },
  { label: '84kg', minBW: 76.01, maxBW: 84 },
  { label: '84+kg', minBW: 84.01, maxBW: 999 },
];

export interface WorldRecord {
  weightClass: string;
  squat: number;
  bench: number;
  deadlift: number;
  total: number;
}

// IPF Classic Raw World Records - Open category (Men)
export const maleWorldRecords: WorldRecord[] = [
  { weightClass: '59kg', squat: 233.5, bench: 165, deadlift: 262.5, total: 640 },
  { weightClass: '66kg', squat: 268, bench: 187.5, deadlift: 295, total: 720 },
  { weightClass: '74kg', squat: 295, bench: 207.5, deadlift: 317.5, total: 795 },
  { weightClass: '83kg', squat: 320, bench: 221, deadlift: 340, total: 862.5 },
  { weightClass: '93kg', squat: 340, bench: 240, deadlift: 362.5, total: 920 },
  { weightClass: '105kg', squat: 375, bench: 252.5, deadlift: 380.5, total: 985 },
  { weightClass: '120kg', squat: 400.5, bench: 265, deadlift: 397.5, total: 1042.5 },
  { weightClass: '120+kg', squat: 422.5, bench: 282.5, deadlift: 410, total: 1100 },
];

// IPF Classic Raw World Records - Open category (Women)
export const femaleWorldRecords: WorldRecord[] = [
  { weightClass: '47kg', squat: 161.5, bench: 98, deadlift: 192.5, total: 440 },
  { weightClass: '52kg', squat: 182.5, bench: 108, deadlift: 207.5, total: 482.5 },
  { weightClass: '57kg', squat: 200, bench: 120.5, deadlift: 222.5, total: 525 },
  { weightClass: '63kg', squat: 215.5, bench: 135, deadlift: 237.5, total: 570 },
  { weightClass: '69kg', squat: 230, bench: 145, deadlift: 247.5, total: 600 },
  { weightClass: '76kg', squat: 245, bench: 155, deadlift: 257.5, total: 637.5 },
  { weightClass: '84kg', squat: 262.5, bench: 165, deadlift: 270, total: 672.5 },
  { weightClass: '84+kg', squat: 285, bench: 180.5, deadlift: 290, total: 725 },
];

export function getWeightClass(bodyweight: number, isMale = true): WeightClassInfo | null {
  const classes = isMale ? maleWeightClasses : femaleWeightClasses;
  return classes.find(c => bodyweight >= c.minBW && bodyweight <= c.maxBW) ?? null;
}

export function getWorldRecord(bodyweight: number, isMale = true): WorldRecord | null {
  const wc = getWeightClass(bodyweight, isMale);
  if (!wc) return null;
  const records = isMale ? maleWorldRecords : femaleWorldRecords;
  return records.find(r => r.weightClass === wc.label) ?? null;
}

export interface RecordComparison {
  weightClass: string;
  squat: { current: number; record: number; percentage: number; deficit: number };
  bench: { current: number; record: number; percentage: number; deficit: number };
  deadlift: { current: number; record: number; percentage: number; deficit: number };
  total: { current: number; record: number; percentage: number; deficit: number };
}

export function compareToWorldRecord(
  bodyweight: number,
  squat: number,
  bench: number,
  deadlift: number,
  isMale = true
): RecordComparison | null {
  const record = getWorldRecord(bodyweight, isMale);
  const wc = getWeightClass(bodyweight, isMale);
  if (!record || !wc) return null;

  const total = squat + bench + deadlift;

  const compare = (current: number, rec: number) => ({
    current,
    record: rec,
    percentage: rec > 0 ? Math.round((current / rec) * 1000) / 10 : 0,
    deficit: Math.round((rec - current) * 10) / 10,
  });

  return {
    weightClass: wc.label,
    squat: compare(squat, record.squat),
    bench: compare(bench, record.bench),
    deadlift: compare(deadlift, record.deadlift),
    total: compare(total, record.total),
  };
}

// Nearby weight classes for strategic analysis
export function getNearbyWeightClasses(bodyweight: number, isMale = true): {
  current: WeightClassInfo;
  lower: WeightClassInfo | null;
  upper: WeightClassInfo | null;
} | null {
  const classes = isMale ? maleWeightClasses : femaleWeightClasses;
  const idx = classes.findIndex(c => bodyweight >= c.minBW && bodyweight <= c.maxBW);
  if (idx === -1) return null;

  return {
    current: classes[idx],
    lower: idx > 0 ? classes[idx - 1] : null,
    upper: idx < classes.length - 1 ? classes[idx + 1] : null,
  };
}
