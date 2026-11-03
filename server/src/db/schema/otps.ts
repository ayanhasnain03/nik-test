import { bigint, char, index, integer, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const otps = pgTable(
  'otps',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity().primaryKey(),
    otp: char('otp', { length: 6 }).notNull().unique(),
    attempted: integer('attempted').notNull().default(1),
    userId: bigint('user_id', { mode: 'number' })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('otps_otp_idx').on(table.otp),
    index('otps_user_id_idx').on(table.userId),
  ],
);

export type Otp = typeof otps.$inferSelect;
export type NewOtp = typeof otps.$inferInsert;
