import { Pressable, Text, View } from 'react-native';
import type { HrSourceKind } from '@/lib/hr/types';

const OPTIONS: {
  id: HrSourceKind;
  title: string;
  body: string;
  badge: string;
}[] = [
  {
    id: 'simulator',
    title: 'Watch simulator',
    body: 'Fake pulse on this phone — best for testing the full food–pulse flow.',
    badge: 'Testing',
  },
  {
    id: 'apple_watch',
    title: 'Connect Apple Watch',
    body: 'Live BPM from a paired Watch via the NIK Watch app (iPhone development build).',
    badge: 'Live',
  },
];

type Props = {
  value: HrSourceKind;
  onChange: (value: HrSourceKind) => void;
};

export function HrSourcePicker({ value, onChange }: Props) {
  return (
    <View className="gap-3">
      <Text className="font-sans-bold text-base text-ink">Heart rate source</Text>
      {OPTIONS.map((option) => {
        const active = value === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            className={`rounded-2xl border px-4 py-4 ${
              active ? 'border-teal bg-teal-soft' : 'border-ink/10 bg-white/80'
            }`}
          >
            <View className="mb-1 flex-row items-center justify-between gap-3">
              <Text className="font-sans-bold text-base text-ink">{option.title}</Text>
              <Text
                className={`font-sans-medium text-xs uppercase tracking-[1px] ${
                  active ? 'text-teal-deep' : 'text-slate-soft'
                }`}
              >
                {option.badge}
              </Text>
            </View>
            <Text className="font-sans text-sm leading-5 text-slate-soft">{option.body}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
