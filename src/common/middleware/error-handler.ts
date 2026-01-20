import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../../common/errors/http-error';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err); // Логируем для отладки

  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }

  // Любые другие ошибки — 500
  res.status(500).json({ error: 'Internal Server Error' });
};