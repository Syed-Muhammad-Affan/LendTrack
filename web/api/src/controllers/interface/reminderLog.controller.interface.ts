import { Request, Response } from 'express';

export interface IReminderLogController {
  getAllReminderLogs(req: Request, res: Response): Promise<Response>;
  getSingleReminderLog(req: Request, res: Response): Promise<Response>;
}
