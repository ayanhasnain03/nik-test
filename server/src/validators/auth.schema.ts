import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(18),
});

export const registerSchema = z.object({
  first_name: z.string().min(1).max(32),
  last_name: z.string().max(32).optional().nullable(),
  gender: z.coerce.number().int().optional().nullable(),
  email: z.string().email().max(64),
  phone: z.string().max(12).optional().nullable(),
  password: z.string().min(6).max(64),
});

export const recoverAccountSchema = z.object({
  username: z.string().email(),
});

export const recoverPasswordSchema = z.object({
  username: z.string().email(),
  otp: z.string().min(4).max(6),
  password: z.string().min(6).max(18),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
