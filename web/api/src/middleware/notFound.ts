import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class NotFound {
  handle = (req: Request, res: Response): void => {
    res.status(StatusCodes.NOT_FOUND).send('Route not found');
  };
}
