import { ContactController } from '../controllers/contact.controller.js';
import { ContactRepository } from '../repository/contact.repository.js';
import { ContactRoute } from '../routes/contact.route.js';
import { ContactService } from '../services/contact.service/contact.service.js';

export const createContactModule = () => {
  const contactRepository = new ContactRepository();
  const contactService = new ContactService(contactRepository);
  const contactController = new ContactController(contactService);
  return new ContactRoute(contactController);
};
