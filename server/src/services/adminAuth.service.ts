import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { admins } from '../db/schema/admins.js';
import { adminApiKeys } from '../db/schema/apiKeys.js';
import { ValidationError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { verifyPassword } from '../lib/password.js';
import { generateApiKey } from '../lib/tokens.js';
import type { LoginInput } from '../validators/auth.schema.js';

export async function loginAdmin(input: LoginInput) {
  const admin = await db.query.admins.findFirst({
    where: eq(admins.email, input.email.toLowerCase()),
  });

  if (!admin) {
    throw new ValidationError('Invalid email or password', { msg: 'Invalid email or password' });
  }

  const ok = await verifyPassword(input.password, admin.password);
  if (!ok) {
    throw new ValidationError('Invalid email or password', { msg: 'Invalid email or password' });
  }

  const apiKey = generateApiKey();
  await db.insert(adminApiKeys).values({ apiKey, adminId: admin.id });

  logger.info({ adminId: admin.id }, 'admin.login');
  return { auth_token: apiKey };
}

export async function logoutAdmin(apiKey: string) {
  await db.delete(adminApiKeys).where(eq(adminApiKeys.apiKey, apiKey));
  logger.info('admin.logout');
}
