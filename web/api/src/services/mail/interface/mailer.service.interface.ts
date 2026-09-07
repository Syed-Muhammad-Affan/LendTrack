import { ILoanPopulated } from '../../../interface/loan.populated.interface.js';

export interface IMailerService {
  sendWelcomeEmail(email: string, name: string): Promise<void>;
  sendResetPasswordEmail(to: string, rawToken: string): Promise<void>;
  sendPreDueReminder(
    to: string,
    itemName: string,
    dueDate: Date,
  ): Promise<void>;
  sendOverdueReminder(
    to: string,
    itemName: string,
    dueDate: Date,
  ): Promise<void>;
  sendWeeklyDigest(to: string, loans: ILoanPopulated[]): Promise<void>;
}
