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
import { IItem } from '../../interface/item.interface.js';
import { IContact } from '../../interface/contact.interface.js';

export class LoanService implements ILoanService {
  private buildItemSummary(item: IItem): ILoanItemSummary {
    return {
      id: item._id.toString(),
      name: item.name,
      ...(item.photo ? { photo: item.photo } : {}),
    };
  }

  private buildContactSummary(contact: IContact): ILoanContactSummary {
    const summary: ILoanContactSummary = {
      id: contact._id.toString(),
      name: contact.name,
    };

    if (contact.email) {
      summary.email = contact.email;
    } else if (contact.phone) {
      summary.phone = contact.phone;
    }

    return summary;
  }

  private toLoanResponse(loan: ILoanPopulated): ILoanResponse {
    const response: ILoanResponse = {
      id: loan._id.toString(),
      contact: this.buildContactSummary(loan.contactId),
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

    if (loan.itemId) {
      response.item = this.buildItemSummary(loan.itemId);
    }

    if (loan.borrowedItemName) {
      response.borrowedItemName = loan.borrowedItemName;
    }

    return response;
  }

  private toUpcomingDueSummary(loan: ILoanPopulated): IUpcomingDueLoan {
    const response: IUpcomingDueLoan = {
      id: loan._id.toString(),
      contact: this.buildContactSummary(loan.contactId),
      expectedReturnAt: loan.expectedReturnAt,
    };

    if (loan.itemId) {
      response.item = this.buildItemSummary(loan.itemId);
    }

    if (loan.borrowedItemName) {
      response.itemDescription = loan.borrowedItemName;
    }

    return response;
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

    if (!data.contactId) {
      throw new errors.BadRequest('Please required contactId');
    }

    const contactOwned = await this.ContactRepository.contactExists(
      data.contactId.toString(),
      userId,
    );
    if (!contactOwned) {
      throw new errors.NotFound('Contact not found');
    }

    if (data.direction === 'lent_out') {
      if (!data.itemId) {
        throw new errors.BadRequest('Please required itemId');
      }

      const itemOwned = await this.ItemRepository.itemExists(
        data.contactId.toString(),
        userId,
      );
      if (!itemOwned) {
        throw new errors.NotFound('item not found');
      }

      const hasActiveLoan = await this.LoanRepository.itemHasActiveLoan(
        data.itemId.toString(),
        userId,
      );
      if (hasActiveLoan) {
        throw new errors.Forbidden(
          'This item is already part of an active loan',
        );
      }
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
