export type HrSourceKind = 'simulator' | 'apple_watch';

export type WatchConnectionStatus =
  | 'idle'
  | 'searching'
  | 'authorizing'
  | 'connected'
  | 'unavailable'
  | 'error';

export type HrSample = {
  bpm: number;
  at: number;
  source: HrSourceKind;
};

export type HrReader = {
  kind: HrSourceKind;
  read: () => number;
  stop: () => void;
  label: string;
};
