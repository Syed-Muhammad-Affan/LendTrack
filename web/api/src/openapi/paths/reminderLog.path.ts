// openapi/paths/reminderLog.paths.ts
import { z } from 'zod';
import { registry, bearerAuth } from '../registry.js';
import {
  reminderLogQuerySchema,
  reminderLogIdParamsSchema,
} from '../../validators/reminderLog.validators.js';

export const reminderLogResponseSchema = z
  .object({
    id: z.string(),
    loanId: z.string().optional(),
    type: z.enum(['pre_due', 'overdue', 'weekly_digest']),
    status: z.enum(['sent', 'failed']),
    channel: z.literal('email'),
    recipientEmail: z.string(),
    errorMessage: z.string().optional(),
    sentAt: z.string().datetime(),
    createdAt: z.string().datetime(),
  })
  .openapi('ReminderLogResponse');

registry.registerPath({
  method: 'get',
  path: '/api/v1/reminder-log',
  tags: ['Reminder Logs'],
  summary: 'List reminder logs, filterable by type/status/loanId',
  security: [{ [bearerAuth.name]: [] }],
  request: { query: reminderLogQuerySchema },
  responses: {
    200: {
      description: 'List of reminder logs',
      content: {
        'application/json': { schema: z.array(reminderLogResponseSchema) },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/reminder-log/{id}',
  tags: ['Reminder Logs'],
  summary: 'Get a single reminder log',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: reminderLogIdParamsSchema },
  responses: {
    200: {
      description: 'Reminder log found',
      content: { 'application/json': { schema: reminderLogResponseSchema } },
    },
    404: { description: 'Reminder log not found' },
  },
});
