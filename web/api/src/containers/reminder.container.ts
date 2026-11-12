import { LoanRepository } from '../repository/loan.repository.js';
import { ReminderLogRepository } from '../repository/reminderLog.repository.js';
import { UserRepository } from '../repository/user.repository.js';
import { MailerService } from '../services/mail/mailer.service.js';
import { ReminderService } from '../services/Reminder.scheduler/reminder.service.js';

export const createReminderService = () => {
  const userRepository = new UserRepository();

  return new ReminderService(
    new LoanRepository(),
    new ReminderLogRepository(),
    userRepository,
    userRepository,
    new MailerService(),
  );
};
