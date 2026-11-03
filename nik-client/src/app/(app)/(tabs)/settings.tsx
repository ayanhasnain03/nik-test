import { Alert, Linking, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/auth/AuthContext';
import { env } from '@/config/env';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';

const links = [
  { label: 'Profile', href: '/(app)/settings-profile' },
  { label: 'Medical disclaimer', href: '/(app)/settings-disclaimer' },
  { label: 'Data methodology', href: '/(app)/settings-methodology' },
] as const;

export default function SettingsScreen() {
  const { session, signOut } = useAuth();

  return (
    <Screen className="gap-5">
      <View className="gap-2 pt-4">
        <Text className="font-display text-3xl text-ink">Settings</Text>
        <Text className="font-sans text-slate-soft">{session?.user.email}</Text>
      </View>

      <View className="overflow-hidden rounded-3xl bg-white/80">
        {links.map((link, index) => (
          <Pressable
            key={link.href}
            onPress={() => router.push(link.href)}
            className={`flex-row items-center justify-between px-4 py-4 ${
              index < links.length - 1 ? 'border-b border-ink/5' : ''
            }`}
          >
            <Text className="font-sans-medium text-base text-ink">{link.label}</Text>
            <Text className="text-slate-soft">›</Text>
          </Pressable>
        ))}
      </View>

      <View className="overflow-hidden rounded-3xl bg-white/80">
        {[
          { label: 'FAQ', url: `${env.websiteUrl}/faq` },
          { label: 'Privacy', url: `${env.websiteUrl}/privacy-policy` },
          { label: 'Terms', url: `${env.websiteUrl}/terms-conditions` },
        ].map((item, index, arr) => (
          <Pressable
            key={item.url}
            onPress={() => Linking.openURL(item.url)}
            className={`flex-row items-center justify-between px-4 py-4 ${
              index < arr.length - 1 ? 'border-b border-ink/5' : ''
            }`}
          >
            <Text className="font-sans-medium text-base text-ink">{item.label}</Text>
            <Text className="text-slate-soft">↗</Text>
          </Pressable>
        ))}
      </View>

      <Button
        label="Sign out"
        variant="ghost"
        onPress={() => {
          Alert.alert('Sign out?', undefined, [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Sign out',
              style: 'destructive',
              onPress: async () => {
                await signOut();
                router.replace('/(auth)/signin');
              },
            },
          ]);
        }}
      />
    </Screen>
  );
}
