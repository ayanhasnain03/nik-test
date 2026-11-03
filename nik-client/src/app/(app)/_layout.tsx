import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/auth/AuthContext';

export default function AppLayout() {
  const { ready, session } = useAuth();

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center bg-mist">
        <ActivityIndicator color="#1F7A6B" />
      </View>
    );
  }

  if (!session) return <Redirect href="/(auth)/signin" />;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F4F8F7' } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="investigation/[id]" />
      <Stack.Screen name="journal-create" />
      <Stack.Screen name="settings-profile" />
      <Stack.Screen name="settings-disclaimer" />
      <Stack.Screen name="settings-methodology" />
      <Stack.Screen name="test" />
      <Stack.Screen name="watch-connect" />
      <Stack.Screen name="monitor" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
