import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HrSourceKind } from '@/lib/hr/types';
import type { AuthSession } from '@/types/api';

const AUTH_KEY = 'nik.auth';
const ONBOARDING_KEY = 'nik.onboarding.done';
const HR_SOURCE_KEY = 'nik.hrSource';

export async function saveSession(session: AuthSession): Promise<void> {
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

export async function getSession(): Promise<AuthSession | null> {
  const raw = await AsyncStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_KEY);
}

export async function setOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, '1');
}

export async function isOnboardingDone(): Promise<boolean> {
  return (await AsyncStorage.getItem(ONBOARDING_KEY)) === '1';
}

export async function saveHrSource(source: HrSourceKind): Promise<void> {
  await AsyncStorage.setItem(HR_SOURCE_KEY, source);
}

export async function getHrSource(): Promise<HrSourceKind> {
  const value = await AsyncStorage.getItem(HR_SOURCE_KEY);
  return value === 'apple_watch' ? 'apple_watch' : 'simulator';
}
