import { Request, Response, NextFunction } from 'express';

import { StatusError } from '../utils/error';

export const errorHandler = (
  err: StatusError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err?.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
};
