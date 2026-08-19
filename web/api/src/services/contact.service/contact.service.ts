import { Types } from 'mongoose';
import { IContact } from '../../interface/contact.interface.js';
import { IContactService } from './interface/contact.service.interface.js';
import { IContactRepository } from '../../repository/interface/contact.repository.interface.js';
import { IContactResponse } from './interface/contactResponse.interface.js';
import { email } from 'zod';
import errors from '../../errors/index.js';

export class ContactService implements IContactService {
  constructor(private readonly ContactRepository: IContactRepository) {}

  async createContact(
    data: Partial<IContact>,
    userId: string,
  ): Promise<IContactResponse> {
    data.userId = new Types.ObjectId(userId);

    const contact = await this.ContactRepository.createContact(data);

    const response: IContactResponse = {
      id: contact._id.toString(),
      name: contact.name,
      notes: contact.notes,
    };

    if (contact.email !== undefined) {
      response.email = contact.email;
    }

    if (contact.phone !== undefined) {
      response.phone = contact.phone;
    }

    return response;
  }

  async getAllContact(userId: string): Promise<IContactResponse[]> {
    const contacts = await this.ContactRepository.getAllContact(userId);

    return contacts?.map((contact) => ({
      id: contact._id.toString(),
      name: contact.name,
      notes: contact.notes,
      ...(contact.email !== undefined && {
        email: contact.email,
      }),
      ...(contact.phone !== undefined && {
        phone: contact.phone,
      }),
    }));
  }

  async getSingleContact(
    contactId: string,
    userId: string,
  ): Promise<IContactResponse | null> {
    const contact = await this.ContactRepository.getSingleContact(
      contactId,
      userId,
    );

    if (!contact) {
      throw new errors.NotFound('Contact not found');
    }

    const response: IContactResponse = {
      id: contact._id.toString(),
      name: contact.name,
      notes: contact.notes,
    };

    if (contact.email !== undefined) {
      response.email = contact.email;
    }

    if (contact.phone !== undefined) {
      response.phone = contact.phone;
    }

    return response;
  }

  async updateContact(
    contactId: string,
    userId: string,
    body: Partial<IContact>,
  ): Promise<IContactResponse> {
    const contact = await this.ContactRepository.updateContact(
      contactId,
      userId,
      body,
    );

    if (!contact) {
      throw new errors.Unauthenticated('Contact not found');
    }

    const response: IContactResponse = {
      id: contact._id.toString(),
      name: contact.name,
      notes: contact.notes,
    };

    if (contact.email !== undefined) {
      response.email = contact.email;
    }

    if (contact.phone !== undefined) {
      response.phone = contact.phone;
    }

    return response;
  }

  async deleteContact(
    contactId: string,
    userId: string,
  ): Promise<IContactResponse> {
    const contact = await this.ContactRepository.deleteContact(
      contactId,
      userId,
    );

    if (!contact) {
      throw new errors.Unauthenticated('Contact not found');
    }

    const response: IContactResponse = {
      id: contact._id.toString(),
      name: contact.name,
      notes: contact.notes,
    };

    if (contact.email !== undefined) {
      response.email = contact.email;
    }

    if (contact.phone !== undefined) {
      response.phone = contact.phone;
    }

    return response;
  }
}
