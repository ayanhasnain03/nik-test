import { desc, eq, ne } from 'drizzle-orm';
import { db } from '../db/index.js';
import { mapTip } from '../db/mappers.js';
import { tips } from '../db/schema/tips.js';
import { NotFoundError } from '../lib/errors.js';
import { TipStatus } from '../types/enums.js';

export async function listTips() {
  const rows = await db
    .select()
    .from(tips)
    .where(ne(tips.status, TipStatus.Deleted))
    .orderBy(desc(tips.createdAt));
  return rows.map(mapTip);
}

export async function findTip(id: number) {
  const row = await db.query.tips.findFirst({ where: eq(tips.id, id) });
  if (!row || row.status === TipStatus.Deleted) throw new NotFoundError('Tip not found');
  return mapTip(row);
}

export async function createTip(
  adminId: number,
  input: { title: string; content?: string | null; status?: number },
) {
  const [created] = await db
    .insert(tips)
    .values({
      title: input.title,
      content: input.content ?? null,
      adminId,
      status: input.status ?? TipStatus.Active,
    })
    .returning();
  return mapTip(created);
}

export async function updateTip(
  id: number,
  input: { title?: string; content?: string | null; status?: number },
) {
  const [updated] = await db
    .update(tips)
    .set({
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      updatedAt: new Date(),
    })
    .where(eq(tips.id, id))
    .returning();
  if (!updated) throw new NotFoundError('Tip not found');
  return mapTip(updated);
}

export async function deleteTip(id: number) {
  const [updated] = await db
    .update(tips)
    .set({ status: TipStatus.Deleted, updatedAt: new Date() })
    .where(eq(tips.id, id))
    .returning();
  if (!updated) throw new NotFoundError('Tip not found');
}
