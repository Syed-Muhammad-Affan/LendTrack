import { ILoan } from '../../../interface/loan.interface.js';
import { ILoanSummary } from '../../../repository/interface/loan.summary.interface.js';
import { ILoanFilters } from '../../../repository/interface/loan.filter.interface.js';
import {
  ILoanDeleteResponse,
  ILoanResponse,
  ILoanSummaryResponse,
} from './loanResponse.interface.js';

export interface ILoanService {
  createLoan(data: Partial<ILoan>, userId: string): Promise<ILoanResponse>;
  getAllLoan(userId: string, filter: ILoanFilters): Promise<ILoanResponse[]>;
  getSingleLoan(loanId: string, userId: string): Promise<ILoanResponse>;
  updateLoan(
    loanId: string,
    userId: string,
    body: Partial<ILoan>,
  ): Promise<ILoanResponse>;
  deleteLoan(loanId: string, userId: string): Promise<ILoanDeleteResponse>;
  markAsReturn(loanId: string, userId: string): Promise<ILoanResponse>;
  markAsLost(loanId: string, userId: string): Promise<ILoanResponse>;
  getLoanSummary(userId: string): Promise<ILoanSummaryResponse | null>;
}
