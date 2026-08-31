import { IReminderLog } from '../../../interface/reminderLog.interface.js';
import { IReminderLogFilter } from '../../../repository/interface/reminderLogFilter.interface.js';
import { IReminderLogResponse } from './reminderLogResponse.interface.js';

export interface IReminderLogService {
  createReminderLog(data: Partial<IReminderLog>): Promise<IReminderLogResponse>;
  getAllReminderLog(
    filter: IReminderLogFilter,
  ): Promise<IReminderLogResponse[]>;
  getSingleReminderLog(
    logId: string,
    userId: string,
  ): Promise<IReminderLogResponse>;
}
