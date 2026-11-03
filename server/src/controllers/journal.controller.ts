import type { Request, Response } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { created, ok } from '../lib/response.js';
import * as journalService from '../services/journal.service.js';

export const listForUser = asyncHandler(async (req: Request, res: Response) => {
  const rows = await journalService.listJournals(Number(req.params.userId), req.query as never);
  ok(res, rows);
});

export const createForUser = asyncHandler(async (req: Request, res: Response) => {
  const row = await journalService.createJournal(Number(req.params.userId), req.body);
  created(res, row);
});

export const find = asyncHandler(async (req: Request, res: Response) => {
  const row = await journalService.findJournal(Number(req.params.id));
  ok(res, row);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const row = await journalService.updateJournal(Number(req.params.id), req.body);
  ok(res, row);
});
