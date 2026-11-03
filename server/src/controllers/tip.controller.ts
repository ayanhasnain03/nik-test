import type { Request, Response } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { created, ok } from '../lib/response.js';
import * as tipService from '../services/tip.service.js';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  ok(res, await tipService.listTips());
});

export const find = asyncHandler(async (req: Request, res: Response) => {
  ok(res, await tipService.findTip(Number(req.params.id)));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  created(res, await tipService.createTip(req.auth!.admin!.id, req.body));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  ok(res, await tipService.updateTip(Number(req.params.id), req.body));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await tipService.deleteTip(Number(req.params.id));
  ok(res, {});
});
