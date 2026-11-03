import { env } from '@/config/env';
import { clearSession, getSession } from '@/lib/storage';

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  form?: Record<string, string>;
  auth?: boolean;
  token?: string | null;
};

function messageFromBody(body: unknown, fallback: string): string {
  if (!body || typeof body !== 'object') return fallback;
  const data = body as Record<string, unknown>;
  if (typeof data.msg === 'string') return data.msg;
  if (typeof data.message === 'string') return data.message;
  if (data.error && typeof data.error === 'object') {
    const values = Object.values(data.error as Record<string, unknown>);
    if (values.length) return String(values[0]);
  }
  return fallback;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  let body: string | undefined;
  if (options.form) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    body = new URLSearchParams(options.form).toString();
  } else if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.body);
  }

  if (options.auth !== false) {
    const token = options.token ?? (await getSession())?.token;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const url = `${env.apiBaseUrl}/api/v1${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? (options.body || options.form ? 'POST' : 'GET'),
      headers,
      body,
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'Network request failed';
    throw new ApiError(`${reason} → ${url}`, 0);
  }

  const text = await response.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (response.status === 401 || response.status === 403) {
    if (options.auth !== false) await clearSession();
  }

  if (!response.ok) {
    throw new ApiError(
      messageFromBody(parsed, `Request failed (${response.status})`),
      response.status,
      parsed,
    );
  }

  return parsed as T;
}
