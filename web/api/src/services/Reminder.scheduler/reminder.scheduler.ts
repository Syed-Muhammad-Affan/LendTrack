import { ILoanPopulated } from '../../interface/loan.populated.interface.js';
import { IUser } from '../../interface/user.interface.js';
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

  const itemLabel = loan.itemId?.name ?? loan.borrowedItemName ?? 'an item';

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

async function runWeeklyDigest(): Promise<void> {
  console.log('[weekly-digest] Running at', new Date().toISOString());
  const eligibleUsers = await userRepository.getPremiumUsersWithDigestEnabled();
  console.log('[weekly-digest] Eligible users found:', eligibleUsers.length);

  for (const user of eligibleUsers) {
    await sendDigestForUser(user);
  }
}

async function sendDigestForUser(user: IUser): Promise<void> {
  console.log(
    '[weekly-digest] Processing user',
    user._id.toString(),
    user.email,
  );

  const alreadySentThisWeek =
    await reminderLogRepository.hasReminderBeenSentThisWeek(
      user._id.toString(),
      'weekly_digest',
    );
  if (alreadySentThisWeek) {
    console.log('[weekly-digest] Already sent this week, skipping');
    return;
  }

  const activeLoans = await loanRepository.getLoansMatching({
    userId: user._id,
    status: { $in: ['active', 'overdue'] },
  });
  console.log('[weekly-digest] Active loans found:', activeLoans.length);

  if (activeLoans.length === 0) {
    console.log('[weekly-digest] No active loans, skipping digest');
    return;
  }

  try {
    await mailerService.sendWeeklyDigest(user.email, activeLoans);

    await reminderLogRepository.createReminderLog({
      userId: user._id,
      type: 'weekly_digest',
      status: 'sent',
      recipientEmail: user.email,
      sentAt: new Date(),
    });
  } catch (err: any) {
    await reminderLogRepository.createReminderLog({
      userId: user._id,
      type: 'weekly_digest',
      status: 'failed',
      recipientEmail: user.email,
      errorMessage: err.message,
      sentAt: new Date(),
    });
  }
}

async function runOverdueStatusCheck(): Promise<void> {
  const now = new Date();
  const updatedCount = await loanRepository.markOverdueLoans(now);
  console.log(`[reminder-scheduler] Marked ${updatedCount} loan(s) as overdue`);
}

function registerOverdueStatusCheck(): void {
  cron.schedule(
    '0 0 * * *',
    // '*/2 * * * *',
    () => {
      runOverdueStatusCheck().catch((err) =>
        console.error('[reminder-scheduler] Overdue status check failed:', err),
      );
    },
    { timezone: 'Asia/Karachi' },
  );
}

function registerDailyCheck(): void {
  cron.schedule(
    '7 10 * * *',
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

function registerWeeklyDigest(): void {
  cron.schedule(
    '0 8 * * 1',
    // '*/2 * * * *',
    () => {
      runWeeklyDigest().catch((err) =>
        console.error('[reminder-scheduler] Weekly digest failed:', err),
      );
    },
    { timezone: 'Asia/Karachi' },
  );
}

export function startReminderScheduler(): void {
  registerDailyCheck();
  registerWeeklyDigest();
  registerOverdueStatusCheck();
}
