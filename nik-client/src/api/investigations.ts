import { apiRequest } from './client';
import type { FoodTest, FoodTestRequest, Investigation, InvestigationActivity } from '@/types/api';

function qs(params?: Record<string, string | number | undefined>) {
  if (!params) return '';
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') search.set(k, String(v));
  });
  const value = search.toString();
  return value ? `?${value}` : '';
}

export async function listUserInvestigations(
  userId: number,
  params?: { q?: string; status?: number; page?: number },
) {
  return apiRequest<Investigation[]>(`/users/${userId}/investigations${qs(params)}`);
}

export async function createInvestigation(
  userId: number,
  payload: { name: string; description?: string; category_id?: number },
) {
  return apiRequest<Investigation>(`/users/${userId}/investigations`, {
    body: payload,
  });
}

export async function getInvestigation(id: number) {
  return apiRequest<Investigation>(`/investigations/${id}`);
}

export async function updateInvestigation(
  id: number,
  payload: Partial<{ name: string; description: string; status: number }>,
) {
  return apiRequest<Investigation>(`/investigations/${id}`, {
    method: 'PATCH',
    body: payload,
  });
}

export async function deleteInvestigation(id: number) {
  return apiRequest(`/investigations/${id}`, { method: 'DELETE' });
}

export async function listInvestigationTests(id: number) {
  return apiRequest<FoodTest[]>(`/investigations/${id}/food-tests`);
}

export async function createFoodTest(investigationId: number, payload: FoodTestRequest) {
  return apiRequest<FoodTest>(`/investigations/${investigationId}/food-tests`, {
    body: payload,
  });
}

export async function listActivities(investigationId: number) {
  return apiRequest<InvestigationActivity[]>(`/investigations/${investigationId}/activities`);
}

export async function createActivity(
  investigationId: number,
  payload: { reason?: string; status: number },
) {
  return apiRequest<InvestigationActivity>(`/investigations/${investigationId}/activities`, {
    body: payload,
  });
}
