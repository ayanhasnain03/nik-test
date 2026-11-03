import { useCallback, useState } from 'react';
import { Alert, Modal, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as investigationsApi from '@/api/investigations';
import { ApiError } from '@/api/client';
import { useAuth } from '@/auth/AuthContext';
import { InvestigationCard } from '@/components/InvestigationCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import type { Investigation } from '@/types/api';

export default function InvestigationsScreen() {
  const { session } = useAuth();
  const [items, setItems] = useState<Investigation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!session) return;
    const data = await investigationsApi.listUserInvestigations(session.user.id);
    setItems(data);
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      void load().catch(() => setItems([]));
    }, [load]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  };

  const create = async () => {
    if (!session || !name.trim()) return;
    try {
      setSaving(true);
      const created = await investigationsApi.createInvestigation(session.user.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setModalOpen(false);
      setName('');
      setDescription('');
      router.push(`/(app)/investigation/${created.id}`);
    } catch (err) {
      Alert.alert('Could not create', err instanceof ApiError ? err.message : 'Try again');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen className="gap-5" refreshing={refreshing} onRefresh={onRefresh}>
      <View className="flex-row items-end justify-between pt-4">
        <View className="flex-1 pr-4">
          <Text className="font-display text-3xl text-ink">Investigations</Text>
          <Text className="mt-2 font-sans text-slate-soft">Foods and drinks you are exploring</Text>
        </View>
        <Button label="New" className="min-w-[88px]" onPress={() => setModalOpen(true)} />
      </View>

      {items.length === 0 ? (
        <EmptyState
          title="Nothing yet"
          body="Create an investigation for a food or drink, then run pulse tests against it."
          actionLabel="Create investigation"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <View className="gap-3">
          {items.map((item) => (
            <InvestigationCard
              key={item.id}
              item={item}
              onPress={() => router.push(`/(app)/investigation/${item.id}`)}
            />
          ))}
        </View>
      )}

      <Modal visible={modalOpen} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/30">
          <View className="gap-4 rounded-t-[28px] bg-mist px-5 pb-10 pt-6">
            <Text className="font-display text-2xl text-ink">New investigation</Text>
            <TextField label="Name" value={name} onChangeText={setName} placeholder="Oat milk" />
            <TextField
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Optional notes"
            />
            <Button label="Create" onPress={create} loading={saving} />
            <Button label="Cancel" variant="ghost" onPress={() => setModalOpen(false)} />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
