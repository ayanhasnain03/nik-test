import { bigint, index, pgTable, smallint, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const userJournals = pgTable(
  'user_journals',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity().primaryKey(),
    name: varchar('name', { length: 64 }).notNull(),
    content: varchar('content', { length: 1024 }),
    userId: bigint('user_id', { mode: 'number' })
      .notNull()
      .references(() => users.id),
    status: smallint('status').default(1),
    journalDate: timestamp('journal_date').defaultNow(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [index('user_journals_user_id_idx').on(table.userId)],
);

export type UserJournal = typeof userJournals.$inferSelect;
export type NewUserJournal = typeof userJournals.$inferInsert;
