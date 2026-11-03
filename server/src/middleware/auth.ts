import { eq } from 'drizzle-orm';
import type { NextFunction, Request, Response } from 'express';
import { db } from '../db/index.js';
import { adminApiKeys, userApiKeys } from '../db/schema/apiKeys.js';
import { admins } from '../db/schema/admins.js';
import { users } from '../db/schema/users.js';
import { ForbiddenError, UnauthorizedError } from '../lib/errors.js';
import { extractBearerToken } from '../lib/tokens.js';
import { AuthActorType } from '../types/enums.js';

async function loadUserAuth(apiKey: string) {
  const row = await db
    .select({
      apiKey: userApiKeys.apiKey,
      user: users,
    })
    .from(userApiKeys)
    .innerJoin(users, eq(userApiKeys.userId, users.id))
    .where(eq(userApiKeys.apiKey, apiKey))
    .limit(1);

  if (!row[0]) return null;
  const { password: _p, ...user } = row[0].user;
  return { apiKey: row[0].apiKey, user };
}

async function loadAdminAuth(apiKey: string) {
  const row = await db
    .select({
      apiKey: adminApiKeys.apiKey,
      admin: admins,
    })
    .from(adminApiKeys)
    .innerJoin(admins, eq(adminApiKeys.adminId, admins.id))
    .where(eq(adminApiKeys.apiKey, apiKey))
    .limit(1);

  if (!row[0]) return null;
  const { password: _p, ...admin } = row[0].admin;
  return { apiKey: row[0].apiKey, admin };
}

function requireToken(req: Request): string {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) throw new UnauthorizedError('Missing or invalid Authorization Bearer token');
  return token;
}

export async function requireUser(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = requireToken(req);
    const auth = await loadUserAuth(token);
    if (!auth) throw new ForbiddenError('Invalid user token');
    req.auth = { type: AuthActorType.User, apiKey: auth.apiKey, user: auth.user };
    next();
  } catch (err) {
    next(err);
  }
}

export async function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = requireToken(req);
    const auth = await loadAdminAuth(token);
    if (!auth) throw new ForbiddenError('Invalid admin token');
    req.auth = { type: AuthActorType.Admin, apiKey: auth.apiKey, admin: auth.admin };
    next();
  } catch (err) {
    next(err);
  }
}

export async function requireUserOrAdmin(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = requireToken(req);
    const adminAuth = await loadAdminAuth(token);
    if (adminAuth) {
      req.auth = { type: AuthActorType.Admin, apiKey: adminAuth.apiKey, admin: adminAuth.admin };
      next();
      return;
    }
    const userAuth = await loadUserAuth(token);
    if (!userAuth) throw new ForbiddenError('Invalid token');
    req.auth = { type: AuthActorType.User, apiKey: userAuth.apiKey, user: userAuth.user };
    next();
  } catch (err) {
    next(err);
  }
}
