import { NextFunction, Request, Response } from 'express';
import Exception from './Exception';

export default function handler(
  error: Error | Exception,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  const isException = 'toJSON' in error;

  if (isException) {
    const err = error as Exception;
    const json = err.toJSON();

    return res.status(json.status).send(json);
  }

  const status = 500;
  const message = error.message || 'Internal Server Error';

  res.status(status).send({
    error: message,
  });
}
