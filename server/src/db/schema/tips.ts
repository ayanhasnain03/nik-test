import { bigint, integer, pgTable, smallint, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { admins } from './admins.js';

export const tips = pgTable('tips', {
  id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity().primaryKey(),
  title: varchar('title', { length: 128 }).notNull(),
  content: text('content'),
  viewCount: integer('view_count').default(0),
  adminId: bigint('admin_id', { mode: 'number' })
    .notNull()
    .references(() => admins.id),
  status: smallint('status').default(1),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Tip = typeof tips.$inferSelect;
export type NewTip = typeof tips.$inferInsert;
