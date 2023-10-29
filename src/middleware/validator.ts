import { NextFunction, Request, Response } from 'express';
import dayjs from 'dayjs';
import ValidationException from '../exceptions/ValidationException';

export default function validate(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  const id = req.params.id;
  const timestamp = req.query.timestamp as string;

  if (!id) {
    throw new ValidationException('id', '', 'id is required');
  }

  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    throw new ValidationException('id', id, 'id should be numeric');
  }

  if (idNumber < 0) {
    throw new ValidationException('id', '', 'id must be positive');
  }

  if (!timestamp) {
    throw new ValidationException('timestamp', '', 'timestamp is required');
  }

  const parsedTimestamp = dayjs(timestamp, 'YYYY-MM-DD HH:mm:ss Z');
  if (!parsedTimestamp.isValid()) {
    throw new ValidationException(
      'timestamp',
      timestamp,
      'timestamp must be date formatted as YYYY-MM-DD HH:mm:ss ZZ',
    );
  }

  next();
}
