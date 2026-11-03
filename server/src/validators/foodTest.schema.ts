import { z } from 'zod';

export const foodTestCreateSchema = z.object({
  total_time: z.coerce.number().int().nonnegative(),
  during_start_time: z.coerce.number().int().nonnegative(),
  during_end_time: z.coerce.number().int().nonnegative(),
  after_start_time: z.coerce.number().int().nonnegative(),
  after_end_time: z.coerce.number().int().nonnegative(),
  heart_rates: z.array(z.coerce.number().int()).min(1),
  description: z.string().max(256).optional().nullable(),
  skipped_after: z.boolean().optional().default(true),
  investigation_id: z.coerce.number().int().positive().optional(),
});

export const foodTestUpdateSchema = z.object({
  description: z.string().max(256).optional().nullable(),
  note: z.string().max(512).optional().nullable(),
  had_symptom: z.boolean().optional(),
  result: z.coerce.number().int().optional(),
  status: z.coerce.number().int().optional(),
  before_heart_rate: z.coerce.number().int().optional(),
  during_heart_rate: z.coerce.number().int().optional(),
  after1_heart_rate: z.coerce.number().int().optional(),
  after2_heart_rate: z.coerce.number().int().optional(),
  diff_heart_rate: z.coerce.number().int().optional(),
});

export const foodTestListQuerySchema = z.object({
  q: z.string().max(128).optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  from_hrchange: z.coerce.number().int().optional(),
  to_hrchange: z.coerce.number().int().optional(),
  page: z.coerce.number().int().positive().optional(),
  status: z.coerce.number().int().optional(),
  sortby: z.string().max(128).optional(),
  sortdir: z.string().max(128).optional(),
});
