import { IReminderLog } from '../interface/reminderLog.interface.js';
import ReminderLog from '../models/ReminderLog.js';
import { IReminderLogRepository } from './interface/reminderLog.repository.interface.js';
import { IReminderLogFilter } from './interface/reminderLogFilter.interface.js';

export class ReminderLogRepository implements IReminderLogRepository {
  async createReminderLog(body: Partial<IReminderLog>): Promise<IReminderLog> {
    return await ReminderLog.create(body);
  }

  async getAllReminderLog(
    userId: string,
    filter: Omit<IReminderLogFilter, 'userId'>,
  ): Promise<IReminderLog[]> {
    const query: Record<string, unknown> = { userId: userId };

    if (filter.type) {
      query.type = filter.type;
    }

    if (filter.loanId) {
      query.loanId = filter.loanId;
    }

    if (filter.status) {
      query.status = filter.status;
    }

    return await ReminderLog.find(query).sort('-createdAt');
  }

  async getSingleReminderLog(
    logId: string,
    userId: string,
  ): Promise<IReminderLog | null> {
    return await ReminderLog.findOne({ _id: logId, userId });
  }

  async hasReminderBeenSendToday(
    loanId: string,
    type: 'pre_due' | 'overdue' | 'weekly_digest',
  ): Promise<Boolean> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const result = await ReminderLog.exists({
      loanId,
      type,
      status: 'sent',
      sentAt: { $gte: startOfDay },
    });

    return result !== null;
  }

  async hasReminderBeenSentThisWeek(
    userId: string,
    type: 'weekly_digest',
  ): Promise<boolean> {
    const startOfWeek = new Date();
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday as week start
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const result = await ReminderLog.exists({
      userId,
      type,
      status: 'sent',
      sentAt: { $gte: startOfWeek },
    });

    return result !== null;
  }
}
