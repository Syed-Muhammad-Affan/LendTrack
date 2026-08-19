import { Request, Response } from 'express';
import { IContactController } from './interface/contact.controller.interface.js';
import { IContactService } from '../services/contact.service/interface/contact.service.interface.js';
import errors from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import { success } from 'zod';

export class ContactController implements IContactController {
  constructor(private readonly ContactService: IContactService) {}

  async createContact(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;
    const body = req.body;

    if (!userId) {
      throw new errors.Unauthenticated('Authentication required');
    }

    const contact = await this.ContactService.createContact(body, userId);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Contact is created',
      data: contact,
    });
  }

  async getAllContact(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;

    if (!userId) {
      throw new errors.Unauthenticated('Authentication required');
    }

    const contacts = await this.ContactService.getAllContact(userId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'All Contacts are obtained',
      data: contacts,
    });
  }

  async getSingleContact(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;
    const { id: contactId } = req.params;

    if (!userId) {
      throw new errors.Unauthenticated('Authentication required');
    }

    if (typeof contactId !== 'string') {
      throw new errors.BadRequest('Contact ID is required');
    }

    const contact = await this.ContactService.getSingleContact(
      contactId,
      userId,
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Contact is obtained',
      data: contact,
    });
  }

  async updateContact(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;
    const { id: contactId } = req.params;
    const body = req.body;

    if (!userId) {
      throw new errors.Unauthenticated('Authentication required');
    }

    if (typeof contactId !== 'string') {
      throw new errors.BadRequest('Contact ID is required');
    }

    const contact = await this.ContactService.updateContact(
      contactId,
      userId,
      body,
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Contact is updated',
      data: contact,
    });
  }

  async deleteContact(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;
    const { id: contactId } = req.params;

    if (!userId) {
      throw new errors.Unauthenticated('Authentication required');
    }

    if (typeof contactId !== 'string') {
      throw new errors.BadRequest('Contact ID is required');
    }

    const contact = await this.ContactService.deleteContact(contactId, userId);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Contact is deleted',
      data: contact,
    });
  }
}
