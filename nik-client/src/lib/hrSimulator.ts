export function nextSimulatedHeartRate(prev: number, phase: string): number {
  const base =
    phase === 'during' ? 78 : phase === 'after' ? 72 : phase === 'baseline' ? 68 : 66;
  const drift = Math.round((Math.random() - 0.5) * (phase === 'during' ? 8 : 4));
  const next = Math.round(prev * 0.7 + (base + drift) * 0.3);
  return Math.max(52, Math.min(120, next));
}
