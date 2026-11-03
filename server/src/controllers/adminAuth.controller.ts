import type { Request, Response } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { ok } from '../lib/response.js';
import { extractBearerToken } from '../lib/tokens.js';
import * as adminAuthService from '../services/adminAuth.service.js';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const token = await adminAuthService.loginAdmin(req.body);
  ok(res, token);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = extractBearerToken(req.headers.authorization);
  if (token) await adminAuthService.logoutAdmin(token);
  ok(res, {});
});
