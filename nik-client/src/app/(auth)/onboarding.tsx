import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { BrandMark } from '@/components/ui/BrandMark';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/auth/AuthContext';

const width = Dimensions.get('window').width - 40;

const slides = [
  {
    title: 'Know your pulse story',
    body: 'NIK logs heart rate before, during, and after food or drink — quiet signals for personal wellness.',
  },
  {
    title: 'Observe, don’t diagnose',
    body: 'Results are informational only. Trends matter more than any single reading.',
  },
  {
    title: 'Start a test anytime',
    body: 'Name what you’re exploring, settle your pulse, then eat or drink while NIK watches the change.',
  },
];

export default function OnboardingScreen() {
  const { completeOnboarding } = useAuth();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(next);
  };

  const finish = async () => {
    await completeOnboarding();
    router.replace('/(auth)/signin');
  };

  const next = () => {
    if (index >= slides.length - 1) {
      void finish();
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  return (
    <Screen scroll={false} className="justify-between pb-6">
      <View className="items-center pt-8">
        <BrandMark />
      </View>

      <FlatList
        ref={listRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={slides}
        keyExtractor={(item) => item.title}
        onScroll={onScroll}
        renderItem={({ item }) => (
          <View style={{ width }} className="justify-center gap-4 px-1">
            <View className="rounded-[28px] bg-teal px-6 py-10">
              <Text className="font-display text-3xl leading-10 text-white">{item.title}</Text>
              <Text className="mt-4 font-sans text-base leading-7 text-white/90">{item.body}</Text>
            </View>
          </View>
        )}
      />

      <View className="gap-4">
        <View className="flex-row justify-center gap-2">
          {slides.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full ${i === index ? 'w-6 bg-teal' : 'w-2 bg-teal/25'}`}
            />
          ))}
        </View>
        <Button
          label={index === slides.length - 1 ? 'Continue' : 'Next'}
          onPress={next}
        />
      </View>
    </Screen>
  );
}
