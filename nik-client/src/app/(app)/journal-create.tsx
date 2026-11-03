import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as journalsApi from '@/api/journals';
import { ApiError } from '@/api/client';
import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';

export default function JournalCreateScreen() {
  const { session } = useAuth();
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!session) return;
    try {
      setLoading(true);
      await journalsApi.createJournal(session.user.id, {
        name: name.trim() || 'Journal entry',
        content: content.trim(),
        journal_date: new Date().toISOString(),
      });
      router.back();
    } catch (err) {
      Alert.alert('Could not save', err instanceof ApiError ? err.message : 'Try again');
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
        <Text className="font-display text-3xl text-ink">New journal</Text>
      </View>
      <TextField label="Title" value={name} onChangeText={setName} placeholder="Morning notes" />
      <TextField
        label="Entry"
        value={content}
        onChangeText={setContent}
        placeholder="How do you feel? What did you eat?"
        multiline
        inputClassName="min-h-40 py-4"
        textAlignVertical="top"
      />
      <Button label="Save entry" onPress={save} loading={loading} />
    </Screen>
  );
}
