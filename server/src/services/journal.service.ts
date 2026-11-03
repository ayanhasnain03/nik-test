import { and, desc, eq, gte, lte, ne, SQL } from 'drizzle-orm';
import { db } from '../db/index.js';
import { mapJournal } from '../db/mappers.js';
import { userJournals } from '../db/schema/journals.js';
import { NotFoundError } from '../lib/errors.js';
import { JournalStatus } from '../types/enums.js';
import { parsePagination } from '../utils/pagination.js';

export async function listJournals(
  userId: number,
  query: { page?: number; from_date?: string; to_date?: string },
) {
  const { limit, offset } = parsePagination({ page: query.page });
  const filters: SQL[] = [
    eq(userJournals.userId, userId),
    ne(userJournals.status, JournalStatus.Deleted),
  ];
  if (query.from_date) filters.push(gte(userJournals.journalDate, new Date(query.from_date)));
  if (query.to_date) filters.push(lte(userJournals.journalDate, new Date(query.to_date)));

  const rows = await db
    .select()
    .from(userJournals)
    .where(and(...filters))
    .orderBy(desc(userJournals.journalDate))
    .limit(limit)
    .offset(offset);

  return rows.map(mapJournal);
}

export async function findJournal(id: number) {
  const row = await db.query.userJournals.findFirst({ where: eq(userJournals.id, id) });
  if (!row || row.status === JournalStatus.Deleted) throw new NotFoundError('Journal not found');
  return mapJournal(row);
}

export async function createJournal(
  userId: number,
  input: {
    name: string;
    content?: string | null;
    journal_date?: string | null;
    status?: number;
  },
) {
  const [created] = await db
    .insert(userJournals)
    .values({
      name: input.name,
      content: input.content ?? null,
      userId,
      journalDate: input.journal_date ? new Date(input.journal_date) : new Date(),
      status: input.status ?? JournalStatus.Active,
    })
    .returning();
  return mapJournal(created);
}

export async function updateJournal(
  id: number,
  input: {
    name?: string;
    content?: string | null;
    journal_date?: string | null;
    status?: number;
  },
) {
  const [updated] = await db
    .update(userJournals)
    .set({
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
      ...(input.journal_date !== undefined
        ? { journalDate: input.journal_date ? new Date(input.journal_date) : null }
        : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      updatedAt: new Date(),
    })
    .where(eq(userJournals.id, id))
    .returning();

  if (!updated) throw new NotFoundError('Journal not found');
  return mapJournal(updated);
}
