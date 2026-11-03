import { Pressable, Text, View } from 'react-native';
import type { Investigation } from '@/types/api';

export function InvestigationCard({
  item,
  onPress,
}: {
  item: Investigation;
  onPress?: () => void;
}) {
  const closed = item.status === 1;
  return (
    <Pressable
      onPress={onPress}
      className="gap-2 rounded-3xl border border-ink/5 bg-white/80 p-4 active:opacity-90"
    >
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 font-sans-bold text-lg text-ink" numberOfLines={1}>
          {item.name}
        </Text>
        <View className={`rounded-full px-3 py-1 ${closed ? 'bg-ink/10' : 'bg-teal-soft'}`}>
          <Text className={`font-sans-medium text-xs ${closed ? 'text-slate-soft' : 'text-teal-deep'}`}>
            {closed ? 'Closed' : 'Open'}
          </Text>
        </View>
      </View>
      {!!item.description && (
        <Text className="font-sans text-sm leading-5 text-slate-soft" numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </Pressable>
  );
}
