import { and, desc, eq, gte, ilike, lte, ne, SQL } from 'drizzle-orm';
import { db } from '../db/index.js';
import { mapFoodTest } from '../db/mappers.js';
import { foodInvestigations } from '../db/schema/investigations.js';
import { foodTests } from '../db/schema/foodTests.js';
import { NotFoundError } from '../lib/errors.js';
import { FoodTestStatus } from '../types/enums.js';
import { calculateFoodTestResult } from '../utils/foodTestAlgorithm.js';
import { parsePagination } from '../utils/pagination.js';

export async function listFoodTests(query: {
  q?: string;
  from_date?: string;
  to_date?: string;
  from_hrchange?: number;
  to_hrchange?: number;
  page?: number;
  status?: number;
  sortby?: string;
  sortdir?: string;
  userId?: number;
  investigationId?: number;
  excludeDeleted?: boolean;
}) {
  const { limit, offset } = parsePagination({ page: query.page });
  const filters: SQL[] = [];

  if (query.investigationId !== undefined) {
    filters.push(eq(foodTests.foodInvestigationId, query.investigationId));
  }
  if (query.q) filters.push(ilike(foodTests.description, `%${query.q}%`));
  if (query.status !== undefined) filters.push(eq(foodTests.status, query.status));
  else if (query.excludeDeleted !== false) {
    filters.push(ne(foodTests.status, FoodTestStatus.Deleted));
  }
  if (query.from_date) filters.push(gte(foodTests.createdAt, new Date(query.from_date)));
  if (query.to_date) filters.push(lte(foodTests.createdAt, new Date(query.to_date)));
  if (query.from_hrchange !== undefined) {
    filters.push(gte(foodTests.diffHeartRate, query.from_hrchange));
  }
  if (query.to_hrchange !== undefined) {
    filters.push(lte(foodTests.diffHeartRate, query.to_hrchange));
  }

  if (query.userId !== undefined) {
    const rows = await db
      .select({ test: foodTests })
      .from(foodTests)
      .innerJoin(foodInvestigations, eq(foodTests.foodInvestigationId, foodInvestigations.id))
      .where(and(eq(foodInvestigations.userId, query.userId), ...filters))
      .orderBy(desc(foodTests.createdAt))
      .limit(limit)
      .offset(offset);

    return rows.map((r) => mapFoodTest(r.test));
  }

  const rows = await db
    .select()
    .from(foodTests)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(foodTests.createdAt))
    .limit(limit)
    .offset(offset);

  return rows.map(mapFoodTest);
}

export async function findFoodTest(id: number) {
  const row = await db.query.foodTests.findFirst({ where: eq(foodTests.id, id) });
  if (!row || row.status === FoodTestStatus.Deleted) {
    throw new NotFoundError('Food test not found');
  }
  return mapFoodTest(row);
}

export async function createFoodTestForInvestigation(
  investigationId: number,
  input: {
    total_time: number;
    during_start_time: number;
    during_end_time: number;
    after_start_time: number;
    after_end_time: number;
    heart_rates: number[];
    description?: string | null;
    skipped_after?: boolean;
  },
) {
  const investigation = await db.query.foodInvestigations.findFirst({
    where: eq(foodInvestigations.id, investigationId),
  });
  if (!investigation) throw new NotFoundError('Investigation not found');

  const calculated = calculateFoodTestResult({
    totalTime: input.total_time,
    duringStartTime: input.during_start_time,
    duringEndTime: input.during_end_time,
    afterStartTime: input.after_start_time,
    afterEndTime: input.after_end_time,
    heartRates: input.heart_rates,
    skippedAfter: input.skipped_after ?? true,
    description: input.description ?? undefined,
  });

  const description = input.description
    ? `${investigation.name}: ${input.description}`
    : investigation.name;

  const [created] = await db
    .insert(foodTests)
    .values({
      description,
      beforeHeartRate: calculated.beforeHeartRate,
      duringHeartRate: calculated.duringHeartRate,
      after1HeartRate: calculated.after1HeartRate,
      after2HeartRate: calculated.after2HeartRate,
      diffHeartRate: calculated.diffHeartRate,
      result: calculated.result,
      totalTime: calculated.totalTime,
      stdDev: String(calculated.stdDev),
      hadSymptom: false,
      note: '',
      foodInvestigationId: investigationId,
      status: FoodTestStatus.Open,
    })
    .returning();

  return mapFoodTest(created);
}

export async function updateFoodTest(
  id: number,
  input: {
    description?: string | null;
    note?: string | null;
    had_symptom?: boolean;
    result?: number;
    status?: number;
    before_heart_rate?: number;
    during_heart_rate?: number;
    after1_heart_rate?: number;
    after2_heart_rate?: number;
    diff_heart_rate?: number;
  },
) {
  const [updated] = await db
    .update(foodTests)
    .set({
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.note !== undefined ? { note: input.note } : {}),
      ...(input.had_symptom !== undefined ? { hadSymptom: input.had_symptom } : {}),
      ...(input.result !== undefined ? { result: input.result } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.before_heart_rate !== undefined
        ? { beforeHeartRate: input.before_heart_rate }
        : {}),
      ...(input.during_heart_rate !== undefined
        ? { duringHeartRate: input.during_heart_rate }
        : {}),
      ...(input.after1_heart_rate !== undefined
        ? { after1HeartRate: input.after1_heart_rate }
        : {}),
      ...(input.after2_heart_rate !== undefined
        ? { after2HeartRate: input.after2_heart_rate }
        : {}),
      ...(input.diff_heart_rate !== undefined ? { diffHeartRate: input.diff_heart_rate } : {}),
      updatedAt: new Date(),
    })
    .where(eq(foodTests.id, id))
    .returning();

  if (!updated) throw new NotFoundError('Food test not found');
  return mapFoodTest(updated);
}

export async function deleteFoodTest(id: number) {
  const [updated] = await db
    .update(foodTests)
    .set({ status: FoodTestStatus.Deleted, updatedAt: new Date() })
    .where(eq(foodTests.id, id))
    .returning();
  if (!updated) throw new NotFoundError('Food test not found');
}
