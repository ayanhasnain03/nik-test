import { ActivityIndicator, Pressable, Text } from 'react-native';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

const variants = {
  primary: 'bg-teal',
  secondary: 'bg-foam border border-teal/20',
  ghost: 'bg-transparent border border-ink/10',
  danger: 'bg-pulse-high',
};

const labelVariants = {
  primary: 'text-white',
  secondary: 'text-teal-deep',
  ghost: 'text-ink',
  danger: 'text-white',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  className = '',
}: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`min-h-14 items-center justify-center rounded-2xl px-5 ${variants[variant]} ${
        isDisabled ? 'opacity-50' : 'active:opacity-90'
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? '#fff' : '#155E52'} />
      ) : (
        <Text className={`font-sans-bold text-base ${labelVariants[variant]}`}>{label}</Text>
      )}
    </Pressable>
  );
}
