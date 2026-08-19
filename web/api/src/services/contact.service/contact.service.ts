import { Types } from "mongoose";
import { IContact } from "../../interface/contact.interface.js";
import { IContactService } from "./interface/contact.service.interface.js";
import { IContactRepository } from "../../repository/interface/contact.repository.interface.js";
import { IContactResponse } from "./interface/contactResponse.interface.js";
import { email } from "zod";

export class ContactService implements IContactService {
    constructor(private readonly ContactRepository: IContactRepository) {}

    async createContact(data: Partial<IContact>, userId: string): Promise<IContactResponse> {
        data.userId = new Types.ObjectId(userId)

        const contact = await this.ContactRepository.createContact(data)

        const response: IContactResponse = {
  id: contact._id.toString(),
  name: contact.name,
};

if (contact.email !== undefined) {
  response.email = contact.email;
}

if (contact.PhoneNumber !== undefined) {
  response.phoneNumber = contact.PhoneNumber;
}

        return  response
    }

    async getAllContact(userId: string): Promise<IContactResponse[] | null> {
        const contacts = await this.ContactRepository.getAllContact(userId)

        return contacts
    }

    async getSingleContact(contactId: string, userId: string): Promise<IContactResponse | null> {
        const contact = await 
    }
}