import { Request, Response } from 'express';
import { ILoanController } from './interface/loan.controller.interface.js';
import { ILoanService } from '../services/loan.service/interface/loan.service.interface.js';
import errors from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';

export class LoanController implements ILoanController {
  constructor(private readonly LoanService: ILoanService) {}

  async createLoan(req: Request, res: Response): Promise<Response> {
    const data = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new errors.Unauthenticated('No authenticated');
    }

    const loan = await this.LoanService.createLoan(data, userId);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Loan created',
      data: loan,
    });
  }

  async getAllLoan(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new errors.Unauthenticated('No authenticated');
    }

    const filter = req.query;

    const loans = await this.LoanService.getAllLoan(userId, filter);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'All loan obtained',
      data: loans,
    });
  }

  async getSingleLoan(req: Request, res: Response): Promise<Response> {
    const loanId = req.params.id;
    if (typeof loanId !== 'string') {
      throw new errors.BadRequest('Loan ID is required');
    }
    const userId = req.user?.userId;

    if (!userId) {
      throw new errors.Unauthenticated('No authenticated');
    }

    const loan = await this.LoanService.getSingleLoan(loanId, userId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Loan obtained',
      data: loan,
    });
  }

  async updateLoan(req: Request, res: Response): Promise<Response> {
    const loanId = req.params.id;
    if (typeof loanId !== 'string') {
      throw new errors.BadRequest('Loan ID is required');
    }
    const userId = req.user?.userId;

    if (!userId) {
      throw new errors.Unauthenticated('No authenticated');
    }

    const data = req.body;

    const loan = await this.LoanService.updateLoan(loanId, userId, data);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Loan updated',
      data: loan,
    });
  }

  async deleteLoan(req: Request, res: Response): Promise<Response> {
    const loanId = req.params.id;
    if (typeof loanId !== 'string') {
      throw new errors.BadRequest('Loan ID is required');
    }
    const userId = req.user?.userId;

    if (!userId) {
      throw new errors.Unauthenticated('No authenticated');
    }

    const loan = await this.LoanService.deleteLoan(loanId, userId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Loan deleted',
      data: loan,
    });
  }

  async markAsReturn(req: Request, res: Response): Promise<Response> {
    const loanId = req.params.id;
    if (typeof loanId !== 'string') {
      throw new errors.BadRequest('Loan ID is required');
    }
    const userId = req.user?.userId;

    if (!userId) {
      throw new errors.Unauthenticated('No authenticated');
    }

    const loan = await this.LoanService.markAsReturn(loanId, userId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Loan returned',
      data: loan,
    });
  }

  async markAsLost(req: Request, res: Response): Promise<Response> {
    const loanId = req.params.id;
    if (typeof loanId !== 'string') {
      throw new errors.BadRequest('Loan ID is required');
    }
    const userId = req.user?.userId;

    if (!userId) {
      throw new errors.Unauthenticated('No authenticated');
    }

    const loan = await this.LoanService.markAsLost(loanId, userId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Loan lost',
      data: loan,
    });
  }

  async getLoanSummary(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;

    if (!userId) {
      throw new errors.Unauthenticated('No authenticated');
    }

    const data = await this.LoanService.getLoanSummary(userId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Loan created',
      data: data,
    });
  }
}
