import { Types } from 'mongoose';
import { IReminderLog } from '../../interface/reminderLog.interface.js';
import { IReminderLogService } from './interface/reminderLog.service.interface.js';
import { IReminderLogResponse } from './interface/reminderLogResponse.interface.js';
import { IReminderLogRepository } from '../../repository/interface/reminderLog.repository.interface.js';
import { IReminderLogFilter } from '../../repository/interface/reminderLogFilter.interface.js';
import errors from '../../errors/index.js';

export class ReminderLogService implements IReminderLogService {
  private toLogResponse(log: IReminderLog): IReminderLogResponse {
    const response: IReminderLogResponse = {
      id: log._id.toString(),
      type: log.type,
      status: log.status,
      channel: log.channel,
      recipientEmail: log.recipientEmail,
      sentAt: log.sentAt,
      createdAt: log.createdAt,
    };

    if (log.loanId) {
      response.loanId = log.loanId.toString();
    }

    if (log.errorMessage) {
      response.errorMessage = log.errorMessage;
    }

    return response;
  }

  constructor(private readonly ReminderLogRepository: IReminderLogRepository) {}

  async createReminderLog(
    data: Partial<IReminderLog>,
  ): Promise<IReminderLogResponse> {
    const log = await this.ReminderLogRepository.createReminderLog(data);

    return this.toLogResponse(log);
  }

  async getAllReminderLog(
    filter: IReminderLogFilter,
  ): Promise<IReminderLogResponse[]> {
    const logs = await this.ReminderLogRepository.getAllReminderLog(filter);

    return logs.map((log) => this.toLogResponse(log));
  }

  async getSingleReminderLog(
    logId: string,
    userId: string,
  ): Promise<IReminderLogResponse> {
    const log = await this.ReminderLogRepository.getSingleReminderLog(
      logId,
      userId,
    );

    if (!log) {
      throw new errors.NotFound('Reminder log not found');
    }

    return this.toLogResponse(log);
  }
}
