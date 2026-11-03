import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as foodTestsApi from '@/api/foodTests';
import { useAuth } from '@/auth/AuthContext';
import { FoodTestCard } from '@/components/FoodTestCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import type { FoodTest } from '@/types/api';

export default function HistoryScreen() {
  const { session } = useAuth();
  const [tests, setTests] = useState<FoodTest[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!session) return;
    const data = await foodTestsApi.listUserFoodTests(session.user.id, {
      sortby: 'created_at',
      sortdir: 'desc',
    });
    setTests(data);
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      void load().catch(() => setTests([]));
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
      <View className="pt-4">
        <Text className="font-display text-3xl text-ink">History</Text>
        <Text className="mt-2 font-sans text-slate-soft">All of your pulse test results</Text>
      </View>

      {tests.length === 0 ? (
        <EmptyState
          title="No tests yet"
          body="Run your first pulse test from Home to start building a history."
        />
      ) : (
        <View className="gap-3">
          {tests.map((test) => (
            <FoodTestCard key={test.id} test={test} />
          ))}
        </View>
      )}
    </Screen>
  );
}
