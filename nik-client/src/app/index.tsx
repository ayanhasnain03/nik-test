import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';

export default function Gate() {
  const { ready, session, onboardingDone } = useAuth();

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center bg-mist">
        <ActivityIndicator color="#1F7A6B" />
      </View>
    );
  }

  if (!onboardingDone) return <Redirect href="/(auth)/onboarding" />;
  if (!session) return <Redirect href="/(auth)/signin" />;
  return <Redirect href="/(app)" />;
}
