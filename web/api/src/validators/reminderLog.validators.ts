import z from 'zod';

export const reminderLogQuerySchema = z.object({
  type: z.enum(['pre_due', 'overdue', 'weekly_digest']).optional(),
  status: z.enum(['sent', 'failed']).optional(),
  loanId: z.string().optional(),
});

export const reminderLogIdParamsSchema = z.object({
  id: z.string().min(1),
});

export type ReminderLogQuerySchema = z.infer<typeof reminderLogQuerySchema>;
export type ReminderLogIdParamsSchema = z.infer<
  typeof reminderLogIdParamsSchema
>;
