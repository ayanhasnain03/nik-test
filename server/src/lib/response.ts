import type { Response } from 'express';

export function sendJson(res: Response, status: number, body: unknown = null): void {
  if (body === null || body === undefined) {
    res.status(status).type('application/json').send(status < 300 ? '{}' : '{"message":"ok"}');
    return;
  }
  res.status(status).json(body);
}

export function ok(res: Response, body?: unknown): void {
  sendJson(res, 200, body ?? {});
}

export function created(res: Response, body: unknown): void {
  sendJson(res, 201, body);
}

export function noContent(res: Response): void {
  res.status(204).send();
}
