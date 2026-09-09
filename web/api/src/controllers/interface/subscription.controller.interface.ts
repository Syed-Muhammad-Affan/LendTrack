import { Request, Response } from 'express';

export interface ISubscriptionController {
  createCheckoutSession(req: Request, res: Response): Promise<Response>;
  getStatus(req: Request, res: Response): Promise<Response>;
  cancel(req: Request, res: Response): Promise<Response>;
}
