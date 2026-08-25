import { IContact } from '../../../interface/contact.interface.js';
import { IContactResponse } from './contactResponse.interface.js';

export interface IContactService {
  createContact(
    data: Partial<IContact>,
    userId: string,
  ): Promise<IContactResponse>;
  getAllContact(userId: string): Promise<IContactResponse[]>;
  getSingleContact(
    contactId: string,
    userId: string,
  ): Promise<IContactResponse>;
  updateContact(
    contactId: string,
    userId: string,
    body: Partial<IContact>,
  ): Promise<IContactResponse>;
  deleteContact(contactId: string, userId: string): Promise<IContactResponse>;
}
