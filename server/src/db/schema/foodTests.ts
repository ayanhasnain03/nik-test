import {
  bigint,
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  smallint,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { foodInvestigations } from './investigations.js';

export const foodTests = pgTable(
  'food_tests',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity().primaryKey(),
    description: varchar('description', { length: 256 }),
    beforeHeartRate: smallint('before_heart_rate'),
    duringHeartRate: smallint('during_heart_rate'),
    after1HeartRate: smallint('after1_heart_rate'),
    after2HeartRate: smallint('after2_heart_rate'),
    diffHeartRate: smallint('diff_heart_rate'),
    result: smallint('result').default(1),
    totalTime: integer('total_time').default(0),
    stdDev: numeric('std_dev', { precision: 4, scale: 2 }),
    hadSymptom: boolean('had_symptom'),
    note: varchar('note', { length: 512 }),
    foodInvestigationId: bigint('food_investigation_id', { mode: 'number' })
      .notNull()
      .references(() => foodInvestigations.id),
    status: smallint('status').default(1),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    endedAt: timestamp('ended_at'),
  },
  (table) => [
    index('food_tests_before_hr_idx').on(table.beforeHeartRate),
    index('food_tests_during_hr_idx').on(table.duringHeartRate),
    index('food_tests_after1_hr_idx').on(table.after1HeartRate),
    index('food_tests_after2_hr_idx').on(table.after2HeartRate),
    index('food_tests_diff_hr_idx').on(table.diffHeartRate),
    index('food_tests_std_dev_idx').on(table.stdDev),
    index('food_tests_result_idx').on(table.result),
    index('food_tests_had_symptom_idx').on(table.hadSymptom),
    index('food_tests_investigation_id_idx').on(table.foodInvestigationId),
  ],
);

export type FoodTest = typeof foodTests.$inferSelect;
export type NewFoodTest = typeof foodTests.$inferInsert;
