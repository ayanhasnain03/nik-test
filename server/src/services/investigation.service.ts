import { and, desc, eq, gte, ilike, lte, ne, SQL } from 'drizzle-orm';
import { env } from '../config/index.js';
import { db } from '../db/index.js';
import { mapActivity, mapInvestigation } from '../db/mappers.js';
import {
  foodInvestigationActivities,
  foodInvestigations,
} from '../db/schema/investigations.js';
import { ForbiddenError, NotFoundError } from '../lib/errors.js';
import { InvestigationStatus } from '../types/enums.js';
import { parsePagination } from '../utils/pagination.js';

function buildFilters(query: {
  q?: string;
  from_date?: string;
  to_date?: string;
  status?: number;
  userId?: number;
}) {
  const filters: SQL[] = [];
  if (query.userId !== undefined) filters.push(eq(foodInvestigations.userId, query.userId));
  if (query.q) filters.push(ilike(foodInvestigations.name, `%${query.q}%`));
  if (query.status !== undefined) filters.push(eq(foodInvestigations.status, query.status));
  else filters.push(ne(foodInvestigations.status, InvestigationStatus.Deleted));
  if (query.from_date) filters.push(gte(foodInvestigations.createdAt, new Date(query.from_date)));
  if (query.to_date) filters.push(lte(foodInvestigations.createdAt, new Date(query.to_date)));
  return filters;
}

export async function listInvestigations(query: {
  q?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  status?: number;
  userId?: number;
}) {
  const { limit, offset } = parsePagination({ page: query.page });
  const filters = buildFilters(query);

  const rows = await db
    .select()
    .from(foodInvestigations)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(foodInvestigations.createdAt))
    .limit(limit)
    .offset(offset);

  return rows.map(mapInvestigation);
}

export async function findInvestigation(id: number) {
  const row = await db.query.foodInvestigations.findFirst({
    where: eq(foodInvestigations.id, id),
  });
  if (!row || row.status === InvestigationStatus.Deleted) {
    throw new NotFoundError('Investigation not found');
  }
  return mapInvestigation(row);
}

export async function assertInvestigationAccess(
  id: number,
  opts: { userId?: number; isAdmin?: boolean },
) {
  const row = await db.query.foodInvestigations.findFirst({
    where: eq(foodInvestigations.id, id),
  });
  if (!row || row.status === InvestigationStatus.Deleted) {
    throw new NotFoundError('Investigation not found');
  }
  if (!opts.isAdmin && opts.userId !== undefined && row.userId !== opts.userId) {
    throw new ForbiddenError('You do not own this investigation');
  }
  return row;
}

export async function createInvestigation(
  userId: number,
  input: {
    name: string;
    description?: string | null;
    category_id?: number | null;
    image_url?: string | null;
    status?: number;
  },
) {
  const [created] = await db
    .insert(foodInvestigations)
    .values({
      name: input.name,
      description: input.description ?? null,
      categoryId: input.category_id ?? null,
      imageUrl: input.image_url ?? null,
      userId,
      status: input.status ?? InvestigationStatus.Open,
    })
    .returning();

  return mapInvestigation(created);
}

export async function updateInvestigation(
  id: number,
  input: {
    name?: string;
    description?: string | null;
    category_id?: number | null;
    image_url?: string | null;
    status?: number;
  },
) {
  const [updated] = await db
    .update(foodInvestigations)
    .set({
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.category_id !== undefined ? { categoryId: input.category_id } : {}),
      ...(input.image_url !== undefined ? { imageUrl: input.image_url } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      updatedAt: new Date(),
    })
    .where(eq(foodInvestigations.id, id))
    .returning();

  if (!updated) throw new NotFoundError('Investigation not found');
  return mapInvestigation(updated);
}

export async function deleteInvestigation(id: number) {
  const [updated] = await db
    .update(foodInvestigations)
    .set({ status: InvestigationStatus.Deleted, updatedAt: new Date() })
    .where(eq(foodInvestigations.id, id))
    .returning();
  if (!updated) throw new NotFoundError('Investigation not found');
}

export async function uploadInvestigationImage(id: number, filename: string) {
  const imageUrl = `${env.PUBLIC_BASE_URL}/uploads/${filename}`;
  const [updated] = await db
    .update(foodInvestigations)
    .set({ imageUrl, updatedAt: new Date() })
    .where(eq(foodInvestigations.id, id))
    .returning();
  if (!updated) throw new NotFoundError('Investigation not found');
  return mapInvestigation(updated);
}

export async function listActivities(investigationId: number) {
  const rows = await db
    .select()
    .from(foodInvestigationActivities)
    .where(eq(foodInvestigationActivities.foodInvestigationId, investigationId))
    .orderBy(desc(foodInvestigationActivities.createdAt));
  return rows.map(mapActivity);
}

export async function createActivity(
  investigationId: number,
  input: { reason?: string | null; status: number },
) {
  const [created] = await db
    .insert(foodInvestigationActivities)
    .values({
      foodInvestigationId: investigationId,
      reason: input.reason ?? null,
      status: input.status,
    })
    .returning();

  await db
    .update(foodInvestigations)
    .set({ status: input.status, updatedAt: new Date() })
    .where(eq(foodInvestigations.id, investigationId));

  return mapActivity(created);
}
