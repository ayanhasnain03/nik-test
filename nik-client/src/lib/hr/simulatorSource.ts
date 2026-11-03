import { nextSimulatedHeartRate } from '@/lib/hrSimulator';
import type { HrReader, HrSourceKind } from './types';

function toSimPhase(phase: string): string {
  if (phase === 'eating') return 'during';
  if (phase === 'ready' || phase === 'stabilizing') return 'baseline';
  return phase;
}

export function createSimulatorReader(phaseRef: { current: string }): HrReader {
  let prev = 68;
  return {
    kind: 'simulator' satisfies HrSourceKind,
    label: 'Watch simulator',
    read: () => {
      prev = nextSimulatedHeartRate(prev, toSimPhase(phaseRef.current));
      return prev;
    },
    stop: () => undefined,
  };
}
