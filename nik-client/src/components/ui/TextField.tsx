import { Text, TextInput, View, type TextInputProps } from 'react-native';

type Props = TextInputProps & {
  label: string;
  error?: string;
  inputClassName?: string;
};

export function TextField({ label, error, inputClassName = '', className, ...props }: Props) {
  return (
    <View className="gap-2">
      <Text className="font-sans-medium text-sm text-slate-soft">{label}</Text>
      <TextInput
        placeholderTextColor="#8A9A95"
        className={`min-h-14 rounded-2xl border border-ink/10 bg-white px-4 font-sans text-base text-ink ${inputClassName} ${className ?? ''}`}
        {...props}
      />
      {!!error && <Text className="font-sans text-sm text-pulse-high">{error}</Text>}
    </View>
  );
}
