import { ReminderLogController } from '../controllers/reminderLog.controller.js';
import { ReminderLogRepository } from '../repository/reminderLog.repository.js';
import { ReminderLogRoute } from '../routes/reminderLog.route.js';
import { ReminderLogService } from '../services/ReminderLog.service/reminderLog.service.js';

export const createReminderLogModule = () => {
  const reminderLogRepository = new ReminderLogRepository();
  const reminderLogService = new ReminderLogService(reminderLogRepository);
  const reminderLogController = new ReminderLogController(reminderLogService);

  return new ReminderLogRoute(reminderLogController);
};
