import { bigint, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity().primaryKey(),
  name: varchar('name', { length: 64 }),
  description: varchar('description', { length: 512 }),
  imageUrl: varchar('image_url', { length: 256 }),
  parentId: bigint('parent_id', { mode: 'number' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Category = typeof categories.$inferSelect;
