import { z } from 'zod';

// POST /loans — body
export const createLoanSchema = z
  .object({
    itemId: z.string().min(1, 'Item is required'),
    contactId: z.string().min(1, 'Contact is required'),
    direction: z.enum(['lent_out', 'borrowed'], {
      error: 'Direction must be lent_out or borrowed',
    }),
    loanedAt: z.coerce.date().default(() => new Date()),
    expectedReturnAt: z.coerce.date(),
  })
  .refine((data) => !data.loanedAt || data.expectedReturnAt > data.loanedAt, {
    message: 'Must be after loaned_at',
    path: ['expectedReturnAt'],
  });

// PATCH /loans/:id — body
export const updateLoanSchema = z
  .object({
    itemId: z.string().min(1).optional(),
    contactId: z.string().min(1).optional(),
    direction: z.enum(['lent_out', 'borrowed']).optional(),
    status: z.enum(['active', 'returned', 'overdue', 'lost']).optional(),
    loanedAt: z.coerce.date().optional(),
    expectedReturnAt: z.coerce.date().optional(),
    returnedAt: z.coerce.date().optional(),
  })
  .refine(
    (data) =>
      data.itemId !== undefined ||
      data.contactId !== undefined ||
      data.direction !== undefined ||
      data.status !== undefined ||
      data.loanedAt !== undefined ||
      data.expectedReturnAt !== undefined ||
      data.returnedAt !== undefined,
    { message: 'At least one field is required to update' },
  )
  .refine(
    (data) =>
      !(data.loanedAt && data.expectedReturnAt) ||
      data.expectedReturnAt > data.loanedAt,
    {
      message: 'Must be after loaned_at',
      path: ['expectedReturnAt'],
    },
  );

// :id route params — used by getSingleLoan, updateLoan, deleteLoan, markAsReturn, markAsLost
export const loanIdParamsSchema = z.object({
  id: z.string().min(1),
});

// GET /loans — query filters
export const loanFilterSchema = z.object({
  status: z.enum(['active', 'returned', 'overdue', 'lost']).optional(),
  contactId: z.string().optional(),
  direction: z.enum(['lent_out', 'borrowed']).optional(),
});

export type CreateLoanInput = z.infer<typeof createLoanSchema>;
export type UpdateLoanInput = z.infer<typeof updateLoanSchema>;
export type LoanIdParamsInput = z.infer<typeof loanIdParamsSchema>;
export type LoanFilterInput = z.infer<typeof loanFilterSchema>;
