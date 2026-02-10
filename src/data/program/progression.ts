// RPE progression helper: returns RPE string for a given week index within a 4-week block
export function rpeProgression4(weekIdx: number): string {
  const map = ['7', '7-7.5', '7.5-8', '8-8.5'];
  return map[weekIdx] ?? '7-8';
}

// Volume scaling: returns set count scaling for week index within a 4-week block
export function volScale4(base: number, weekIdx: number): number {
  // week 0 = base, week 3 = base+1 (capped reasonable)
  return Math.min(base + Math.floor((weekIdx * 1.5) / 3), base + 2);
}
