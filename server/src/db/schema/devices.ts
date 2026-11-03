import { bigint, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const deviceInfos = pgTable('device_infos', {
  id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity().primaryKey(),
  userId: bigint('user_id', { mode: 'number' }).notNull(),
  osVersion: varchar('os_version', { length: 64 }),
  deviceName: varchar('device_name', { length: 64 }),
  device: varchar('device', { length: 64 }),
  model: varchar('model', { length: 64 }),
  vendor: varchar('vendor', { length: 64 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userDevices = pgTable('user_devices', {
  id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity().primaryKey(),
  name: varchar('name', { length: 64 }).notNull(),
  osName: varchar('os_name', { length: 64 }),
  osVersion: varchar('os_version', { length: 64 }),
  vendor: varchar('vendor', { length: 64 }),
  model: varchar('model', { length: 64 }),
  displayWidthPx: integer('display_width_px'),
  displayHeightPx: integer('display_height_px'),
  userId: bigint('user_id', { mode: 'number' })
    .notNull()
    .references(() => users.id),
});
