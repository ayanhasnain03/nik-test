import { apiRequest } from './client';
import type { FoodTest } from '@/types/api';

function qs(params?: Record<string, string | number | undefined>) {
  if (!params) return '';
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') search.set(k, String(v));
  });
  const value = search.toString();
  return value ? `?${value}` : '';
}

export async function listUserFoodTests(
  userId: number,
  params?: {
    q?: string;
    page?: number;
    from_hrchange?: number;
    to_hrchange?: number;
    sortby?: string;
    sortdir?: string;
  },
) {
  return apiRequest<FoodTest[]>(`/users/${userId}/food-tests${qs(params)}`);
}

export async function getFoodTest(id: number) {
  return apiRequest<FoodTest>(`/food-tests/${id}`);
}

export async function updateFoodTest(
  id: number,
  payload: Partial<{ note: string; had_symptom: boolean; description: string }>,
) {
  return apiRequest<FoodTest>(`/food-tests/${id}`, {
    method: 'PATCH',
    body: payload,
  });
}

export async function deleteFoodTest(id: number) {
  return apiRequest(`/food-tests/${id}`, { method: 'DELETE' });
}
