import { ILoan } from '../../interface/loan.interface.js';

export interface ILoanSummary {
  total: number;
  active: number;
  returned: number;
  overdue: number;
  lost: number;
  lentOut: number;
  borrowed: number;
  upcomingDueCount: number;
  upcomingDueItems: ILoan[];
}
