// openapi/paths/loan.paths.ts
import { z } from 'zod';
import { registry, bearerAuth } from '../registry.js';
import {
  createLoanSchema,
  updateLoanSchema,
  loanIdParamsSchema,
  loanFilterSchema,
} from '../../validators/loan.validators.js';
import { deleteResponseSchema } from '../schemas/common.schemas.js';

const loanItemSummarySchema = z
  .object({
    id: z.string(),
    name: z.string().openapi({ example: 'Cordless Drill' }),
    photo: z.string().optional(),
  })
  .openapi('LoanItemSummary');

const loanContactSummarySchema = z
  .object({
    id: z.string(),
    name: z.string().openapi({ example: 'Affan Ali' }),
    email: z.string().optional(),
    phone: z.string().optional(),
  })
  .openapi('LoanContactSummary');

export const loanResponseSchema = z
  .object({
    id: z.string(),
    item: loanItemSummarySchema.optional(),
    itemDescription: z.string().optional().openapi({ example: 'Cricket Ball' }),
    contact: loanContactSummarySchema,
    direction: z.enum(['lent_out', 'borrowed']),
    status: z.enum(['active', 'returned', 'overdue', 'lost']),
    loanedAt: z.string().datetime(),
    expectedReturnAt: z.string().datetime(),
    returnedAt: z.string().datetime().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi('LoanResponse');

export const loanSummaryResponseSchema = z
  .object({
    total: z.number(),
    active: z.number(),
    returned: z.number(),
    overdue: z.number(),
    lost: z.number(),
    lentOut: z.number(),
    borrowed: z.number(),
    upcomingDueCount: z.number(),
    upcomingDueItems: z.array(
      z.object({
        id: z.string(),
        item: loanItemSummarySchema.optional(),
        contact: loanContactSummarySchema,
        expectedReturnAt: z.string().datetime(),
      }),
    ),
  })
  .openapi('LoanSummaryResponse');

registry.registerPath({
  method: 'post',
  path: '/api/v1/loans',
  tags: ['Loans'],
  summary:
    'Create a loan (lent_out requires itemId, borrowed requires itemDescription)',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: { content: { 'application/json': { schema: createLoanSchema } } },
  },
  responses: {
    201: {
      description: 'Loan created',
      content: { 'application/json': { schema: loanResponseSchema } },
    },
    400: { description: 'Validation error' },
    403: {
      description: 'Free plan limit reached, or item already on an active loan',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/loans',
  tags: ['Loans'],
  summary: 'List loans, filterable by status/contactId/direction',
  security: [{ [bearerAuth.name]: [] }],
  request: { query: loanFilterSchema },
  responses: {
    200: {
      description: 'List of loans',
      content: { 'application/json': { schema: z.array(loanResponseSchema) } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/loans/dashboard-summary',
  tags: ['Loans'],
  summary: 'Get loan dashboard summary and upcoming due items',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'Loan summary',
      content: { 'application/json': { schema: loanSummaryResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/loans/{id}',
  tags: ['Loans'],
  summary: 'Get a single loan',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: loanIdParamsSchema },
  responses: {
    200: {
      description: 'Loan found',
      content: { 'application/json': { schema: loanResponseSchema } },
    },
    404: { description: 'Loan not found' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/v1/loans/{id}',
  tags: ['Loans'],
  summary: 'Update a loan',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: loanIdParamsSchema,
    body: { content: { 'application/json': { schema: updateLoanSchema } } },
  },
  responses: {
    200: {
      description: 'Loan updated',
      content: { 'application/json': { schema: loanResponseSchema } },
    },
    404: { description: 'Loan not found' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/v1/loans/{id}',
  tags: ['Loans'],
  summary: 'Delete a loan',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: loanIdParamsSchema },
  responses: {
    200: {
      description: 'Loan deleted',
      content: { 'application/json': { schema: deleteResponseSchema } },
    },
    404: { description: 'Loan not found' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/v1/loans/{id}/return',
  tags: ['Loans'],
  summary: 'Mark a loan as returned',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: loanIdParamsSchema },
  responses: {
    200: {
      description: 'Loan marked as returned',
      content: { 'application/json': { schema: loanResponseSchema } },
    },
    404: { description: 'Loan not found' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/v1/loans/{id}/lost',
  tags: ['Loans'],
  summary: 'Mark a loan as lost',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: loanIdParamsSchema },
  responses: {
    200: {
      description: 'Loan marked as lost',
      content: { 'application/json': { schema: loanResponseSchema } },
    },
    404: { description: 'Loan not found' },
  },
});
