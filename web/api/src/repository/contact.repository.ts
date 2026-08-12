import { IContact } from '../interface/contact.interface.js';
import Contact from '../models/Contact.js';
import { IContactRepository } from './interface/contactRepo.interface.js';

export class ContactRepository implements IContactRepository {
  async createContact(body: Partial<IContact>): Promise<IContact> {
    return await Contact.create(body);
  }

  async getAllContact(userId: string): Promise<IContact[] | null> {
    return await Contact.find({ userId: userId }).sort('createdAt');
  }

  async getSingleContact(
    contactId: string,
    userId: string,
  ): Promise<IContact | null> {
    return await Contact.findOne({ _id: contactId, userId: userId });
  }

  async updateContact(
    contactTd: string,
    userId: string,
    body: Partial<IContact>,
  ): Promise<IContact | null> {
    return await Contact.findOneAndUpdate(
      { _id: contactTd, userId: userId },
      body,
      { runValidators: true, returnDocument: 'after' },
    );
  }

  async deleteContact(
    contactTd: string,
    userId: string,
  ): Promise<IContact | null> {
    return await Contact.findOneAndDelete({ _id: contactTd, userId: userId });
  }
}
