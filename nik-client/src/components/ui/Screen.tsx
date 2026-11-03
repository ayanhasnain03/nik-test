import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  className?: string;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function Screen({
  children,
  scroll = true,
  className = '',
  refreshing,
  onRefresh,
}: Props) {
  const body = scroll ? (
    <ScrollView
      className="flex-1"
      contentContainerClassName={`px-5 pb-10 pt-2 ${className}`}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor="#1F7A6B" />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 px-5 pt-2 ${className}`}>{children}</View>
  );

  return (
    <View className="flex-1 bg-mist">
      <LinearGradient
        colors={['#E8F4F0', '#F4F8F7', '#F7FAF8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', inset: 0 }}
      />
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        {body}
      </SafeAreaView>
    </View>
  );
}
