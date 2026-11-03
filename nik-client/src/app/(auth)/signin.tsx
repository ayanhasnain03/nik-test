import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { ApiError } from '@/api/client';
import { useAuth } from '@/auth/AuthContext';
import { BrandMark } from '@/components/ui/BrandMark';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await signIn(email, password);
      router.replace('/(app)');
    } catch (err) {
      Alert.alert('Sign in failed', err instanceof ApiError ? err.message : 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View className="gap-8 pt-10">
        <BrandMark />
        <View className="gap-2">
          <Text className="font-display text-3xl text-ink">Welcome back</Text>
          <Text className="font-sans text-base text-slate-soft">
            Sign in to continue your food–pulse explorations.
          </Text>
        </View>

        <View className="gap-4">
          <TextField
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@email.com"
          />
          <TextField
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
          />
          <Link href="/(auth)/recover" asChild>
            <Pressable>
              <Text className="text-right font-sans-medium text-sm text-teal">Forgot password?</Text>
            </Pressable>
          </Link>
        </View>

        <Button label="Sign in" onPress={onSubmit} loading={loading} />

        <View className="flex-row justify-center gap-1">
          <Text className="font-sans text-slate-soft">New here?</Text>
          <Link href="/(auth)/signup" asChild>
            <Pressable>
              <Text className="font-sans-bold text-teal">Create account</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </Screen>
  );
}
