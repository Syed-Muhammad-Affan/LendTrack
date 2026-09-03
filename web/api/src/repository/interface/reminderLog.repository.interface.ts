import { IReminderLog } from '../../interface/reminderLog.interface.js';
import { IReminderLogFilter } from './reminderLogFilter.interface.js';

export interface IReminderLogRepository {
  createReminderLog(body: Partial<IReminderLog>): Promise<IReminderLog>;
  getAllReminderLog(
    userId: string,
    filter: Omit<IReminderLogFilter, 'userId'>,
  ): Promise<IReminderLog[]>;
  getSingleReminderLog(
    logId: string,
    userId: string,
  ): Promise<IReminderLog | null>;
  hasReminderBeenSendToday(
    loanId: string,
    type: 'pre_due' | 'overdue' | 'weekly_digest',
  ): Promise<Boolean>;
}
