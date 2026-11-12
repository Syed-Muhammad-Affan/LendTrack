import { ILoanPopulated } from '../../interface/loan.populated.interface.js';

// Read/maintenance queries used only by the reminder jobs.
export interface ILoanReminderRepository {
  getActiveLoansDueBetween(from: Date, to: Date): Promise<ILoanPopulated[]>;
  getUnreturnedLoansPastDue(now: Date): Promise<ILoanPopulated[]>;
  getOutstandingLoansForUser(userId: string): Promise<ILoanPopulated[]>;
  markOverdueLoans(now: Date): Promise<number>;
}
