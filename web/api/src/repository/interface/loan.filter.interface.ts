import { ILoan } from '../../interface/loan.interface.js';

export interface ILoanFilters {
  status?: ILoan['status'];
  direction?: ILoan['direction'];
  contactId?: string;
}
