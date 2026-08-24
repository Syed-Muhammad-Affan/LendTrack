import { IContact } from '../../../interface/contact.interface.js';

export interface IContactService {
  createContact(data: Partial<IContact>, userId: string): Promise<IContact>;
  getAllContact(userId: string): Promise<IContact[]>;
  getSingleContact(contactId: string, userId: string): Promise<IContact>;
  updateContact(
    contactId: string,
    userId: string,
    body: Partial<IContact>,
  ): Promise<IContact>;
  deleteContact(contactId: string, userId: string): Promise<IContact>;
}
