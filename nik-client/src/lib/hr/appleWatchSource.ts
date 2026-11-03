import { Platform } from 'react-native';
import type { EventSubscription } from 'expo-modules-core';
import * as NikWatchHr from 'nik-watch-hr';
import type { HrReader, WatchConnectionStatus } from './types';

export class AppleWatchSession {
  status: WatchConnectionStatus = 'idle';
  latestBpm = 0;
  message = 'Open the NIK app on your Apple Watch, allow Health access, then tap Connect.';
  private subscriptions: EventSubscription[] = [];
  private phaseRef: { current: string } = { current: 'stabilizing' };
  private listeners = new Set<(status: WatchConnectionStatus) => void>();

  onStatus(listener: (status: WatchConnectionStatus) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private setStatus(status: WatchConnectionStatus, message?: string) {
    this.status = status;
    if (message) this.message = message;
    this.listeners.forEach((l) => l(status));
  }

  setPhase(phase: string) {
    if (phase === 'eating') this.phaseRef.current = 'during';
    else if (phase === 'ready' || phase === 'stabilizing') this.phaseRef.current = 'baseline';
    else this.phaseRef.current = phase;
  }

  private bindNativeListeners() {
    this.clearNativeListeners();
    const hrSub = NikWatchHr.addHeartRateListener((bpm) => {
      this.latestBpm = Math.round(bpm);
      if (this.status !== 'connected' && bpm > 0) {
        this.setStatus('connected', 'Apple Watch connected — streaming heart rate.');
      }
    });
    const statusSub = NikWatchHr.addStatusListener((msg) => {
      if (this.status === 'connected') return;
      this.message = msg;
      this.listeners.forEach((l) => l(this.status));
    });
    if (hrSub) this.subscriptions.push(hrSub);
    if (statusSub) this.subscriptions.push(statusSub);
  }

  private clearNativeListeners() {
    for (const sub of this.subscriptions) sub.remove();
    this.subscriptions = [];
  }

  async connect(): Promise<WatchConnectionStatus> {
    this.setStatus('searching', 'Looking for your Apple Watch…');

    if (Platform.OS !== 'ios') {
      this.setStatus(
        'unavailable',
        'Apple Watch requires an iPhone. Use Watch simulator on this device to test the pulse flow.',
      );
      return this.status;
    }

    if (!NikWatchHr.isNativeWatchBridgeAvailable()) {
      this.setStatus(
        'unavailable',
        'Live Watch needs an iOS development build with the NIK Watch app (expo run:ios / EAS). Expo Go cannot stream Watch HR.',
      );
      return this.status;
    }

    try {
      this.bindNativeListeners();
      this.setStatus('authorizing', 'Requesting Health permissions…');
      await NikWatchHr.requestAuthorization();

      this.setStatus('searching', 'Connecting to Apple Watch…');
      const state = await NikWatchHr.connectWatch();

      if (!state.paired) {
        this.setStatus('error', 'No Apple Watch paired with this iPhone.');
        return this.status;
      }
      if (!state.watchAppInstalled) {
        this.setStatus(
          'error',
          'Install the NIK app on your Apple Watch, open it, allow Health, then tap Connect again.',
        );
        return this.status;
      }

      const sample = await NikWatchHr.getLatestHeartRate();
      if (sample && sample > 0) {
        this.latestBpm = Math.round(sample);
        this.setStatus('connected', 'Apple Watch connected — streaming heart rate.');
        return this.status;
      }

      this.setStatus(
        'connected',
        state.reachable
          ? 'Watch linked. On the Watch, open NIK and tap Start — BPM will appear here.'
          : 'Watch paired. Open NIK on the Watch, tap Start, then keep this screen open.',
      );
      return this.status;
    } catch (err) {
      this.setStatus(
        'error',
        err instanceof Error ? err.message : 'Could not reach Apple Watch.',
      );
      return this.status;
    }
  }

  disconnect() {
    this.clearNativeListeners();
    this.latestBpm = 0;
    this.setStatus(
      'idle',
      'Open the NIK app on your Apple Watch, allow Health access, then tap Connect.',
    );
  }

  createReader(): HrReader {
    return {
      kind: 'apple_watch',
      label: 'Apple Watch',
      read: () => this.latestBpm || 0,
      stop: () => undefined,
    };
  }
}

let activeSession: AppleWatchSession | null = null;

export function getAppleWatchSession(): AppleWatchSession {
  if (!activeSession) activeSession = new AppleWatchSession();
  return activeSession;
}

export function clearAppleWatchSession() {
  activeSession?.disconnect();
  activeSession = null;
}
