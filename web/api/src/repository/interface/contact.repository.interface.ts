import { Types } from 'mongoose';
import { IContact } from '../../interface/contact.interface.js';

export interface IContactRepository {
  createContact(body: Partial<IContact>): Promise<IContact>;
  getAllContact(userId: string): Promise<IContact[]>;
  getSingleContact(contactId: string, userId: string): Promise<IContact | null>;
  updateContact(
    contactTd: string,
    userId: string,
    body: Partial<IContact>,
  ): Promise<IContact | null>;
  deleteContact(contactTd: string, userId: string): Promise<IContact | null>;
}
