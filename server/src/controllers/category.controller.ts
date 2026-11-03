import type { Request, Response } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { ok } from '../lib/response.js';
import * as categoryService from '../services/category.service.js';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  ok(res, await categoryService.listCategories());
});
