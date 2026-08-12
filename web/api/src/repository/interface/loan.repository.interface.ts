import { ILoan } from '../../interface/loan.interface.js';
import { ILoanSummary } from './loan.summary.interface.js';
import { ILoanFilters } from './loan.filter.interface.js';

export interface ILoanRepository {
  createLoan(body: Partial<ILoan>): Promise<ILoan>;
  getAllLoan(userId: string, filter: ILoanFilters): Promise<ILoan[] | null>;
  getSingleLoan(loanId: string, userId: string): Promise<ILoan | null>;
  updateLoan(
    loanId: string,
    userId: string,
    body: Partial<ILoan>,
  ): Promise<ILoan | null>;
  deleteLoan(loanId: string, userId: string): Promise<ILoan | null>;
  getLoanSummary(userId: string): Promise<ILoanSummary | null>;
}
