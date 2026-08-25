import { LoanController } from '../controllers/loan.controller.js';
import { LoanRepository } from '../repository/loan.repository.js';
import { LoanRoute } from '../routes/loan.route.js';
import { LoanService } from '../services/loan.service/loan.service.js';

export const createLoanModule = () => {
  const loanRepository = new LoanRepository();
  const loanService = new LoanService(loanRepository);
  const loanController = new LoanController(loanService);

  return new LoanRoute(loanController);
};
