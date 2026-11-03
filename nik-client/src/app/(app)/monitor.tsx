import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as investigationsApi from '@/api/investigations';
import { ApiError } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import {
  clearAppleWatchSession,
  getAppleWatchSession,
} from '@/lib/hr/appleWatchSource';
import { createHrReader, parseHrSource } from '@/lib/hr/createHrSource';
import type { HrReader } from '@/lib/hr/types';
import { TestAlgorithm, type TestPhase } from '@/lib/testAlgorithm';

export default function MonitorScreen() {
  const { investigationId, label, note, hrSource: hrSourceParam } = useLocalSearchParams<{
    investigationId: string;
    label?: string;
    note?: string;
    hrSource?: string;
  }>();

  const hrSource = parseHrSource(hrSourceParam);
  const [phase, setPhase] = useState<TestPhase>('stabilizing');
  const [hr, setHr] = useState(68);
  const [seconds, setSeconds] = useState(0);
  const [canFinishEating, setCanFinishEating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rates, setRates] = useState<number[]>([]);
  const [sourceLabel, setSourceLabel] = useState(
    hrSource === 'apple_watch' ? 'Apple Watch' : 'HR simulator',
  );
  const algoRef = useRef<TestAlgorithm | null>(null);
  const readerRef = useRef<HrReader | null>(null);
  const phaseRef = useRef<TestPhase>('stabilizing');

  const title = useMemo(() => {
    switch (phase) {
      case 'stabilizing':
        return 'Settling your pulse';
      case 'ready':
        return 'Ready when you are';
      case 'eating':
        return 'Monitoring intake';
      case 'after':
        return 'After reading';
      case 'done':
        return 'Test complete';
    }
  }, [phase]);

  useEffect(() => {
    phaseRef.current = phase;
    if (hrSource === 'apple_watch') {
      getAppleWatchSession().setPhase(phase);
    }
  }, [phase, hrSource]);

  useEffect(() => {
    const reader = createHrReader(hrSource, phaseRef);
    readerRef.current = reader;
    setSourceLabel(reader.label);

    const algo = new TestAlgorithm(() => reader.read());
    algoRef.current = algo;
    algo.setCallbacks({
      onTick: (tick, value) => {
        setSeconds(tick);
        setHr(value);
        setRates([...algo.heartRates.slice(-24)]);
        if (algo.canShowDoneEating()) setCanFinishEating(true);
      },
      onStabilized: () => setPhase('ready'),
      onAfterComplete: () => {
        setPhase('done');
        void submit(algo);
      },
    });
    algo.start();
    return () => {
      algo.stop();
      reader.stop();
    };
  }, [hrSource]);

  const submit = async (algo: TestAlgorithm) => {
    try {
      setSaving(true);
      algo.stop();
      readerRef.current?.stop();
      if (hrSource === 'apple_watch') clearAppleWatchSession();
      await investigationsApi.createFoodTest(Number(investigationId), algo.toRequest(note || ''));
      Alert.alert('Saved', 'Your pulse test was uploaded.', [
        {
          text: 'Done',
          onPress: () => router.replace(`/(app)/investigation/${investigationId}`),
        },
      ]);
    } catch (err) {
      Alert.alert('Upload failed', err instanceof ApiError ? err.message : 'Try again');
    } finally {
      setSaving(false);
    }
  };

  const startEating = () => {
    algoRef.current?.markEatingStart();
    setPhase('eating');
    setCanFinishEating(false);
  };

  const finishEating = () => {
    algoRef.current?.markEatingEnd();
    setPhase('after');
  };

  const skipAfter = async () => {
    const algo = algoRef.current;
    if (!algo) return;
    algo.skipAfter();
    setPhase('done');
    await submit(algo);
  };

  return (
    <Screen scroll={false} className="justify-between pb-8">
      <View className="gap-2 pt-4">
        <Text className="font-sans-medium text-sm text-teal">{label || 'Pulse test'}</Text>
        <Text className="font-display text-3xl text-ink">{title}</Text>
        <Text className="font-sans text-slate-soft">
          Source: {sourceLabel}
          {hrSource === 'simulator'
            ? ' — generated on-device for testing.'
            : ' — streaming from your Watch session.'}
        </Text>
      </View>

      <View className="items-center gap-4">
        <View className="h-56 w-56 items-center justify-center rounded-full border-[10px] border-teal-soft bg-white">
          <Text className="font-display text-6xl text-ink">{hr || '—'}</Text>
          <Text className="font-sans-medium text-sm uppercase tracking-[2px] text-slate-soft">
            bpm
          </Text>
        </View>
        <Text className="font-sans text-slate-soft">{seconds}s elapsed</Text>
        <View className="h-16 w-full flex-row items-end gap-1 px-2">
          {rates.map((value, index) => (
            <View
              key={`${index}-${value}`}
              className="flex-1 rounded-t-md bg-teal/70"
              style={{ height: Math.max(8, ((value - 50) / 70) * 64) }}
            />
          ))}
        </View>
      </View>

      <View className="gap-3">
        {phase === 'ready' && <Button label="Start eating / drinking" onPress={startEating} />}
        {phase === 'eating' && canFinishEating && (
          <Button label="Done eating" onPress={finishEating} />
        )}
        {phase === 'after' && (
          <Button label="Skip after reading" variant="secondary" onPress={skipAfter} loading={saving} />
        )}
        {phase === 'stabilizing' && (
          <View className="rounded-3xl bg-white/80 p-4">
            <Text className="text-center font-sans text-slate-soft">
              Stay still while NIK waits for a stable baseline…
            </Text>
          </View>
        )}
        {phase === 'done' && saving && (
          <Text className="text-center font-sans text-slate-soft">Saving results…</Text>
        )}
        <Button label="Cancel" variant="ghost" onPress={() => router.back()} disabled={saving} />
      </View>
    </Screen>
  );
}
