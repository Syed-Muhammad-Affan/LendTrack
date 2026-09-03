import z from 'zod';

export const createContactSchema = z.object({
  name: z.string().max(50).trim(),
  email: z.email('Invalid email').optional(),
  phone: z.string().trim().optional(),
  notes: z.string().trim(),
});

export const contactParamsSchema = z.object({
  id: z.string().min(1),
});

export const updateContactSchema = z
  .object({
    name: z.string().trim().min(1, 'Name cannot be empty').optional(),

    email: z.string().email('Invalid email').optional(),

    phoneNumber: z
      .string()
      .trim()
      .min(1, 'Phone number cannot be empty')
      .optional(),

    notes: z.string().trim().optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.email !== undefined ||
      data.phoneNumber !== undefined ||
      data.notes !== undefined,
    {
      message: 'At least one field is required to update',
    },
  );

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
export type ContactParamsInput = z.infer<typeof contactParamsSchema>;
