import { FoodTestResult } from '../types/enums.js';
import { ValidationError } from '../lib/errors.js';

export interface FoodTestRequestData {
  totalTime: number;
  duringStartTime: number;
  duringEndTime: number;
  afterStartTime: number;
  afterEndTime: number;
  heartRates: number[];
  description?: string;
  skippedAfter?: boolean;
}

export interface CalculatedFoodTest {
  beforeHeartRate: number;
  duringHeartRate: number;
  after1HeartRate: number;
  after2HeartRate: number;
  diffHeartRate: number;
  result: FoodTestResult;
  totalTime: number;
  stdDev: number;
  description?: string;
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function standardDeviation(values: number[]): number {
  if (!values.length) return 0;
  const mean = average(values);
  const variance = average(values.map((v) => (v - mean) ** 2));
  return Math.sqrt(variance);
}

function classifyResult(diff: number): FoodTestResult {
  if (diff >= 16) return FoodTestResult.High;
  if (diff >= 10) return FoodTestResult.Moderate;
  if (diff >= 2) return FoodTestResult.Low;
  return FoodTestResult.NoReaction;
}

export function calculateFoodTestResult(input: FoodTestRequestData): CalculatedFoodTest {
  const {
    heartRates,
    duringStartTime,
    duringEndTime,
    totalTime,
    skippedAfter = true,
    description,
  } = input;

  if (heartRates.length < duringEndTime) {
    throw new ValidationError('Not enough heart rate samples');
  }

  const duringSkipSeconds = 23;
  const beforeTimeFirstDuringSeconds = 5;
  const beforeTimeDuration = 15;
  const beforeFirstDuration = 10;
  const after1ValueSize = 10;
  const after2TimeSpan = 5;
  const maxStdDevSize = 15;

  const stdDev = standardDeviation(heartRates.slice(0, maxStdDevSize));

  const beforeValues: number[] = [];
  const startPos = beforeTimeDuration - beforeFirstDuration;
  for (let i = 0; i < beforeTimeDuration; i++) {
    beforeValues.push(heartRates[startPos + i] ?? 0);
  }
  for (let i = duringStartTime + 1; i <= beforeTimeFirstDuringSeconds; i++) {
    beforeValues.push(heartRates[i] ?? 0);
  }
  const beforeHeartRate = Math.trunc(average(beforeValues));

  const duringValues: number[] = [];
  const duringStart = duringStartTime + duringSkipSeconds;
  for (let i = duringStart; i < duringEndTime; i++) {
    duringValues.push(heartRates[i] ?? 0);
  }
  const duringHeartRate = Math.trunc(average(duringValues));
  const diffHeartRate = duringHeartRate - beforeHeartRate;
  const result = classifyResult(diffHeartRate);

  let after1HeartRate = 0;
  let after2HeartRate = 0;

  if (!skippedAfter) {
    const afterStart = duringEndTime + 1;
    if (afterStart < heartRates.length) {
      const after1Window: number[] = [];
      for (let i = 0; i < after1ValueSize; i++) {
        after1Window.push(heartRates[afterStart + i] ?? 0);
      }
      after1Window.sort((a, b) => a - b);
      after1HeartRate = Math.trunc(
        average([
          after1Window[after1ValueSize - 1],
          after1Window[after1ValueSize - 2],
          after1Window[after1ValueSize - 3],
        ]),
      );

      const after2Values: number[] = [];
      for (let i = 0; i < after2TimeSpan; i++) {
        after2Values.push(heartRates[heartRates.length - 1 - i] ?? 0);
      }
      after2HeartRate = Math.trunc(average(after2Values));
    }
  }

  return {
    beforeHeartRate,
    duringHeartRate,
    after1HeartRate,
    after2HeartRate,
    diffHeartRate,
    result,
    totalTime,
    stdDev: Number(stdDev.toFixed(2)),
    description,
  };
}
