import { Request, Response } from 'express';
import { IReminderLogService } from '../services/ReminderLog.service/interface/reminderLog.service.interface.js';
import { IReminderLogController } from './interface/reminderLog.controller.interface.js';
import errors from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import { IReminderLogFilter } from '../repository/interface/reminderLogFilter.interface.js';

export class ReminderLogController implements IReminderLogController {
  constructor(private readonly ReminderLogService: IReminderLogService) {}

  async getAllReminderLogs(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;

    if (!userId) {
      throw new errors.Unauthenticated('Authentication required');
    }

    const filter: Omit<IReminderLogFilter, 'userId'> = {};

    if (req.query.type) {
      filter.type = req.query.type as 'pre_due' | 'overdue' | 'weekly_digest';
    }

    if (req.query.status) {
      filter.status = req.query.status as 'sent' | 'failed';
    }

    if (req.query.loanId) {
      filter.loanId = req.query.loanId as string;
    }
    const logs = await this.ReminderLogService.getAllReminderLog(
      userId,
      filter,
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: ' All reminder log obtained',
      data: logs,
    });
  }

  async getSingleReminderLog(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;

    if (!userId) {
      throw new errors.Unauthenticated('Authentication required');
    }

    const logId = req.params.id;

    if (typeof logId !== 'string') {
      throw new errors.BadRequest('Reminder Log ID is required');
    }

    const log = await this.ReminderLogService.getSingleReminderLog(
      logId,
      userId,
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Reminder log obtained',
      data: log,
    });
  }
}
