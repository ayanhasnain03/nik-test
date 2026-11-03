import { z } from 'zod';

export const userListQuerySchema = z.object({
  q: z.string().max(128).optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  status: z.coerce.number().int().optional(),
});

export const userUpdateSchema = z.object({
  first_name: z.string().min(1).max(32).optional(),
  last_name: z.string().max(32).optional().nullable(),
  gender: z.coerce.number().int().optional().nullable(),
  phone: z.string().max(12).optional().nullable(),
  email: z.string().email().max(64).optional(),
  height: z.coerce.number().int().optional().nullable(),
  weight: z.coerce.number().int().optional().nullable(),
  blood_group: z.string().max(8).optional().nullable(),
  status: z.coerce.number().int().optional(),
});

export const profileUpdateSchema = z.object({
  first_name: z.string().min(1).max(32).optional(),
  last_name: z.string().max(32).optional().nullable(),
  gender: z.coerce.number().int().optional().nullable(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
