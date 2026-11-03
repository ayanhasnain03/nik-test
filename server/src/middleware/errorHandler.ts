import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError, ValidationError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { env } from '../config/index.js';

function zodToDetails(error: ZodError): Record<string, string> {
  const details: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || 'body';
    if (!details[key]) details[key] = issue.message;
  }
  return details;
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'));
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  let appError: AppError;

  if (err instanceof AppError) {
    appError = err;
  } else if (err instanceof ZodError) {
    appError = new ValidationError('Validation failed', zodToDetails(err));
  } else if (err instanceof Error) {
    appError = new AppError(err.message || 'Internal server error', 500, 'INTERNAL_ERROR');
  } else {
    appError = new AppError('Internal server error', 500, 'INTERNAL_ERROR');
  }

  const logPayload = {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode: appError.statusCode,
    code: appError.code,
    details: appError.details,
    stack: env.NODE_ENV === 'development' ? (err instanceof Error ? err.stack : undefined) : undefined,
  };

  if (appError.statusCode >= 500) {
    logger.error({ ...logPayload, err }, 'request.error');
  } else {
    logger.warn(logPayload, 'request.client_error');
  }

  if (appError.statusCode === 422 && appError.details) {
    res.status(422).json({
      msg: appError.message,
      message: appError.message,
      error: appError.details,
      code: appError.code,
    });
    return;
  }

  res.status(appError.statusCode).json({
    msg: appError.message,
    message: appError.message,
    code: appError.code,
    ...(appError.details ? { error: appError.details } : {}),
    ...(env.NODE_ENV === 'development' && err instanceof Error ? { stack: err.stack } : {}),
  });
}
