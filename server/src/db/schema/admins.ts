import {
  bigint,
  index,
  integer,
  pgTable,
  smallint,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const admins = pgTable(
  'admins',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity().primaryKey(),
    firstName: varchar('first_name', { length: 32 }).notNull(),
    lastName: varchar('last_name', { length: 32 }).notNull(),
    gender: integer('gender').notNull(),
    phone: varchar('phone', { length: 12 }).notNull().unique(),
    email: varchar('email', { length: 64 }).notNull().unique(),
    password: varchar('password', { length: 64 }).notNull(),
    photo: varchar('photo', { length: 64 }),
    status: smallint('status'),
    role: smallint('role').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('admins_phone_idx').on(table.phone),
    index('admins_email_idx').on(table.email),
  ],
);

export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
