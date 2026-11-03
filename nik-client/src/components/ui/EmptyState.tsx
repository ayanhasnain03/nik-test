import { Text, View } from 'react-native';
import { Button } from './Button';

export function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="items-center gap-3 rounded-3xl bg-white/70 px-6 py-10">
      <Text className="font-display text-2xl text-ink">{title}</Text>
      <Text className="text-center font-sans text-base leading-6 text-slate-soft">{body}</Text>
      {actionLabel && onAction ? (
        <View className="mt-2 w-full">
          <Button label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
