import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as tipsApi from '@/api/tips';
import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import type { Tip } from '@/types/api';

export default function HomeScreen() {
  const { session } = useAuth();
  const [tips, setTips] = useState<Tip[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await tipsApi.listTips();
      setTips(data.slice(0, 3));
    } catch {
      setTips([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <Screen className="gap-6" refreshing={refreshing} onRefresh={onRefresh}>
      <View className="pt-4">
        <Text className="font-sans-medium text-sm uppercase tracking-[2px] text-teal">NIK</Text>
        <Text className="mt-2 font-display text-4xl leading-[44px] text-ink">
          Hello{session?.user.first_name ? `, ${session.user.first_name}` : ''}
        </Text>
        <Text className="mt-3 max-w-[320px] font-sans text-base leading-6 text-slate-soft">
          Notice how your pulse responds to what you eat and drink.
        </Text>
      </View>

      <View className="overflow-hidden rounded-[32px] bg-teal p-6">
        <Text className="font-display text-3xl leading-10 text-white">New pulse test</Text>
        <Text className="mt-3 font-sans text-base leading-6 text-white/85">
          Settle, eat or drink, then watch the afterglow of your heart rate.
        </Text>
        <View className="mt-6">
          <Button
            label="Start test"
            variant="secondary"
            onPress={() => router.push('/(app)/test')}
          />
        </View>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 rounded-3xl bg-white/80 p-4">
          <Text className="font-sans-medium text-sm text-slate-soft">Explore</Text>
          <Text className="mt-2 font-sans-bold text-lg text-ink">Investigations</Text>
          <View className="mt-4">
            <Button
              label="Open"
              variant="ghost"
              onPress={() => router.push('/(app)/(tabs)/investigations')}
            />
          </View>
        </View>
        <View className="flex-1 rounded-3xl bg-white/80 p-4">
          <Text className="font-sans-medium text-sm text-slate-soft">Review</Text>
          <Text className="mt-2 font-sans-bold text-lg text-ink">History</Text>
          <View className="mt-4">
            <Button
              label="Open"
              variant="ghost"
              onPress={() => router.push('/(app)/(tabs)/history')}
            />
          </View>
        </View>
      </View>

      <View className="gap-3">
        <Text className="font-display text-2xl text-ink">Tips</Text>
        {tips.length === 0 ? (
          <View className="rounded-3xl bg-white/70 p-5">
            <Text className="font-sans text-slate-soft">
              Wellness tips will appear here once available from your NIK server.
            </Text>
          </View>
        ) : (
          tips.map((tip) => (
            <View key={tip.id} className="gap-2 rounded-3xl bg-white/80 p-5">
              <Text className="font-sans-bold text-base text-ink">{tip.title}</Text>
              <Text className="font-sans text-sm leading-5 text-slate-soft" numberOfLines={3}>
                {tip.content}
              </Text>
            </View>
          ))
        )}
      </View>
    </Screen>
  );
}
