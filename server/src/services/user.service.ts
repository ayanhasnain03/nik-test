import { and, desc, eq, gte, ilike, lte, or, SQL } from 'drizzle-orm';
import { env } from '../config/index.js';
import { db } from '../db/index.js';
import { mapUser } from '../db/mappers.js';
import { userApiKeys } from '../db/schema/apiKeys.js';
import { users } from '../db/schema/users.js';
import { NotFoundError } from '../lib/errors.js';
import { hashPassword } from '../lib/password.js';
import { parsePagination } from '../utils/pagination.js';
import type { RegisterInput } from '../validators/auth.schema.js';
import { v4 as uuidv4 } from 'uuid';

export async function listUsers(query: {
  q?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  status?: number;
}) {
  const { limit, offset } = parsePagination({ page: query.page });
  const filters: SQL[] = [];

  if (query.q) {
    filters.push(
      or(
        ilike(users.firstName, `%${query.q}%`),
        ilike(users.lastName, `%${query.q}%`),
        ilike(users.email, `%${query.q}%`),
      )!,
    );
  }
  if (query.status !== undefined) filters.push(eq(users.status, query.status));
  if (query.from_date) filters.push(gte(users.createdAt, new Date(query.from_date)));
  if (query.to_date) filters.push(lte(users.createdAt, new Date(query.to_date)));

  const rows = await db
    .select()
    .from(users)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset);

  return rows.map(mapUser);
}

export async function findUser(id: number) {
  const user = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!user) throw new NotFoundError('User not found');
  return mapUser(user);
}

export async function createUser(input: RegisterInput) {
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

export async function updateUser(
  id: number,
  input: {
    first_name?: string;
    last_name?: string | null;
    gender?: number | null;
    phone?: string | null;
    email?: string;
    height?: number | null;
    weight?: number | null;
    blood_group?: string | null;
    status?: number;
  },
) {
  const [updated] = await db
    .update(users)
    .set({
      ...(input.first_name !== undefined ? { firstName: input.first_name } : {}),
      ...(input.last_name !== undefined ? { lastName: input.last_name } : {}),
      ...(input.gender !== undefined ? { gender: input.gender } : {}),
      ...(input.phone !== undefined ? { phone: input.phone } : {}),
      ...(input.email !== undefined ? { email: input.email.toLowerCase() } : {}),
      ...(input.height !== undefined ? { height: input.height } : {}),
      ...(input.weight !== undefined ? { weight: input.weight } : {}),
      ...(input.blood_group !== undefined ? { bloodGroup: input.blood_group } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  if (!updated) throw new NotFoundError('User not found');
  return mapUser(updated);
}

export async function updateProfile(
  userId: number,
  input: { first_name?: string; last_name?: string | null; gender?: number | null },
) {
  return updateUser(userId, input);
}

export async function updateProfilePhoto(userId: number, filename: string) {
  const imageUrl = `${env.PUBLIC_BASE_URL}/uploads/${filename}`;
  const [updated] = await db
    .update(users)
    .set({ imageUrl, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  if (!updated) throw new NotFoundError('User not found');
  return mapUser(updated);
}

export async function resetUserPassword(id: number, defaultPassword = 'password') {
  const hashed = await hashPassword(defaultPassword);
  const [updated] = await db
    .update(users)
    .set({ password: hashed, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  if (!updated) throw new NotFoundError('User not found');
  await db.delete(userApiKeys).where(eq(userApiKeys.userId, id));
  return mapUser(updated);
}

export async function getMyProfile(userId: number) {
  return findUser(userId);
}
