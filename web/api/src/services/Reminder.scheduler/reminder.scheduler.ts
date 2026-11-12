import cron from 'node-cron';
import { ReminderService } from './reminder.service.js';

const TIMEZONE = 'Asia/Karachi';

// Scheduling only: when to run. What to do lives in ReminderService.
const jobs = (service: ReminderService) => [
  {
    name: 'overdue-status',
    expression: '0 0 * * *',
    run: () => service.runOverdueStatusCheck(),
  },
  {
    name: 'daily-reminders',
    expression: '7 10 * * *',
    run: () => service.runReminderCheck(),
  },
  {
    name: 'weekly-digest',
    expression: '0 8 * * 1',
    run: () => service.runWeeklyDigest(),
  },
];

export function startReminderScheduler(service: ReminderService): void {
  for (const job of jobs(service)) {
    cron.schedule(
      job.expression,
      () => {
        job.run().catch((err) =>
          console.error(`[reminder-scheduler] ${job.name} failed:`, err),
        );
      },
      { timezone: TIMEZONE },
    );
  }
}
