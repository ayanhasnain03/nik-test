import { asc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { mapCategory } from '../db/mappers.js';
import { categories } from '../db/schema/categories.js';

export async function listCategories() {
  const rows = await db.select().from(categories).orderBy(asc(categories.name));
  return rows.map(mapCategory);
}
