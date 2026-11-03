import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { logger } from '../lib/logger.js';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const requestId = (req.headers['x-request-id'] as string) || randomUUID();
  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);

  const started = Date.now();
  const child = logger.child({ requestId, method: req.method, path: req.originalUrl });

  child.info({ ip: req.ip, userAgent: req.headers['user-agent'] }, 'request.start');

  res.on('finish', () => {
    child.info(
      {
        statusCode: res.statusCode,
        durationMs: Date.now() - started,
        contentLength: res.getHeader('content-length'),
      },
      'request.finish',
    );
  });

  next();
}
