import { IReminderLog } from '../../../interface/reminderLog.interface.js';
import { IReminderLogFilter } from '../../../repository/interface/reminderLogFilter.interface.js';
import { IReminderLogResponse } from './reminderLogResponse.interface.js';

export interface IReminderLogService {
  getAllReminderLog(
    userId: string,
    filter: Omit<IReminderLogFilter, 'userId'>,
  ): Promise<IReminderLogResponse[]>;
  getSingleReminderLog(
    logId: string,
    userId: string,
  ): Promise<IReminderLogResponse>;
}
