import type { Request, Response } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { ok } from '../lib/response.js';
import * as foodTestService from '../services/foodTest.service.js';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const rows = await foodTestService.listFoodTests(req.query as never);
  ok(res, rows);
});

export const listForUser = asyncHandler(async (req: Request, res: Response) => {
  const rows = await foodTestService.listFoodTests({
    ...(req.query as object),
    userId: Number(req.params.userId),
    excludeDeleted: true,
  } as never);
  ok(res, rows);
});

export const find = asyncHandler(async (req: Request, res: Response) => {
  const row = await foodTestService.findFoodTest(Number(req.params.id));
  ok(res, row);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const row = await foodTestService.updateFoodTest(Number(req.params.id), req.body);
  ok(res, row);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await foodTestService.deleteFoodTest(Number(req.params.id));
  ok(res, {});
});
