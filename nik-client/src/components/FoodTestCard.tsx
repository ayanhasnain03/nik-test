import { Pressable, Text, View } from 'react-native';
import type { FoodTest } from '@/types/api';
import { resultColorClass, resultLabel, resultTextClass } from '@/lib/foodTestResult';

export function FoodTestCard({
  test,
  onPress,
}: {
  test: FoodTest;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="gap-3 rounded-3xl border border-ink/5 bg-white/80 p-4 active:opacity-90"
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text className="font-sans-bold text-base text-ink" numberOfLines={2}>
            {test.description || 'Food test'}
          </Text>
          <Text className="font-sans text-sm text-slate-soft">
            Δ {test.diff_heart_rate} bpm · before {test.before_heart_rate} · during{' '}
            {test.during_heart_rate}
          </Text>
        </View>
        <View className={`rounded-full px-3 py-1 ${resultColorClass(test.result)}`}>
          <Text className="font-sans-medium text-xs text-white">{resultLabel(test.result)}</Text>
        </View>
      </View>
      <Text className={`font-sans-medium text-sm ${resultTextClass(test.result)}`}>
        After {test.after2_heart_rate || '—'} bpm
      </Text>
    </Pressable>
  );
}
