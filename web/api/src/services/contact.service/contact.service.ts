import { Types } from 'mongoose';
import { IContact } from '../../interface/contact.interface.js';
import { IContactService } from './interface/contact.service.interface.js';
import { IContactRepository } from '../../repository/interface/contact.repository.interface.js';
import errors from '../../errors/index.js';

export class ContactService implements IContactService {
  constructor(private readonly ContactRepository: IContactRepository) {}

  async createContact(
    data: Partial<IContact>,
    userId: string,
  ): Promise<IContact> {
    data.userId = new Types.ObjectId(userId);

    const contact = await this.ContactRepository.createContact(data);

    return contact;
  }

  async getAllContact(userId: string): Promise<IContact[]> {
    const contacts = await this.ContactRepository.getAllContact(userId);

    return contacts;
  }

  async getSingleContact(contactId: string, userId: string): Promise<IContact> {
    const contact = await this.ContactRepository.getSingleContact(
      contactId,
      userId,
    );

    if (!contact) {
      throw new errors.NotFound('Contact not found');
    }

    return contact;
  }

  async updateContact(
    contactId: string,
    userId: string,
    body: Partial<IContact>,
  ): Promise<IContact> {
    const contact = await this.ContactRepository.updateContact(
      contactId,
      userId,
      body,
    );

    if (!contact) {
      throw new errors.NotFound('Contact not found');
    }

    return contact;
  }

  async deleteContact(contactId: string, userId: string): Promise<IContact> {
    const contact = await this.ContactRepository.deleteContact(
      contactId,
      userId,
    );

    if (!contact) {
      throw new errors.Unauthenticated('Contact not found');
    }

    return contact;
  }
}
