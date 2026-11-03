import { z } from 'zod';

export const journalCreateSchema = z.object({
  name: z.string().min(1).max(64),
  content: z.string().max(1024).optional().nullable(),
  journal_date: z.string().optional().nullable(),
  status: z.coerce.number().int().optional(),
});

export const journalUpdateSchema = journalCreateSchema.partial();

export const journalListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
});
