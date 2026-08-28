import { Types } from 'mongoose';
import { ILoan } from '../../interface/loan.interface.js';
import { ILoanRepository } from '../../repository/interface/loan.repository.interface.js';
import { ILoanService } from './interface/loan.service.interface.js';
import { isPremium } from '../../utils/plan.js';
import errors from '../../errors/index.js';
import { ILoanFilters } from '../../repository/interface/loan.filter.interface.js';
import {
  ILoanContactSummary,
  ILoanDeleteResponse,
  ILoanItemSummary,
  ILoanResponse,
  ILoanSummaryResponse,
  IUpcomingDueLoan,
} from './interface/loanResponse.interface.js';
import { ILoanPopulated } from '../../interface/loan.populated.interface.js';
import { IItemRepository } from '../../repository/interface/item.repository.interface.js';
import { IContactRepository } from '../../repository/interface/contact.repository.interface.js';

export class LoanService implements ILoanService {
  private toLoanResponse(loan: ILoanPopulated): ILoanResponse {
    const item: ILoanItemSummary = {
      id: loan.itemId._id.toString(),
      name: loan.itemId.name,
      ...(loan.itemId.photo ? { photo: loan.itemId.photo } : {}),
    };

    const contact: ILoanContactSummary = {
      id: loan.contactId._id.toString(),
      name: loan.contactId.name,
    };

    if (loan.contactId.email) {
      contact.email = loan.contactId.email;
    } else if (loan.contactId.phone) {
      contact.phone = loan.contactId.phone;
    }

    const response: ILoanResponse = {
      id: loan._id.toString(),
      item,
      contact,
      direction: loan.direction,
      status: loan.status,
      loanedAt: loan.loanedAt,
      expectedReturnAt: loan.expectedReturnAt,
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt,
    };

    if (loan.returnedAt) {
      response.returnedAt = loan.returnedAt;
    }

    return response;
  }

  private toUpcomingDueSummary(loan: ILoanPopulated): IUpcomingDueLoan {
    const item: ILoanItemSummary = {
      id: loan.itemId._id.toString(),
      name: loan.itemId.name,
      ...(loan.itemId.photo ? { photo: loan.itemId.photo } : {}),
    };

    const contact: ILoanContactSummary = {
      id: loan.contactId._id.toString(),
      name: loan.contactId.name,
    };

    if (loan.contactId.email) {
      contact.email = loan.contactId.email;
    } else if (loan.contactId.phone) {
      contact.phone = loan.contactId.phone;
    }

    return {
      id: loan._id.toString(),
      item,
      contact,
      expectedReturnAt: loan.expectedReturnAt,
    };
  }

  constructor(
    private readonly LoanRepository: ILoanRepository,
    private readonly ItemRepository: IItemRepository,
    private readonly ContactRepository: IContactRepository,
  ) {}

  async createLoan(
    data: Partial<ILoan>,
    userId: string,
  ): Promise<ILoanResponse> {
    data.userId = new Types.ObjectId(userId);

    if (!data.itemId || !data.contactId) {
      throw new errors.BadRequest('Please required itemId and contactId');
    }

    const [item, contact] = await Promise.all([
      this.ItemRepository.itemExists(data.itemId!.toString(), userId),
      this.ContactRepository.contactExists(data.contactId!.toString(), userId),
    ]);

    if (!item) throw new errors.NotFound('Item not Found');
    if (!contact) throw new errors.NotFound('Contact not Found');

    const hasActiveLoan = await this.LoanRepository.itemHasActiveLoan(
      data.itemId.toString(),
      userId,
    );
    if (hasActiveLoan) {
      throw new errors.Forbidden('This item is already part of an active loan');
    }

    if (!(await isPremium(userId))) {
      const activeLoan = await this.LoanRepository.countActiveLoan(userId);

      if (activeLoan >= 5) {
        throw new errors.Forbidden(
          'Free plan limit reached. You can only have up to 5 active loans.',
        );
      }
    }

    const loan = await this.LoanRepository.createLoan(data);

    return this.toLoanResponse(loan);
  }

  async getAllLoan(
    userId: string,
    filter: ILoanFilters,
  ): Promise<ILoanResponse[]> {
    const loans = await this.LoanRepository.getAllLoan(userId, filter);

    return loans.map((loan) => this.toLoanResponse(loan));
  }

  async getSingleLoan(loanId: string, userId: string): Promise<ILoanResponse> {
    const loan = await this.LoanRepository.getSingleLoan(loanId, userId);

    if (!loan) {
      throw new errors.NotFound('Loan not found');
    }

    return this.toLoanResponse(loan);
  }

  async updateLoan(
    loanId: string,
    userId: string,
    body: Partial<ILoan>,
  ): Promise<ILoanResponse> {
    const loan = await this.LoanRepository.updateLoan(loanId, userId, body);
    if (!loan) {
      throw new errors.NotFound('Loan not found');
    }

    return this.toLoanResponse(loan);
  }

  async deleteLoan(
    loanId: string,
    userId: string,
  ): Promise<ILoanDeleteResponse> {
    const loan = await this.LoanRepository.deleteLoan(loanId, userId);
    if (!loan) {
      throw new errors.NotFound('Loan not found');
    }

    const response: ILoanDeleteResponse = {
      id: loan._id.toString(),
    };

    return response;
  }

  async markAsReturn(loanId: string, userId: string): Promise<ILoanResponse> {
    const updateData: Partial<ILoan> = {
      status: 'returned',
      returnedAt: new Date(),
    };

    const loan = await this.LoanRepository.updateLoan(
      loanId,
      userId,
      updateData,
    );
    if (!loan) {
      throw new errors.NotFound('Loan not found');
    }

    return this.toLoanResponse(loan);
  }

  async markAsLost(loanId: string, userId: string): Promise<ILoanResponse> {
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

    return this.toLoanResponse(loan);
  }

  async getLoanSummary(userId: string): Promise<ILoanSummaryResponse | null> {
    const summary = await this.LoanRepository.getLoanSummary(userId);
    if (!summary) return null;

    return {
      total: summary.total,
      active: summary.active,
      returned: summary.returned,
      overdue: summary.overdue,
      lost: summary.lost,
      lentOut: summary.lentOut,
      borrowed: summary.borrowed,
      upcomingDueCount: summary.upcomingDueCount,
      upcomingDueItems: summary.upcomingDueItems.map((loan) =>
        this.toUpcomingDueSummary(loan),
      ),
    };
  }
}
