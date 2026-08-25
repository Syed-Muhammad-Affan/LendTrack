import { ILoan } from './loan.interface.js';
import { IItem } from './item.interface.js';
import { IContact } from './contact.interface.js';

export interface ILoanPopulated extends Omit<ILoan, 'itemId' | 'contactId'> {
  itemId: IItem;
  contactId: IContact;
}
