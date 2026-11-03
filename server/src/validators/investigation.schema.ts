import { z } from 'zod';

export const investigationCreateSchema = z.object({
  name: z.string().min(1).max(64),
  description: z.string().max(512).optional().nullable(),
  category_id: z.coerce.number().int().positive().optional().nullable(),
  image_url: z.string().max(256).optional().nullable(),
  status: z.coerce.number().int().optional(),
});

export const investigationUpdateSchema = investigationCreateSchema.partial();

export const investigationListQuerySchema = z.object({
  q: z.string().max(128).optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  status: z.coerce.number().int().optional(),
});

export const activityCreateSchema = z.object({
  reason: z.string().max(256).optional().nullable(),
  status: z.coerce.number().int(),
});
