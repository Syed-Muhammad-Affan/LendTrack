// openapi/paths/contact.paths.ts
import { z } from 'zod';
import { registry, bearerAuth } from '../registry.js';
import {
  createContactSchema,
  updateContactSchema,
  contactParamsSchema,
} from '../../validators/contact.validator.js';
import { deleteResponseSchema } from '../schemas/common.schemas.js';

export const contactResponseSchema = z
  .object({
    id: z.string().openapi({ example: '6a8d779a14bc74ace9478383' }),
    name: z.string().openapi({ example: 'Ali' }),
    email: z.string().optional().openapi({ example: 'ali@gmail.com' }),
    phone: z.string().optional(),
    notes: z.string().optional().openapi({ example: 'He is my school friend' }),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi('ContactResponse');

registry.registerPath({
  method: 'post',
  path: '/api/v1/contacts',
  tags: ['Contacts'],
  summary: 'Create a new contact',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: { content: { 'application/json': { schema: createContactSchema } } },
  },
  responses: {
    201: {
      description: 'Contact created',
      content: { 'application/json': { schema: contactResponseSchema } },
    },
    400: { description: 'Validation error' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/contacts',
  tags: ['Contacts'],
  summary: 'List all contacts',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'List of contacts',
      content: {
        'application/json': { schema: z.array(contactResponseSchema) },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/contacts/{id}',
  tags: ['Contacts'],
  summary: 'Get a single contact',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: contactParamsSchema },
  responses: {
    200: {
      description: 'Contact found',
      content: { 'application/json': { schema: contactResponseSchema } },
    },
    404: { description: 'Contact not found' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/v1/contacts/{id}',
  tags: ['Contacts'],
  summary: 'Update a contact',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: contactParamsSchema,
    body: { content: { 'application/json': { schema: updateContactSchema } } },
  },
  responses: {
    200: {
      description: 'Contact updated',
      content: { 'application/json': { schema: contactResponseSchema } },
    },
    404: { description: 'Contact not found' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/v1/contacts/{id}',
  tags: ['Contacts'],
  summary: 'Delete a contact',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: contactParamsSchema },
  responses: {
    200: {
      description: 'Contact deleted',
      content: { 'application/json': { schema: deleteResponseSchema } },
    },
    404: { description: 'Contact not found' },
  },
});
