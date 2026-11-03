import type { Request, Response } from 'express';
import { BadRequestError } from '../lib/errors.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { created, ok } from '../lib/response.js';
import { AuthActorType } from '../types/enums.js';
import * as userService from '../services/user.service.js';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.listUsers(req.query as never);
  ok(res, users);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  created(res, user);
});

export const find = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.findUser(Number(req.params.id));
  ok(res, user);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateUser(Number(req.params.id), req.body);
  ok(res, user);
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.resetUserPassword(Number(req.params.id));
  ok(res, user);
});

export const myProfile = asyncHandler(async (req: Request, res: Response) => {
  if (req.auth?.type === AuthActorType.Admin && req.auth.admin) {
    ok(res, {
      id: req.auth.admin.id,
      first_name: req.auth.admin.firstName,
      last_name: req.auth.admin.lastName,
      gender: req.auth.admin.gender,
      phone: req.auth.admin.phone,
      email: req.auth.admin.email,
      image_url: req.auth.admin.photo,
      role: req.auth.admin.role,
      status: req.auth.admin.status,
      created_at: req.auth.admin.createdAt,
      updated_at: req.auth.admin.updatedAt,
    });
    return;
  }
  const user = await userService.getMyProfile(req.auth!.user!.id);
  ok(res, user);
});

export const updateMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateProfile(req.auth!.user!.id, req.body);
  ok(res, user);
});

export const uploadPhoto = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new BadRequestError('Image file is required');
  const userId =
    req.params.id !== undefined ? Number(req.params.id) : req.auth!.user!.id;
  const user = await userService.updateProfilePhoto(userId, req.file.filename);
  ok(res, user);
});
