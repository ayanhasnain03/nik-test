import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';

export default function MethodologyScreen() {
  return (
    <Screen className="gap-4">
      <Text className="pt-4 font-sans-medium text-sm text-teal" onPress={() => router.back()}>
        ← Back
      </Text>
      <Text className="font-display text-3xl text-ink">Data methodology</Text>
      <View className="gap-4 rounded-3xl bg-white/80 p-5">
        <Text className="font-sans text-base leading-6 text-slate-soft">
          NIK observes pulse across baseline, consumption, and post-consumption phases. Transition
          periods are excluded from averages.
        </Text>
        <Text className="font-sans-bold text-base text-ink">Result bands</Text>
        <Text className="font-sans text-base leading-6 text-slate-soft">
          High: +16 bpm or more{'\n'}
          Moderate: +10 to +15{'\n'}
          Low: +2 to +9{'\n'}
          No reaction: +1 or less
        </Text>
        <Text className="font-sans text-base leading-6 text-slate-soft">
          Responses vary with sleep, stress, posture, movement, and device fit. Long-term trends are
          more useful than a single session.
        </Text>
      </View>
    </Screen>
  );
}
