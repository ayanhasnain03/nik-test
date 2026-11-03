import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as authApi from '@/api/auth';
import { ApiError } from '@/api/client';
import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';

export default function ProfileScreen() {
  const { session, updateUser } = useAuth();
  const [firstName, setFirstName] = useState(session?.user.first_name ?? '');
  const [lastName, setLastName] = useState(session?.user.last_name ?? '');
  const [loading, setLoading] = useState(false);

  const save = async () => {
    try {
      setLoading(true);
      const user = await authApi.updateMyProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim() || null,
      });
      await updateUser(user);
      Alert.alert('Saved', 'Profile updated');
      router.back();
    } catch (err) {
      Alert.alert('Error', err instanceof ApiError ? err.message : 'Could not save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen className="gap-5">
      <View className="gap-2 pt-4">
        <Text className="font-sans-medium text-sm text-teal" onPress={() => router.back()}>
          ← Back
        </Text>
        <Text className="font-display text-3xl text-ink">Profile</Text>
      </View>
      <TextField label="First name" value={firstName} onChangeText={setFirstName} />
      <TextField label="Last name" value={lastName ?? ''} onChangeText={setLastName} />
      <TextField label="Email" value={session?.user.email ?? ''} editable={false} />
      <Button label="Save changes" onPress={save} loading={loading} />
    </Screen>
  );
}
