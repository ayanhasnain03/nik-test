import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as journalsApi from '@/api/journals';
import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import type { Journal } from '@/types/api';

export default function JournalsScreen() {
  const { session } = useAuth();
  const [items, setItems] = useState<Journal[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!session) return;
    setItems(await journalsApi.listJournals(session.user.id));
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      void load().catch(() => setItems([]));
    }, [load]),
  );

  return (
    <Screen
      className="gap-5"
      refreshing={refreshing}
      onRefresh={async () => {
        setRefreshing(true);
        try {
          await load();
        } finally {
          setRefreshing(false);
        }
      }}
    >
      <View className="flex-row items-end justify-between pt-4">
        <View className="flex-1 pr-3">
          <Text className="font-display text-3xl text-ink">Journal</Text>
          <Text className="mt-2 font-sans text-slate-soft">Capture context around your tests</Text>
        </View>
        <Button
          label="Write"
          className="min-w-[88px]"
          onPress={() => router.push('/(app)/journal-create')}
        />
      </View>

      {items.length === 0 ? (
        <EmptyState
          title="No entries"
          body="Jot symptoms, meals, sleep, or anything that may shape your pulse response."
          actionLabel="Write entry"
          onAction={() => router.push('/(app)/journal-create')}
        />
      ) : (
        <View className="gap-3">
          {items.map((item) => (
            <Pressable key={item.id} className="gap-2 rounded-3xl bg-white/80 p-4">
              <Text className="font-sans-bold text-lg text-ink">{item.name}</Text>
              <Text className="font-sans text-sm text-slate-soft">
                {new Date(item.journal_date).toLocaleString()}
              </Text>
              <Text className="font-sans text-base leading-6 text-ink/80" numberOfLines={4}>
                {item.content}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}
