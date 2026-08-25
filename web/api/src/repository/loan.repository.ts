import mongoose, { Types } from 'mongoose';
import { ILoan } from '../interface/loan.interface.js';
import Loan from '../models/Loan.js';
import { ILoanFilters } from './interface/loan.filter.interface.js';
import { ILoanRepository } from './interface/loan.repository.interface.js';
import { ILoanSummary } from './interface/loan.summary.interface.js';

export class LoanRepository implements ILoanRepository {
  async createLoan(body: Partial<ILoan>): Promise<ILoan> {
    return await Loan.create(body);
  }

  async countActiveLoan(userId: string): Promise<number> {
    return await Loan.countDocuments({
      userId: new Types.ObjectId(userId),
      status: { $in: ['active', 'overdue'] },
    });
  }

  async getAllLoan(userId: string, filter: ILoanFilters): Promise<ILoan[]> {
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

    return await Loan.find(query).populate('userId').populate('contactId');
  }

  async getSingleLoan(loanId: string, userId: string): Promise<ILoan | null> {
    return await Loan.findOne({
      _id: new Types.ObjectId(loanId),
      userId: new Types.ObjectId(userId),
    });
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
  ): Promise<ILoan | null> {
    return await Loan.findOneAndUpdate(
      { _id: new Types.ObjectId(loanId), userId: new Types.ObjectId(userId) },
      body,
      {
        runValidators: true,
        returnDocument: 'after',
      },
    );
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
}
