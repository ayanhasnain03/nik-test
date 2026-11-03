import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as authApi from '@/api/auth';
import { ApiError } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';

export default function RecoverScreen() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    try {
      setLoading(true);
      const res = await authApi.recoverAccount(email.trim());
      Alert.alert('Check your email', res.message);
      setStep('otp');
    } catch (err) {
      Alert.alert('Error', err instanceof ApiError ? err.message : 'Could not start recovery');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    try {
      setLoading(true);
      await authApi.recoverPassword(email.trim(), otp.trim(), password);
      Alert.alert('Password updated', 'You can sign in with your new password.');
      router.replace('/(auth)/signin');
    } catch (err) {
      Alert.alert('Error', err instanceof ApiError ? err.message : 'Could not reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View className="gap-6 pt-8">
        <Text className="font-display text-3xl text-ink">Recover account</Text>
        <Text className="font-sans text-base text-slate-soft">
          We’ll email a one-time code if this address is registered.
        </Text>

        <TextField
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={step === 'email'}
        />

        {step === 'otp' && (
          <>
            <TextField label="OTP code" keyboardType="number-pad" value={otp} onChangeText={setOtp} />
            <TextField
              label="New password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </>
        )}

        <Button
          label={step === 'email' ? 'Send code' : 'Update password'}
          onPress={step === 'email' ? sendOtp : resetPassword}
          loading={loading}
        />
        <Button label="Back to sign in" variant="ghost" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}
