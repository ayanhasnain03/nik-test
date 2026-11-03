import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as investigationsApi from '@/api/investigations';
import { ApiError } from '@/api/client';
import { useAuth } from '@/auth/AuthContext';
import { HrSourcePicker } from '@/components/HrSourcePicker';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import type { HrSourceKind } from '@/lib/hr/types';
import { getHrSource, saveHrSource } from '@/lib/storage';
import type { Investigation } from '@/types/api';

export default function NewTestScreen() {
  const { session } = useAuth();
  const params = useLocalSearchParams<{ investigationId?: string; name?: string }>();
  const [name, setName] = useState(params.name ?? '');
  const [note, setNote] = useState('');
  const [items, setItems] = useState<Investigation[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(
    params.investigationId ? Number(params.investigationId) : null,
  );
  const [hrSource, setHrSource] = useState<HrSourceKind>('simulator');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void getHrSource().then(setHrSource);
  }, []);

  useEffect(() => {
    if (!session) return;
    void investigationsApi
      .listUserInvestigations(session.user.id, { status: 0 })
      .then(setItems)
      .catch(() => setItems([]));
  }, [session]);

  const onSelectSource = (value: HrSourceKind) => {
    setHrSource(value);
    void saveHrSource(value);
  };

  const start = async () => {
    if (!session) return;
    try {
      setLoading(true);
      let investigationId = selectedId;
      if (!investigationId) {
        if (!name.trim()) {
          Alert.alert('Name required', 'Give this test a name so you can find it later.');
          return;
        }
        const created = await investigationsApi.createInvestigation(session.user.id, {
          name: name.trim(),
          description: note.trim() || undefined,
        });
        investigationId = created.id;
      }

      const shared = {
        investigationId: String(investigationId),
        label: name.trim() || items.find((i) => i.id === investigationId)?.name || 'Test',
        note: note.trim(),
        hrSource,
      };

      if (hrSource === 'apple_watch') {
        router.push({ pathname: '/(app)/watch-connect', params: shared });
      } else {
        router.push({ pathname: '/(app)/monitor', params: shared });
      }
    } catch (err) {
      Alert.alert('Could not start', err instanceof ApiError ? err.message : 'Try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen className="gap-5">
      <View className="gap-2 pt-4">
        <Text className="font-sans-medium text-sm text-teal" onPress={() => router.back()}>
          ← Back
        </Text>
        <Text className="font-display text-3xl text-ink">New test</Text>
        <Text className="font-sans text-base text-slate-soft">
          Choose an open investigation or create one, pick a heart-rate source, then begin.
        </Text>
      </View>

      <HrSourcePicker value={hrSource} onChange={onSelectSource} />

      <TextField
        label="Test / investigation name"
        value={name}
        onChangeText={(value) => {
          setName(value);
          setSelectedId(null);
        }}
        placeholder="Espresso"
      />
      <TextField
        label="Optional note"
        value={note}
        onChangeText={setNote}
        placeholder="First cup after breakfast"
      />

      {items.length > 0 && (
        <View className="gap-3">
          <Text className="font-sans-bold text-base text-ink">Or continue an open one</Text>
          {items.slice(0, 6).map((item) => {
            const active = selectedId === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  setSelectedId(item.id);
                  setName(item.name);
                }}
                className={`rounded-2xl border px-4 py-3 ${
                  active ? 'border-teal bg-teal-soft' : 'border-ink/10 bg-white/80'
                }`}
              >
                <Text className="font-sans-medium text-ink">{item.name}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <Button
        label={
          hrSource === 'apple_watch' ? 'Continue to Apple Watch' : 'Begin with Watch simulator'
        }
        onPress={start}
        loading={loading}
      />
    </Screen>
  );
}
