import {
  bigint,
  index,
  integer,
  pgTable,
  smallint,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity().primaryKey(),
    uuid: varchar('uuid', { length: 64 }).notNull(),
    firstName: varchar('first_name', { length: 32 }).notNull(),
    lastName: varchar('last_name', { length: 32 }),
    gender: smallint('gender'),
    phone: varchar('phone', { length: 12 }).unique(),
    email: varchar('email', { length: 64 }).unique(),
    password: varchar('password', { length: 64 }),
    imageUrl: varchar('image_url', { length: 256 }),
    dob: timestamp('dob'),
    height: integer('height'),
    weight: integer('weight'),
    bloodGroup: varchar('blood_group', { length: 8 }),
    status: smallint('status').default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    verifiedAt: timestamp('verified_at'),
  },
  (table) => [
    index('users_name_idx').on(table.firstName, table.lastName),
    index('users_phone_idx').on(table.phone),
    index('users_created_at_idx').on(table.createdAt),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
