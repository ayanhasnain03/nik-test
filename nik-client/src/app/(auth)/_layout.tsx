import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';

export default function AuthLayout() {
  const { ready, session, onboardingDone } = useAuth();

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center bg-mist">
        <ActivityIndicator color="#1F7A6B" />
      </View>
    );
  }

  if (session && onboardingDone) return <Redirect href="/(app)" />;

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="recover" />
    </Stack>
  );
}
