import { LoanController } from '../controllers/loan.controller.js';
import { ContactRepository } from '../repository/contact.repository.js';
import { ItemRepository } from '../repository/item.repository.js';
import { LoanRepository } from '../repository/loan.repository.js';
import { LoanRoute } from '../routes/loan.route.js';
import { LoanService } from '../services/loan.service/loan.service.js';

export const createLoanModule = () => {
  const itemRepository = new ItemRepository();
  const contactRepository = new ContactRepository();
  const loanRepository = new LoanRepository();
  const loanService = new LoanService(
    loanRepository,
    itemRepository,
    contactRepository,
  );
  const loanController = new LoanController(loanService);

  return new LoanRoute(loanController);
};
