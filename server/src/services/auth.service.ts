import { and, eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/index.js';
import { db } from '../db/index.js';
import { mapUser } from '../db/mappers.js';
import { userApiKeys } from '../db/schema/apiKeys.js';
import { otps } from '../db/schema/otps.js';
import { users } from '../db/schema/users.js';
import { ConflictError, NotFoundError, ValidationError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { generateApiKey } from '../lib/tokens.js';
import type { LoginInput, RegisterInput } from '../validators/auth.schema.js';

export async function registerUser(input: RegisterInput) {
  const existing = await db.query.users.findFirst({
    where: eq(users.email, input.email.toLowerCase()),
  });
  if (existing) {
    throw new ConflictError('Email already registered', { email: 'already taken' });
  }

  const password = await hashPassword(input.password);
  const [created] = await db
    .insert(users)
    .values({
      uuid: uuidv4(),
      firstName: input.first_name,
      lastName: input.last_name ?? null,
      gender: input.gender ?? null,
      email: input.email.toLowerCase(),
      phone: input.phone ?? null,
      password,
      imageUrl: `${env.PUBLIC_BASE_URL}/uploads/default-avatar.jpg`,
      status: 1,
    })
    .returning();

  return mapUser(created);
}

export async function loginUser(input: LoginInput) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, input.email.toLowerCase()),
  });

  if (!user || !user.password) {
    throw new ValidationError('Invalid email or password', { msg: 'Invalid email or password' });
  }

  const ok = await verifyPassword(input.password, user.password);
  if (!ok) {
    throw new ValidationError('Invalid email or password', { msg: 'Invalid email or password' });
  }

  const apiKey = generateApiKey();
  await db.insert(userApiKeys).values({ apiKey, userId: user.id });

  logger.info({ userId: user.id }, 'user.login');
  return { auth_token: apiKey };
}

export async function logoutUser(apiKey: string) {
  await db.delete(userApiKeys).where(eq(userApiKeys.apiKey, apiKey));
  logger.info('user.logout');
}

export async function recoverAccount(email: string) {
  const message = {
    message:
      'If an account exists with the email then you should receive OTP in it. Use it to recover your account.',
  };

  const user = await db.query.users.findFirst({
    where: eq(users.email, email.toLowerCase()),
  });

  if (!user) {
    logger.info({ email }, 'recover.account.unknown_email');
    return message;
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  await db.insert(otps).values({ otp, userId: user.id, attempted: 1 });

  logger.info({ userId: user.id, otp, email: user.email }, 'recover.account.otp_created');
  return message;
}

export async function recoverPassword(username: string, otpCode: string, password: string) {
  const otpRow = await db.query.otps.findFirst({
    where: eq(otps.otp, otpCode),
  });
  if (!otpRow) throw new NotFoundError('OTP not found');

  const user = await db.query.users.findFirst({
    where: and(eq(users.id, otpRow.userId), eq(users.email, username.toLowerCase())),
  });
  if (!user) throw new NotFoundError('User not found');

  const hashed = await hashPassword(password);
  await db
    .update(users)
    .set({ password: hashed, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  await db.delete(otps).where(eq(otps.id, otpRow.id));
  await db.delete(userApiKeys).where(eq(userApiKeys.userId, user.id));

  logger.info({ userId: user.id }, 'recover.password.success');
}
