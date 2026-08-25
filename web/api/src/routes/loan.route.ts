import { Router } from 'express';
import { ILoanController } from '../controllers/interface/loan.controller.interface.js';
import { validate } from '../middleware/zod.middleware.js';
import {
  createLoanSchema,
  loanFilterSchema,
  loanIdParamsSchema,
  updateLoanSchema,
} from '../validators/loan.validators.js';

export class LoanRoute {
  public readonly router: Router;

  constructor(private readonly LoanController: ILoanController) {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/',
      validate({ body: createLoanSchema }),
      this.LoanController.createLoan.bind(this.LoanController),
    );

    this.router.get(
      '/',
      validate({ query: loanFilterSchema }),
      this.LoanController.getAllLoan.bind(this.LoanController),
    );

    this.router.get(
      '/dashboard-summary',
      this.LoanController.getLoanSummary.bind(this.LoanController),
    );

    this.router.get(
      '/:id',
      validate({ params: loanIdParamsSchema }),
      this.LoanController.getSingleLoan.bind(this.LoanController),
    );

    this.router.patch(
      '/:id',
      validate({ params: loanIdParamsSchema, body: updateLoanSchema }),
      this.LoanController.updateLoan.bind(this.LoanController),
    );

    this.router.delete(
      '/:id',
      validate({ params: loanIdParamsSchema }),
      this.LoanController.deleteLoan.bind(this.LoanController),
    );

    this.router.patch(
      '/:id/return',
      validate({ params: loanIdParamsSchema }),
      this.LoanController.markAsReturn.bind(this.LoanController),
    );

    this.router.patch(
      '/:id/lost',
      validate({ params: loanIdParamsSchema }),
      this.LoanController.markAsLost.bind(this.LoanController),
    );
  }
}
