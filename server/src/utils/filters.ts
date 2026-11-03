export interface SqlFilter {
  clause: string;
  params: unknown[];
}

export function likeFilter(column: string, value: unknown, params: unknown[]): string | null {
  if (value === undefined || value === null || value === '') return null;
  params.push(`%${String(value)}%`);
  return `${column} ILIKE $${params.length}`;
}

export function eqFilter(column: string, value: unknown, params: unknown[]): string | null {
  if (value === undefined || value === null || value === '') return null;
  params.push(value);
  return `${column} = $${params.length}`;
}

export function gteFilter(column: string, value: unknown, params: unknown[]): string | null {
  if (value === undefined || value === null || value === '') return null;
  params.push(value);
  return `${column} >= $${params.length}`;
}

export function lteFilter(column: string, value: unknown, params: unknown[]): string | null {
  if (value === undefined || value === null || value === '') return null;
  params.push(value);
  return `${column} <= $${params.length}`;
}

export function neFilter(column: string, value: unknown, params: unknown[]): string | null {
  if (value === undefined || value === null || value === '') return null;
  params.push(value);
  return `${column} <> $${params.length}`;
}

export function joinWhere(parts: Array<string | null>): string {
  const clauses = parts.filter(Boolean) as string[];
  return clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
}

const SORTABLE = new Set([
  'id',
  'created_at',
  'updated_at',
  'diff_heart_rate',
  'before_heart_rate',
  'during_heart_rate',
  'result',
  'name',
  'journal_date',
]);

export function parseSort(
  sortby?: string,
  sortdir?: string,
  fallback = 'created_at DESC',
): string {
  if (!sortby || !SORTABLE.has(sortby)) return fallback;
  const dir = sortdir?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  return `${sortby} ${dir}`;
}
