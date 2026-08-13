import { IReminderLog } from '../../interface/reminderLog.interface.js';

export interface IReminderLogRepository {
  createReminderLog(body: Partial<IReminderLog>): Promise<IReminderLog>;
}
