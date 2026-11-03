import { Text, View } from 'react-native';

export function BrandMark({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  return (
    <View className="items-center gap-2">
      <View
        className={`items-center justify-center rounded-full bg-teal ${
          size === 'lg' ? 'h-16 w-16' : 'h-10 w-10'
        }`}
      >
        <View className={`rounded-full bg-white/90 ${size === 'lg' ? 'h-5 w-5' : 'h-3 w-3'}`} />
      </View>
      <Text
        className={`font-display text-ink ${size === 'lg' ? 'text-4xl' : 'text-xl'}`}
      >
        NIK
      </Text>
    </View>
  );
}
