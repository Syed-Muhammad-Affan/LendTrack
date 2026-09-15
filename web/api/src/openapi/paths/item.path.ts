// openapi/paths/item.paths.ts
import { z } from 'zod';
import { registry, bearerAuth } from '../registry.js';
import {
  createItemSchema,
  itemIDParamsSchema,
  archiveQuerySchema,
  updateItemSchema,
} from '../../validators/item.validator.js';
import { itemResponseSchema } from '../../services/item.service/interface/itemResponse.interface.js';

registry.registerPath({
  method: 'post',
  path: '/api/v1/items',
  tags: ['Items'],
  summary: 'Create a new item',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: { content: { 'application/json': { schema: createItemSchema } } },
  },
  responses: {
    201: {
      description: 'Item created successfully',
      content: { 'application/json': { schema: itemResponseSchema } },
    },
    400: { description: 'Validation error' },
    401: { description: 'Authentication required' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/items',
  tags: ['Items'],
  summary: 'List items (defaults to non-archived)',
  security: [{ [bearerAuth.name]: [] }],
  request: { query: archiveQuerySchema },
  responses: {
    200: {
      description: 'List of items',
      content: { 'application/json': { schema: z.array(itemResponseSchema) } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/items/{id}',
  tags: ['Items'],
  summary: 'Get a single item',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: itemIDParamsSchema },
  responses: {
    200: {
      description: 'Item found',
      content: { 'application/json': { schema: itemResponseSchema } },
    },
    404: { description: 'Item not found' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/v1/items/{id}',
  tags: ['Items'],
  summary: 'Update a item',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: { content: { 'application/json': { schema: updateItemSchema } } },
  },
  responses: {
    201: {
      description: 'Item updated successfully',
      content: { 'application/json': { schema: itemResponseSchema } },
    },
    400: { description: 'Validation error' },
    401: { description: 'Authentication required' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/v1/items/{id}',
  tags: ['Items'],
  summary: 'Delete an item',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: itemIDParamsSchema,
  },
  responses: {
    200: {
      description: 'Item deleted successfully',
      content: {
        'application/json': {
          schema: z.object({ id: z.string() }).openapi('ItemDeleteResponse'),
        },
      },
    },
    404: { description: 'Item not found' },
  },
});
