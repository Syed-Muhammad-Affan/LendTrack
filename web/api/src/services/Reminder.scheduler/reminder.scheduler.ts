import { ILoanPopulated } from '../../interface/loan.populated.interface.js';
import { LoanRepository } from '../../repository/loan.repository.js';
import { ReminderLogRepository } from '../../repository/reminderLog.repository.js';
import { UserRepository } from '../../repository/user.repository.js';
import { MailerService } from '../mail/mailer.service.js';
import cron from 'node-cron';

const loanRepository = new LoanRepository();
const reminderLogRepository = new ReminderLogRepository();
const mailerService = new MailerService();
const userRepository = new UserRepository();

async function runReminderCheck(): Promise<void> {
  const now = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(now.getDate() + 3);

  const dueSoonLoans = await loanRepository.getLoansMatching({
    status: 'active',
    expectedReturnAt: { $gte: now, $lte: threeDaysFromNow },
  });

  for (const loan of dueSoonLoans) {
    await processReminderLoan(loan, 'pre_due');
  }

  const overdueLoan = await loanRepository.getLoansMatching({
    status: 'active',
    expectedReturnAt: { $lt: now },
  });

  for (const loan of overdueLoan) {
    await processReminderLoan(loan, 'overdue');
  }
}

async function processReminderLoan(
  loan: ILoanPopulated,
  type: 'pre_due' | 'overdue',
): Promise<void> {
  const alreadySent = await reminderLogRepository.hasReminderBeenSendToday(
    loan._id.toString(),
    type,
  );
  if (alreadySent) return;

  const itemLabel = loan.itemId?.name ?? loan.itemDescription ?? 'an item';

  let recipientEmail: string | undefined;

  if (loan.direction === 'lent_out') {
    // I lent my item to them — they need the reminder
    recipientEmail = loan.contactId.email;
  } else {
    // I borrowed their item — I need the reminder, not them
    const owner = await userRepository.getSingleUserById(
      loan.userId.toString(),
    );
    recipientEmail = owner?.email;
  }
  if (!recipientEmail) return;

  try {
    if (type === 'pre_due') {
      await mailerService.sendPreDueReminder(
        recipientEmail,
        itemLabel,
        loan.expectedReturnAt,
      );
    } else {
      await mailerService.sendOverdueReminder(
        recipientEmail,
        itemLabel,
        loan.expectedReturnAt,
      );
    }

    await reminderLogRepository.createReminderLog({
      userId: loan.userId,
      loanId: loan._id,
      type,
      status: 'sent',
      recipientEmail,
      sentAt: new Date(),
    });
  } catch (err: any) {
    await reminderLogRepository.createReminderLog({
      userId: loan.userId,
      loanId: loan._id,
      type,
      status: 'failed',
      recipientEmail,
      errorMessage: err.message,
      sentAt: new Date(),
    });
  }
}

export function startReminderScheduler(): void {
  cron.schedule(
    '12 14 * * *',
    () => {
      runReminderCheck().catch((err) =>
        console.error('Reminder scheduler failed:', err),
      );
    },
    {
      timezone: 'Asia/Karachi',
    },
  );
}
