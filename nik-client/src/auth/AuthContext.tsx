import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as authApi from '@/api/auth';
import { ApiError } from '@/api/client';
import {
  clearSession,
  getSession,
  isOnboardingDone,
  saveSession,
  setOnboardingDone,
} from '@/lib/storage';
import type { AuthSession, User } from '@/types/api';

type AuthState = {
  ready: boolean;
  session: AuthSession | null;
  onboardingDone: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: {
    first_name: string;
    last_name?: string;
    email: string;
    password: string;
    gender?: number;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [onboardingDone, setOnboardingDoneState] = useState(false);

  useEffect(() => {
    (async () => {
      const [saved, boarded] = await Promise.all([getSession(), isOnboardingDone()]);
      setOnboardingDoneState(boarded);
      if (saved?.token) {
        try {
          const user = await authApi.getMyProfile(saved.token);
          const next = { token: saved.token, user };
          await saveSession(next);
          setSession(next);
        } catch (err) {
          if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
            await clearSession();
          } else {
            setSession(saved);
          }
        }
      }
      setReady(true);
    })();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { auth_token } = await authApi.login(email.trim(), password);
    const user = await authApi.getMyProfile(auth_token);
    const next = { token: auth_token, user };
    await saveSession(next);
    setSession(next);
  }, []);

  const signUp = useCallback(
    async (payload: {
      first_name: string;
      last_name?: string;
      email: string;
      password: string;
      gender?: number;
    }) => {
      await authApi.register(payload);
      await signIn(payload.email, payload.password);
    },
    [signIn],
  );

  const signOut = useCallback(async () => {
    await authApi.logout();
    await clearSession();
    setSession(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session?.token) return;
    const user = await authApi.getMyProfile(session.token);
    const next = { token: session.token, user };
    await saveSession(next);
    setSession(next);
  }, [session?.token]);

  const completeOnboarding = useCallback(async () => {
    await setOnboardingDone();
    setOnboardingDoneState(true);
  }, []);

  const updateUser = useCallback(
    async (user: User) => {
      if (!session) return;
      const next = { ...session, user };
      await saveSession(next);
      setSession(next);
    },
    [session],
  );

  const value = useMemo(
    () => ({
      ready,
      session,
      onboardingDone,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      completeOnboarding,
      updateUser,
    }),
    [
      ready,
      session,
      onboardingDone,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      completeOnboarding,
      updateUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
