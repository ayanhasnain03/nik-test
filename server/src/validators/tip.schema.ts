import { z } from 'zod';

export const tipCreateSchema = z.object({
  title: z.string().min(1).max(128),
  content: z.string().optional().nullable(),
  status: z.coerce.number().int().optional(),
});

export const tipUpdateSchema = tipCreateSchema.partial();
