import {
  bigint,
  index,
  pgTable,
  smallint,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import { categories } from './categories.js';
import { users } from './users.js';

export const foodInvestigations = pgTable(
  'food_investigations',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity().primaryKey(),
    name: varchar('name', { length: 64 }).notNull(),
    description: varchar('description', { length: 512 }),
    imageUrl: varchar('image_url', { length: 256 }),
    categoryId: bigint('category_id', { mode: 'number' }).references(() => categories.id),
    userId: bigint('user_id', { mode: 'number' })
      .notNull()
      .references(() => users.id),
    status: smallint('status').default(1),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    unique('food_investigations_name_user_unique').on(table.name, table.userId),
    index('food_investigations_name_idx').on(table.name),
    index('food_investigations_user_id_idx').on(table.userId),
  ],
);

export const foodInvestigationActivities = pgTable(
  'food_investigation_activities',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity().primaryKey(),
    reason: varchar('reason', { length: 256 }),
    foodInvestigationId: bigint('food_investigation_id', { mode: 'number' })
      .notNull()
      .references(() => foodInvestigations.id),
    status: smallint('status').default(1),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('food_investigation_activities_investigation_id_idx').on(table.foodInvestigationId),
  ],
);

export type FoodInvestigation = typeof foodInvestigations.$inferSelect;
export type NewFoodInvestigation = typeof foodInvestigations.$inferInsert;
export type FoodInvestigationActivity = typeof foodInvestigationActivities.$inferSelect;
