import { apiRequest } from './client';
import type { User } from '@/types/api';

export async function login(email: string, password: string) {
  return apiRequest<{ auth_token: string }>('/auth/login', {
    form: { email, password },
    auth: false,
  });
}

export async function register(payload: {
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
  gender?: number;
}) {
  return apiRequest<User>('/auth/register', {
    body: payload,
    auth: false,
  });
}

export async function logout() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch {
  }
}

export async function recoverAccount(email: string) {
  return apiRequest<{ message: string }>('/auth/recover-account', {
    form: { username: email },
    auth: false,
  });
}

export async function recoverPassword(email: string, otp: string, password: string) {
  return apiRequest('/auth/recover-account/password', {
    form: { username: email, otp, password },
    auth: false,
  });
}

export async function getMyProfile(token?: string) {
  return apiRequest<User>('/my-profile', { token });
}

export async function updateMyProfile(payload: {
  first_name?: string;
  last_name?: string | null;
  gender?: number | null;
}) {
  return apiRequest<User>('/my-profile', {
    method: 'PATCH',
    body: payload,
  });
}
