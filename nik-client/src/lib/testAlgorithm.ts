export type TestPhase = 'stabilizing' | 'ready' | 'eating' | 'after' | 'done';

export class TestAlgorithm {
  heartRates: number[] = [];
  totalTimeSpan = 0;
  isStabilized = false;
  duringStartTime = -1;
  duringEndTime = -1;
  afterStartTime = -1;
  afterEndTime = -1;
  skippedAfter = false;

  stabilizationDuration = 15;
  maxStdDevValue = 2.5;
  afterDuration = 25;
  doneEatingVisibilityDelay = 35;

  private timer: ReturnType<typeof setInterval> | null = null;
  private onTick?: (tick: number, hr: number) => void;
  private onStabilized?: () => void;
  private onAfterComplete?: () => void;
  private currentHr = 68;
  private getHeartRate: () => number;

  constructor(getHeartRate: () => number) {
    this.getHeartRate = getHeartRate;
  }

  setCallbacks(opts: {
    onTick?: (tick: number, hr: number) => void;
    onStabilized?: () => void;
    onAfterComplete?: () => void;
  }) {
    this.onTick = opts.onTick;
    this.onStabilized = opts.onStabilized;
    this.onAfterComplete = opts.onAfterComplete;
  }

  start() {
    this.stop();
    this.heartRates = [];
    this.totalTimeSpan = 0;
    this.isStabilized = false;
    this.duringStartTime = -1;
    this.duringEndTime = -1;
    this.afterStartTime = -1;
    this.afterEndTime = -1;
    this.skippedAfter = false;
    this.currentHr = 68;

    this.timer = setInterval(() => {
      const sample = this.getHeartRate();
      if (!sample || sample <= 0) {
        this.onTick?.(this.totalTimeSpan, this.currentHr);
        return;
      }
      this.currentHr = sample;
      this.heartRates.push(this.currentHr);
      this.totalTimeSpan += 1;
      this.checkStabilization();
      if (
        this.afterStartTime !== -1 &&
        !this.skippedAfter &&
        this.totalTimeSpan - this.afterStartTime > this.afterDuration
      ) {
        this.afterEndTime = this.totalTimeSpan;
        this.onAfterComplete?.();
      }
      this.onTick?.(this.totalTimeSpan, this.currentHr);
    }, 1000);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private stdDev(values: number[]) {
    if (!values.length) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
    return Math.sqrt(variance);
  }

  private checkStabilization() {
    if (this.isStabilized) return;
    if (this.heartRates.length < this.stabilizationDuration) return;
    const window = this.heartRates.slice(0, this.stabilizationDuration);
    if (this.stdDev(window) <= this.maxStdDevValue || this.totalTimeSpan > this.stabilizationDuration) {
      this.isStabilized = true;
      this.onStabilized?.();
    } else if (this.totalTimeSpan > this.stabilizationDuration) {
      this.heartRates = [];
      this.totalTimeSpan = 0;
    }
  }

  canShowDoneEating() {
    return (
      this.duringStartTime !== -1 &&
      this.totalTimeSpan - this.duringStartTime >= this.doneEatingVisibilityDelay
    );
  }

  markEatingStart() {
    this.duringStartTime = this.totalTimeSpan;
  }

  markEatingEnd() {
    this.duringEndTime = this.totalTimeSpan;
    this.afterStartTime = this.totalTimeSpan;
  }

  skipAfter() {
    this.skippedAfter = true;
    this.afterEndTime = this.totalTimeSpan;
  }

  toRequest(description: string) {
    return {
      total_time: this.totalTimeSpan,
      during_start_time: Math.max(0, this.duringStartTime),
      during_end_time: Math.max(0, this.duringEndTime),
      after_start_time: Math.max(0, this.afterStartTime),
      after_end_time: Math.max(0, this.afterEndTime),
      heart_rates: [...this.heartRates],
      description,
      skipped_after: this.skippedAfter,
    };
  }
}
