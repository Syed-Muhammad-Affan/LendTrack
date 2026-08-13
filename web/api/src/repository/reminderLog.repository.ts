import { IReminderLog } from '../interface/reminderLog.interface.js';
import ReminderLog from '../models/ReminderLog.js';
import { IReminderLogRepository } from './interface/reminderLog.repository.interface.js';

export class ReminderLogRepository implements IReminderLogRepository {
  async createReminderLog(body: Partial<IReminderLog>): Promise<IReminderLog> {
    return await ReminderLog.create(body);
  }
}
