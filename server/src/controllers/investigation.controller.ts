import type { Request, Response } from 'express';
import { BadRequestError } from '../lib/errors.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { created, ok } from '../lib/response.js';
import { AuthActorType } from '../types/enums.js';
import * as investigationService from '../services/investigation.service.js';
import * as foodTestService from '../services/foodTest.service.js';

function actor(req: Request) {
  const isAdmin = req.auth?.type === AuthActorType.Admin;
  const userId = req.auth?.user?.id;
  return { isAdmin, userId };
}

export const listAll = asyncHandler(async (req: Request, res: Response) => {
  const rows = await investigationService.listInvestigations(req.query as never);
  ok(res, rows);
});

export const listForUser = asyncHandler(async (req: Request, res: Response) => {
  const rows = await investigationService.listInvestigations({
    ...(req.query as object),
    userId: Number(req.params.userId),
  } as never);
  ok(res, rows);
});

export const find = asyncHandler(async (req: Request, res: Response) => {
  const { isAdmin, userId } = actor(req);
  await investigationService.assertInvestigationAccess(Number(req.params.id), {
    isAdmin,
    userId,
  });
  const row = await investigationService.findInvestigation(Number(req.params.id));
  ok(res, row);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.auth!.user?.id ?? Number(req.body.user_id);
  const row = await investigationService.createInvestigation(userId, req.body);
  created(res, row);
});

export const createForUser = asyncHandler(async (req: Request, res: Response) => {
  const row = await investigationService.createInvestigation(Number(req.params.userId), req.body);
  created(res, row);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { isAdmin, userId } = actor(req);
  await investigationService.assertInvestigationAccess(Number(req.params.id), {
    isAdmin,
    userId,
  });
  const row = await investigationService.updateInvestigation(Number(req.params.id), req.body);
  ok(res, row);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { isAdmin, userId } = actor(req);
  await investigationService.assertInvestigationAccess(Number(req.params.id), {
    isAdmin,
    userId,
  });
  await investigationService.deleteInvestigation(Number(req.params.id));
  ok(res, {});
});

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new BadRequestError('Image file is required');
  const { isAdmin, userId } = actor(req);
  await investigationService.assertInvestigationAccess(Number(req.params.id), {
    isAdmin,
    userId,
  });
  const row = await investigationService.uploadInvestigationImage(
    Number(req.params.id),
    req.file.filename,
  );
  ok(res, row);
});

export const listTests = asyncHandler(async (req: Request, res: Response) => {
  const { isAdmin, userId } = actor(req);
  await investigationService.assertInvestigationAccess(Number(req.params.id), {
    isAdmin,
    userId,
  });
  const rows = await foodTestService.listFoodTests({
    investigationId: Number(req.params.id),
    excludeDeleted: req.auth?.type === AuthActorType.User,
    ...(req.query as object),
  } as never);
  ok(res, rows);
});

export const createTest = asyncHandler(async (req: Request, res: Response) => {
  const { isAdmin, userId } = actor(req);
  await investigationService.assertInvestigationAccess(Number(req.params.id), {
    isAdmin,
    userId,
  });
  const row = await foodTestService.createFoodTestForInvestigation(
    Number(req.params.id),
    req.body,
  );
  created(res, row);
});

export const listActivities = asyncHandler(async (req: Request, res: Response) => {
  const { isAdmin, userId } = actor(req);
  await investigationService.assertInvestigationAccess(Number(req.params.id), {
    isAdmin,
    userId,
  });
  const rows = await investigationService.listActivities(Number(req.params.id));
  ok(res, rows);
});

export const createActivity = asyncHandler(async (req: Request, res: Response) => {
  const { isAdmin, userId } = actor(req);
  await investigationService.assertInvestigationAccess(Number(req.params.id), {
    isAdmin,
    userId,
  });
  const row = await investigationService.createActivity(Number(req.params.id), req.body);
  created(res, row);
});
