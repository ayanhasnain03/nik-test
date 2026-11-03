import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { ApiError } from '@/api/client';
import { useAuth } from '@/auth/AuthContext';
import { BrandMark } from '@/components/ui/BrandMark';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!agreed) {
      Alert.alert('Consent required', 'Please confirm you are 18+ and agree to the disclaimer.');
      return;
    }
    try {
      setLoading(true);
      await signUp({
        first_name: firstName.trim(),
        last_name: lastName.trim() || undefined,
        email: email.trim(),
        password,
      });
      router.replace('/(app)');
    } catch (err) {
      Alert.alert('Sign up failed', err instanceof ApiError ? err.message : 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View className="gap-6 pt-6">
        <BrandMark size="sm" />
        <View className="gap-2">
          <Text className="font-display text-3xl text-ink">Create account</Text>
          <Text className="font-sans text-base text-slate-soft">
            NIK is for informational wellness use only — not medical diagnosis.
          </Text>
        </View>

        <View className="gap-4">
          <TextField label="First name" value={firstName} onChangeText={setFirstName} />
          <TextField label="Last name" value={lastName} onChangeText={setLastName} />
          <TextField
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Pressable
          onPress={() => setAgreed((v) => !v)}
          className="flex-row items-start gap-3 rounded-2xl bg-white/70 p-4"
        >
          <View
            className={`mt-0.5 h-5 w-5 items-center justify-center rounded-md border ${
              agreed ? 'border-teal bg-teal' : 'border-ink/20 bg-white'
            }`}
          >
            {agreed ? <Text className="text-xs text-white">✓</Text> : null}
          </View>
          <Text className="flex-1 font-sans text-sm leading-5 text-slate-soft">
            I am 18 or older and agree that NIK is not a medical device and does not diagnose food
            allergies, sensitivities, or intolerances.
          </Text>
        </Pressable>

        <Button label="Create account" onPress={onSubmit} loading={loading} />

        <View className="flex-row justify-center gap-1 pb-8">
          <Text className="font-sans text-slate-soft">Already have an account?</Text>
          <Link href="/(auth)/signin" asChild>
            <Pressable>
              <Text className="font-sans-bold text-teal">Sign in</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </Screen>
  );
}
