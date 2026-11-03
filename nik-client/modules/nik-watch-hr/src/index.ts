import { Platform } from 'react-native';
import {
  requireNativeModule,
  type EventSubscription,
  type NativeModule,
} from 'expo-modules-core';

export type WatchConnectionState = {
  supported: boolean;
  paired: boolean;
  reachable: boolean;
  watchAppInstalled: boolean;
  activated: boolean;
  latestBpm: number;
  lastMessage?: string;
};

type NikWatchHrEvents = {
  onHeartRate: (event: { bpm: number }) => void;
  onStatus: (event: { message: string }) => void;
};

type NikWatchHrNative = NativeModule<NikWatchHrEvents> & {
  isAvailable: () => boolean;
  getConnectionState: () => Promise<WatchConnectionState>;
  requestAuthorization: () => Promise<boolean>;
  connect: () => Promise<WatchConnectionState>;
  getLatestHeartRate: () => Promise<number | null>;
  pingWatch: (command?: string) => Promise<void>;
};

const isIos = Platform.OS === 'ios';

let Native: NikWatchHrNative | null = null;

try {
  if (isIos) {
    Native = requireNativeModule<NikWatchHrNative>('NikWatchHr');
  }
} catch {
  Native = null;
}

export function isNativeWatchBridgeAvailable(): boolean {
  try {
    return Boolean(Native?.isAvailable?.());
  } catch {
    return false;
  }
}

export async function getConnectionState(): Promise<WatchConnectionState> {
  if (!Native) {
    return {
      supported: false,
      paired: false,
      reachable: false,
      watchAppInstalled: false,
      activated: false,
      latestBpm: 0,
    };
  }
  return Native.getConnectionState();
}

export async function requestAuthorization(): Promise<boolean> {
  if (!Native) return false;
  return Native.requestAuthorization();
}

export async function connectWatch(): Promise<WatchConnectionState> {
  if (!Native) {
    throw new Error(
      'Apple Watch bridge is not in this build. Use an iOS development build (expo run:ios / EAS) with the NIK Watch app.',
    );
  }
  return Native.connect();
}

export async function getLatestHeartRate(): Promise<number | null> {
  if (!Native) return null;
  const value = await Native.getLatestHeartRate();
  return value == null ? null : Number(value);
}

export function addHeartRateListener(
  listener: (bpm: number) => void,
): EventSubscription | null {
  if (!Native) return null;
  return Native.addListener('onHeartRate', (event) => {
    if (typeof event?.bpm === 'number' && event.bpm > 0) listener(event.bpm);
  });
}

export function addStatusListener(
  listener: (message: string) => void,
): EventSubscription | null {
  if (!Native) return null;
  return Native.addListener('onStatus', (event) => {
    if (typeof event?.message === 'string') listener(event.message);
  });
}
