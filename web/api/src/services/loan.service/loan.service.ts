import { Types } from 'mongoose';
import { ILoan } from '../../interface/loan.interface.js';
import { ILoanRepository } from '../../repository/interface/loan.repository.interface.js';
import { ILoanService } from './interface/loan.service.interface.js';
import { isPremium } from '../../utils/plan.js';
import errors from '../../errors/index.js';
import { ILoanFilters } from '../../repository/interface/loan.filter.interface.js';
import { ILoanSummary } from '../../repository/interface/loan.summary.interface.js';

export class LoanService implements ILoanService {
  constructor(private readonly LoanRepository: ILoanRepository) {}

  async createLoan(data: Partial<ILoan>, userId: string): Promise<ILoan> {
    data.userId = new Types.ObjectId(userId);
    data.loanedAt = data.loanedAt || new Date();

    if (!(await isPremium(userId))) {
      const activeLoan = await this.LoanRepository.countActiveLoan(userId);

      if (activeLoan >= 5) {
        throw new errors.Forbidden(
          'Free plan limit reached. You can only have up to 5 active loans.',
        );
      }
    }

    const loan = await this.LoanRepository.createLoan(data);

    return loan;
  }

  async getAllLoan(
    userId: string,
    filter: ILoanFilters,
  ): Promise<ILoan[] | null> {
    const loans = await this.LoanRepository.getAllLoan(userId, filter);

    return loans;
  }

  async getSingleLoan(loanId: string, userId: string): Promise<ILoan> {
    const loan = await this.LoanRepository.getSingleLoan(loanId, userId);

    if (!loan) {
      throw new errors.NotFound('Loan not found');
    }

    return loan;
  }

  async updateLoan(
    loanId: string,
    userId: string,
    body: Partial<ILoan>,
  ): Promise<ILoan> {
    const loan = await this.LoanRepository.updateLoan(loanId, userId, body);
    if (!loan) {
      throw new errors.NotFound('Loan not found');
    }

    return loan;
  }

  async deleteLoan(loanId: string, userId: string): Promise<ILoan> {
    const loan = await this.LoanRepository.deleteLoan(loanId, userId);
    if (!loan) {
      throw new errors.NotFound('Loan not found');
    }

    return loan;
  }

  async markAsReturn(loanId: string, userId: string): Promise<ILoan> {
    const updateData: Partial<ILoan> = {
      status: 'returned',
      returnAt: new Date(),
    };

    const loan = await this.LoanRepository.updateLoan(
      loanId,
      userId,
      updateData,
    );
    if (!loan) {
      throw new errors.NotFound('Loan not found');
    }

    return loan;
  }

  async markAsLost(loanId: string, userId: string): Promise<ILoan> {
    const updateData: Partial<ILoan> = {
      status: 'lost',
    };

    const loan = await this.LoanRepository.updateLoan(
      loanId,
      userId,
      updateData,
    );
    if (!loan) {
      throw new errors.NotFound('Loan not found');
    }

    return loan;
  }

  async getLoanSummary(userId: string): Promise<ILoanSummary | null> {
    return await this.LoanRepository.getLoanSummary(userId);
  }
}
