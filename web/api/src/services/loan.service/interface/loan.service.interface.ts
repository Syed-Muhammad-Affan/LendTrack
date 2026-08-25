import { ILoan } from '../../../interface/loan.interface.js';
import { ILoanSummary } from '../../../repository/interface/loan.summary.interface.js';
import { ILoanFilters } from '../../../repository/interface/loan.filter.interface.js';

export interface ILoanService {
  createLoan(data: Partial<ILoan>, userId: string): Promise<ILoan>;
  getAllLoan(userId: string, filter: ILoanFilters): Promise<ILoan[] | null>;
  getSingleLoan(loanId: string, userId: string): Promise<ILoan>;
  updateLoan(
    loanId: string,
    userId: string,
    body: Partial<ILoan>,
  ): Promise<ILoan>;
  deleteLoan(loanId: string, userId: string): Promise<ILoan>;
  markAsReturn(loanId: string, userId: string): Promise<ILoan>;
  markAsLost(loanId: string, userId: string): Promise<ILoan>;
  getLoanSummary(userId: string): Promise<ILoanSummary | null>;
}
