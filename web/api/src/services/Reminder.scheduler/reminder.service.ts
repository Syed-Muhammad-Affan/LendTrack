import { ILoanPopulated } from '../../interface/loan.populated.interface.js';
import { IUser } from '../../interface/user.interface.js';
import { IDigestUserRepository } from '../../repository/interface/digest.user.repository.interface.js';
import { ILoanReminderRepository } from '../../repository/interface/loan.reminder.repository.interface.js';
import { IReminderLogRepository } from '../../repository/interface/reminderLog.repository.interface.js';
import { IUserRepository } from '../../repository/interface/user.repository.interface.js';
import { IMailerService } from '../mail/interface/mailer.service.interface.js';

type LoanReminderType = 'pre_due' | 'overdue';

const PRE_DUE_WINDOW_DAYS = 3;

export class ReminderService {
  constructor(
    private readonly LoanRepository: ILoanReminderRepository,
    private readonly ReminderLogRepository: IReminderLogRepository,
    private readonly UserRepository: IUserRepository,
    private readonly DigestUserRepository: IDigestUserRepository,
    private readonly Mailer: IMailerService,
  ) {}

  async runReminderCheck(): Promise<void> {
    const now = new Date();
    const windowEnd = new Date(now);
    windowEnd.setDate(now.getDate() + PRE_DUE_WINDOW_DAYS);

    const dueSoon = await this.LoanRepository.getActiveLoansDueBetween(
      now,
      windowEnd,
    );
    for (const loan of dueSoon) {
      await this.processLoanReminder(loan, 'pre_due');
    }

    const overdue = await this.LoanRepository.getUnreturnedLoansPastDue(now);
    for (const loan of overdue) {
      await this.processLoanReminder(loan, 'overdue');
    }
  }

  async runOverdueStatusCheck(): Promise<void> {
    const count = await this.LoanRepository.markOverdueLoans(new Date());
    console.log(`[reminder-scheduler] Marked ${count} loan(s) as overdue`);
  }

  async runWeeklyDigest(): Promise<void> {
    const users = await this.DigestUserRepository.getPremiumUsersWithDigestEnabled();
    for (const user of users) {
      await this.sendDigestForUser(user);
    }
  }

  private async resolveRecipient(
    loan: ILoanPopulated,
  ): Promise<string | undefined> {
    if (loan.direction === 'lent_out') {
      return loan.contactId.email;
    }
    const owner = await this.UserRepository.getSingleUserById(
      loan.userId.toString(),
    );
    return owner?.email;
  }

  private sendLoanReminder(
    type: LoanReminderType,
    to: string,
    label: string,
    dueDate: Date,
  ): Promise<void> {
    return type === 'pre_due'
      ? this.Mailer.sendPreDueReminder(to, label, dueDate)
      : this.Mailer.sendOverdueReminder(to, label, dueDate);
  }

  private async processLoanReminder(
    loan: ILoanPopulated,
    type: LoanReminderType,
  ): Promise<void> {
    const alreadySent = await this.ReminderLogRepository.hasReminderBeenSendToday(
      loan._id.toString(),
      type,
    );
    if (alreadySent) return;

    const recipientEmail = await this.resolveRecipient(loan);
    if (!recipientEmail) return;

    const label = loan.itemId?.name ?? loan.borrowedItemName ?? 'an item';

    try {
      await this.sendLoanReminder(
        type,
        recipientEmail,
        label,
        loan.expectedReturnAt,
      );
      await this.ReminderLogRepository.createReminderLog({
        userId: loan.userId,
        loanId: loan._id,
        type,
        status: 'sent',
        recipientEmail,
        sentAt: new Date(),
      });
    } catch (err: any) {
      await this.ReminderLogRepository.createReminderLog({
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

  private async sendDigestForUser(user: IUser): Promise<void> {
    const alreadySent =
      await this.ReminderLogRepository.hasReminderBeenSentThisWeek(
        user._id.toString(),
        'weekly_digest',
      );
    if (alreadySent) return;

    const loans = await this.LoanRepository.getOutstandingLoansForUser(
      user._id.toString(),
    );
    if (loans.length === 0) return;

    try {
      await this.Mailer.sendWeeklyDigest(user.email, loans);
      await this.ReminderLogRepository.createReminderLog({
        userId: user._id,
        type: 'weekly_digest',
        status: 'sent',
        recipientEmail: user.email,
        sentAt: new Date(),
      });
    } catch (err: any) {
      await this.ReminderLogRepository.createReminderLog({
        userId: user._id,
        type: 'weekly_digest',
        status: 'failed',
        recipientEmail: user.email,
        errorMessage: err.message,
        sentAt: new Date(),
      });
    }
  }
}
