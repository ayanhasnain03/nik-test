import { apiRequest } from './client';
import type { Tip } from '@/types/api';

export async function listTips() {
  return apiRequest<Tip[]>('/tips');
}

export async function getTip(id: number) {
  return apiRequest<Tip>(`/tips/${id}`);
}
