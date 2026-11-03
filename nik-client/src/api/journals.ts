import { apiRequest } from './client';
import type { Journal } from '@/types/api';

export async function listJournals(userId: number, page = 1) {
  return apiRequest<Journal[]>(`/users/${userId}/journals?page=${page}`);
}

export async function createJournal(
  userId: number,
  payload: { name: string; content?: string; journal_date?: string },
) {
  return apiRequest<Journal>(`/users/${userId}/journals`, { body: payload });
}

export async function getJournal(id: number) {
  return apiRequest<Journal>(`/journals/${id}`);
}

export async function updateJournal(
  id: number,
  payload: Partial<{ name: string; content: string; journal_date: string; status: number }>,
) {
  return apiRequest<Journal>(`/journals/${id}`, {
    method: 'PATCH',
    body: payload,
  });
}
