export interface PaginationInput {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  offset: number;
}

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

export function parsePagination(input: PaginationInput = {}): PaginationMeta {
  const page = Math.max(1, Number(input.page) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(input.limit) || DEFAULT_LIMIT));
  return { page, limit, offset: (page - 1) * limit };
}
