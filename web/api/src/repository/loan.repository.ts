import mongoose, { Types } from 'mongoose';
import { ILoan } from '../interface/loan.interface.js';
import Loan from '../models/Loan.js';
import { ILoanFilters } from './interface/loan.filter.interface.js';
import { ILoanRepository } from './interface/loan.repository.interface.js';
import { ILoanSummary } from './interface/loan.summary.interface.js';
import { ILoanPopulated } from '../interface/loan.populated.interface.js';

export class LoanRepository implements ILoanRepository {
  async createLoan(body: Partial<ILoan>): Promise<ILoanPopulated> {
    const loan = await Loan.create(body);
    return loan.populate(['itemId', 'contactId']) as unknown as ILoanPopulated;
  }

  async countActiveLoan(userId: string): Promise<number> {
    return await Loan.countDocuments({
      userId: new Types.ObjectId(userId),
      status: { $in: ['active', 'overdue'] },
    });
  }

  async getAllLoan(
    userId: string,
    filter: ILoanFilters,
  ): Promise<ILoanPopulated[]> {
    const query: Record<string, unknown> = {
      userId: new Types.ObjectId(userId),
    };

    if (filter.status) {
      query.status = filter.status;
    }

    if (filter.contactId) {
      query.contactId = filter.contactId;
    }

    if (filter.direction) {
      query.direction = filter.direction;
    }

    return (await Loan.find(query)
      .populate('contactId')
      .populate('itemId')) as unknown as ILoanPopulated[];
  }

  async getSingleLoan(
    loanId: string,
    userId: string,
  ): Promise<ILoanPopulated | null> {
    return (await Loan.findOne({
      _id: new Types.ObjectId(loanId),
      userId: new Types.ObjectId(userId),
    })
      .populate('contactId')
      .populate('itemId')) as unknown as ILoanPopulated;
  }

  async deleteLoan(loanId: string, userId: string): Promise<ILoan | null> {
    return await Loan.findOneAndDelete({
      _id: new Types.ObjectId(loanId),
      userId: new Types.ObjectId(userId),
    });
  }

  async updateLoan(
    loanId: string,
    userId: string,
    body: Partial<ILoan>,
  ): Promise<ILoanPopulated | null> {
    return (await Loan.findOneAndUpdate(
      { _id: new Types.ObjectId(loanId), userId: new Types.ObjectId(userId) },
      body,
      {
        runValidators: true,
        returnDocument: 'after',
      },
    )
      .populate('contactId')
      .populate('itemId')) as unknown as ILoanPopulated;
  }

  //   async getLoanSummary(userId: string): Promise<ILoanSummary | null> {
  //     const userObjId = new Types.ObjectId(userId);
  //     const now = new Date();
  //     const nextSevenDays = new Date();
  //     nextSevenDays.setDate(now.getDate() + 7);

  //     const [summary] = await Loan.aggregate<ILoanSummary>([
  //       {
  //         $match: {
  //           userId: userObjId,
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: null,

  //           total: { $sum: 1 },

  //           active: {
  //             $sum: {
  //               $cond: [{ $eq: ['$status', 'active'] }, 1, 0],
  //             },
  //           },

  //           returned: {
  //             $sum: {
  //               $cond: [{ $eq: ['$status', 'returned'] }, 1, 0],
  //             },
  //           },

  //           overdue: {
  //             $sum: {
  //               $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0],
  //             },
  //           },

  //           lost: {
  //             $sum: {
  //               $cond: [{ $eq: ['$status', 'lost'] }, 1, 0],
  //             },
  //           },

  //           lentOut: {
  //             $sum: {
  //               $cond: [{ $eq: ['$direction', 'lent_out'] }, 1, 0],
  //             },
  //           },

  //           borrowed: {
  //             $sum: {
  //               $cond: [{ $eq: ['$direction', 'borrowed'] }, 1, 0],
  //             },
  //           },
  //         },
  //       },
  //     ]);

  //     return summary ?? null;
  //   }

  async getLoanSummary(userId: string): Promise<ILoanSummary | null> {
    const userObjId = new Types.ObjectId(userId);
    const now = new Date();
    const nextSevenDays = new Date();
    nextSevenDays.setDate(now.getDate() + 7);

    // Fetch aggregation stats and upcoming due items in parallel for FR-18 compliance
    const [[stats], upcomingDue] = await Promise.all([
      Loan.aggregate([
        { $match: { userId: userObjId } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: {
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
            },
            returned: {
              $sum: { $cond: [{ $eq: ['$status', 'returned'] }, 1, 0] },
            },
            overdue: {
              $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] },
            },
            lost: {
              $sum: { $cond: [{ $eq: ['$status', 'lost'] }, 1, 0] },
            },
            lentOut: {
              $sum: { $cond: [{ $eq: ['$direction', 'lent_out'] }, 1, 0] },
            },
            borrowed: {
              $sum: { $cond: [{ $eq: ['$direction', 'borrowed'] }, 1, 0] },
            },
          },
        },
      ]),
      Loan.find({
        userId: userObjId,
        status: 'active',
        expectedReturnAt: { $gte: now, $lte: nextSevenDays },
      })
        .populate('itemId')
        .populate('contactId')
        .lean(),
    ]);

    if (!stats) return null;

    return {
      ...stats,
      upcomingDueCount: upcomingDue.length,
      upcomingDueItems: upcomingDue,
    };
  }

  async itemHasActiveLoan(itemId: string, userId: string): Promise<Boolean> {
    const result = await Loan.exists({
      itemId,
      userId,
      status: { $in: ['active', 'overdue'] },
    });

    return result !== null;
  }

  async getLoansMatching(
    query: Record<string, unknown>,
  ): Promise<ILoanPopulated[]> {
    return (await Loan.find(query)
      .populate('itemId')
      .populate('contactId')) as unknown as ILoanPopulated[];
  }
}
