import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';

export default function DisclaimerScreen() {
  return (
    <Screen className="gap-4">
      <Text className="pt-4 font-sans-medium text-sm text-teal" onPress={() => router.back()}>
        ← Back
      </Text>
      <Text className="font-display text-3xl text-ink">Medical disclaimer</Text>
      <View className="gap-4 rounded-3xl bg-white/80 p-5">
        <Text className="font-sans-bold text-base text-ink">Age requirement</Text>
        <Text className="font-sans text-base leading-6 text-slate-soft">
          NIK is intended for individuals who are at least 18 years of age.
        </Text>
        <Text className="font-sans-bold text-base text-ink">Informational purpose only</Text>
        <Text className="font-sans text-base leading-6 text-slate-soft">
          NIK is for informational and wellness purposes only. It is not a regulated medical device
          and does not diagnose, treat, or prevent any condition. It does not diagnose food
          allergies, sensitivities, or intolerances.
        </Text>
        <Text className="font-sans-bold text-base text-ink">Seek professional care</Text>
        <Text className="font-sans text-base leading-6 text-slate-soft">
          Always consult a physician before changing your diet. Never disregard professional advice
          because of data shown in this app.
        </Text>
      </View>
    </Screen>
  );
}
