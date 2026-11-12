import { ILoan } from '../../interface/loan.interface.js';
import { ILoanSummary } from './loan.summary.interface.js';
import { ILoanFilters } from './loan.filter.interface.js';
import { ILoanPopulated } from '../../interface/loan.populated.interface.js';

export interface ILoanRepository {
  createLoan(body: Partial<ILoan>): Promise<ILoanPopulated>;
  countActiveLoan(userId: string): Promise<number>;
  getAllLoan(userId: string, filter: ILoanFilters): Promise<ILoanPopulated[]>;
  getSingleLoan(loanId: string, userId: string): Promise<ILoanPopulated | null>;
  updateLoan(
    loanId: string,
    userId: string,
    body: Partial<ILoan>,
  ): Promise<ILoanPopulated | null>;
  deleteLoan(loanId: string, userId: string): Promise<ILoan | null>;
  getLoanSummary(userId: string): Promise<ILoanSummary | null>;
  itemHasActiveLoan(itemId: string, userId: string): Promise<Boolean>;
}
