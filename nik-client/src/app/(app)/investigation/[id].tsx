import { useCallback, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as investigationsApi from '@/api/investigations';
import { ApiError } from '@/api/client';
import { FoodTestCard } from '@/components/FoodTestCard';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import type { FoodTest, Investigation } from '@/types/api';

export default function InvestigationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const investigationId = Number(id);
  const [item, setItem] = useState<Investigation | null>(null);
  const [tests, setTests] = useState<FoodTest[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [inv, foodTests] = await Promise.all([
      investigationsApi.getInvestigation(investigationId),
      investigationsApi.listInvestigationTests(investigationId),
    ]);
    setItem(inv);
    setTests(foodTests);
  }, [investigationId]);

  useFocusEffect(
    useCallback(() => {
      void load().catch((err) => {
        Alert.alert('Error', err instanceof ApiError ? err.message : 'Failed to load');
      });
    }, [load]),
  );

  const toggleStatus = async () => {
    if (!item) return;
    const nextStatus = item.status === 0 ? 1 : 0;
    try {
      await investigationsApi.createActivity(item.id, {
        status: nextStatus,
        reason: nextStatus === 1 ? 'Closed from app' : 'Reopened from app',
      });
      await load();
    } catch (err) {
      Alert.alert('Error', err instanceof ApiError ? err.message : 'Could not update status');
    }
  };

  const remove = () => {
    Alert.alert('Delete investigation?', 'This marks it deleted.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await investigationsApi.deleteInvestigation(investigationId);
            router.back();
          } catch (err) {
            Alert.alert('Error', err instanceof ApiError ? err.message : 'Delete failed');
          }
        },
      },
    ]);
  };

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
      <View className="gap-2 pt-4">
        <Text className="font-sans-medium text-sm text-teal" onPress={() => router.back()}>
          ← Back
        </Text>
        <Text className="font-display text-3xl text-ink">{item?.name ?? 'Investigation'}</Text>
        {!!item?.description && (
          <Text className="font-sans text-base text-slate-soft">{item.description}</Text>
        )}
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button
            label="Run test"
            onPress={() =>
              router.push({
                pathname: '/(app)/test',
                params: { investigationId: String(investigationId), name: item?.name ?? '' },
              })
            }
          />
        </View>
        <View className="flex-1">
          <Button
            label={item?.status === 0 ? 'Close' : 'Reopen'}
            variant="secondary"
            onPress={toggleStatus}
          />
        </View>
      </View>

      <View className="gap-3">
        <Text className="font-display text-2xl text-ink">Tests</Text>
        {tests.length === 0 ? (
          <View className="rounded-3xl bg-white/70 p-5">
            <Text className="font-sans text-slate-soft">No tests yet for this investigation.</Text>
          </View>
        ) : (
          tests.map((test) => <FoodTestCard key={test.id} test={test} />)
        )}
      </View>

      <Button label="Delete investigation" variant="danger" onPress={remove} />
    </Screen>
  );
}
