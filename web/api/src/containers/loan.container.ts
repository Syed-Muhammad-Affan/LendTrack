import { LoanController } from '../controllers/loan.controller.js';
import { ContactRepository } from '../repository/contact.repository.js';
import { ItemRepository } from '../repository/item.repository.js';
import { LoanRepository } from '../repository/loan.repository.js';
import { UserRepository } from '../repository/user.repository.js';
import { LoanRoute } from '../routes/loan.route.js';
import { LoanService } from '../services/loan.service/loan.service.js';
import { PlanService } from '../services/plan.service/plan.service.js';

export const createLoanModule = () => {
  const loanService = new LoanService(
    new LoanRepository(),
    new ItemRepository(),
    new ContactRepository(),
    new PlanService(new UserRepository()),
  );

  return new LoanRoute(new LoanController(loanService));
};
