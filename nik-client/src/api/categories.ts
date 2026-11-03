import { apiRequest } from './client';
import type { Category } from '@/types/api';

export async function listCategories() {
  return apiRequest<Category[]>('/categories');
}
