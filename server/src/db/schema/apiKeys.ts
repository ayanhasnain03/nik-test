import { bigint, index, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { admins } from './admins.js';
import { users } from './users.js';

export const userApiKeys = pgTable(
  'user_api_keys',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity().primaryKey(),
    apiKey: varchar('api_key', { length: 64 }).notNull().unique(),
    userId: bigint('user_id', { mode: 'number' })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [index('user_api_keys_api_key_idx').on(table.apiKey)],
);

export const adminApiKeys = pgTable(
  'admin_api_keys',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity().primaryKey(),
    apiKey: varchar('api_key', { length: 64 }).notNull().unique(),
    adminId: bigint('admin_id', { mode: 'number' })
      .notNull()
      .references(() => admins.id),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [index('admin_api_keys_api_key_idx').on(table.apiKey)],
);

export type UserApiKey = typeof userApiKeys.$inferSelect;
export type AdminApiKey = typeof adminApiKeys.$inferSelect;
