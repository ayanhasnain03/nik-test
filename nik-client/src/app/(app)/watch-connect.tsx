import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import {
  clearAppleWatchSession,
  getAppleWatchSession,
} from '@/lib/hr/appleWatchSource';
import type { WatchConnectionStatus } from '@/lib/hr/types';

export default function WatchConnectScreen() {
  const params = useLocalSearchParams<{
    investigationId: string;
    label?: string;
    note?: string;
  }>();

  const [status, setStatus] = useState<WatchConnectionStatus>('idle');
  const [message, setMessage] = useState(
    'Open the NIK app on your Apple Watch, allow Health access, then tap Connect.',
  );
  const [bpm, setBpm] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const session = getAppleWatchSession();
    setStatus(session.status);
    setMessage(session.message);
    setBpm(session.latestBpm);
    const unsub = session.onStatus(() => {
      setStatus(session.status);
      setMessage(session.message);
      setBpm(session.latestBpm);
    });
    const tick = setInterval(() => setBpm(session.latestBpm), 400);
    return () => {
      unsub();
      clearInterval(tick);
    };
  }, []);

  const goMonitor = () => {
    router.replace({
      pathname: '/(app)/monitor',
      params: {
        investigationId: params.investigationId,
        label: params.label || 'Pulse test',
        note: params.note || '',
        hrSource: 'apple_watch',
      },
    });
  };

  const onConnect = async () => {
    setBusy(true);
    try {
      await getAppleWatchSession().connect();
    } finally {
      setBusy(false);
    }
  };

  const onDisconnect = () => {
    clearAppleWatchSession();
    const session = getAppleWatchSession();
    setStatus(session.status);
    setMessage(session.message);
    setBpm(0);
  };

  const linked = status === 'connected';
  const canStartTest = linked && bpm > 0;

  return (
    <Screen className="justify-between gap-6 pb-8">
      <View className="gap-3 pt-4">
        <Text className="font-sans-medium text-sm text-teal" onPress={() => router.back()}>
          ← Back
        </Text>
        <Text className="font-display text-3xl text-ink">Connect Apple Watch</Text>
        <Text className="font-sans text-base text-slate-soft">
          1) Open NIK on your Watch · 2) Allow Health · 3) Tap Start on the Watch · 4) Connect here.
        </Text>
      </View>

      <View className="items-center gap-4">
        <View
          className={`h-44 w-44 items-center justify-center rounded-full border-[10px] bg-white ${
            canStartTest ? 'border-teal' : 'border-teal-soft'
          }`}
        >
          {busy || status === 'searching' || status === 'authorizing' ? (
            <ActivityIndicator size="large" color="#1F7A6B" />
          ) : (
            <>
              <Text className="font-display text-5xl text-ink">{bpm > 0 ? bpm : '—'}</Text>
              <Text className="font-sans-medium text-sm uppercase tracking-[2px] text-slate-soft">
                bpm
              </Text>
            </>
          )}
        </View>
        <View className="rounded-2xl bg-white/80 px-4 py-3">
          <Text className="text-center font-sans-medium text-sm capitalize text-teal-deep">
            {status.replace('_', ' ')}
          </Text>
          <Text className="mt-1 text-center font-sans text-sm leading-5 text-slate-soft">
            {message}
          </Text>
        </View>
      </View>

      <View className="gap-3">
        {!linked && (
          <Button label="Connect Apple Watch" onPress={onConnect} loading={busy} />
        )}
        {linked && !canStartTest && (
          <Button label="Retry connect" onPress={onConnect} loading={busy} />
        )}
        {canStartTest && (
          <>
            <Button label="Start pulse test" onPress={goMonitor} />
            <Button label="Disconnect" variant="ghost" onPress={onDisconnect} />
          </>
        )}
        <Button
          label="Use Watch simulator instead"
          variant="ghost"
          onPress={() =>
            router.replace({
              pathname: '/(app)/monitor',
              params: {
                investigationId: params.investigationId,
                label: params.label || 'Pulse test',
                note: params.note || '',
                hrSource: 'simulator',
              },
            })
          }
        />
      </View>
    </Screen>
  );
}
