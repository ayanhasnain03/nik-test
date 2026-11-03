import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#10211D',
    background: '#F4F8F7',
    backgroundElement: '#E7F1EE',
    backgroundSelected: '#D7EDE8',
    textSecondary: '#5B6B66',
    tint: '#1F7A6B',
  },
  dark: {
    text: '#F4F8F7',
    background: '#10211D',
    backgroundElement: '#1A2E29',
    backgroundSelected: '#244039',
    textSecondary: '#A8B8B3',
    tint: '#4EB0A3',
  },
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
