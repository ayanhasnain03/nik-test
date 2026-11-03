import type { Request, Response } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { ok, created } from '../lib/response.js';
import * as authService from '../services/auth.service.js';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);
  created(res, user);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const token = await authService.loginUser(req.body);
  ok(res, token);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await authService.logoutUser(req.auth!.apiKey);
  ok(res, {});
});

export const recoverAccount = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.recoverAccount(req.body.username);
  ok(res, result);
});

export const recoverPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.recoverPassword(req.body.username, req.body.otp, req.body.password);
  ok(res, {});
});
