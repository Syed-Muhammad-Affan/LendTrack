import { Router } from 'express';
import { IContactController } from '../controllers/interface/contact.controller.interface.js';
import { validate } from '../middleware/zod.middleware.js';
import {
  contactParamsSchema,
  createContactSchema,
  updateContactSchema,
} from '../validators/contact.validator.js';

export class ContactRoute {
  public readonly router: Router;

  constructor(private readonly ContactController: IContactController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      validate({ body: createContactSchema }),
      this.ContactController.createContact.bind(this.ContactController),
    );

    this.router.get(
      '/',
      this.ContactController.getAllContact.bind(this.ContactController),
    );

    this.router.get(
      '/:id',
      validate({ params: contactParamsSchema }),
      this.ContactController.getSingleContact.bind(this.ContactController),
    );

    this.router.patch(
      '/:id',
      validate({ body: updateContactSchema, params: contactParamsSchema }),
      this.ContactController.updateContact.bind(this.ContactController),
    );

    this.router.delete(
      '/:id',
      validate({ params: contactParamsSchema }),
      this.ContactController.deleteContact.bind(this.ContactController),
    );
  }
}
