import { createSimulatorReader } from './simulatorSource';
import { getAppleWatchSession } from './appleWatchSource';
import type { HrReader, HrSourceKind } from './types';

export function createHrReader(
  kind: HrSourceKind,
  phaseRef: { current: string },
): HrReader {
  if (kind === 'apple_watch') {
    const session = getAppleWatchSession();
    session.setPhase(phaseRef.current);
    return session.createReader();
  }
  return createSimulatorReader(phaseRef);
}

export function parseHrSource(value: unknown): HrSourceKind {
  return value === 'apple_watch' ? 'apple_watch' : 'simulator';
}
