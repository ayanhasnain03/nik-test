import crypto from 'node:crypto';

export function generateApiKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function extractBearerToken(header?: string): string | null {
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}
