import z from 'zod';

export const createItemSchema = z.object({
  name: z.string().max(50).trim(),
  photo: z.string().optional(),
  description: z.string().trim(),
  category: z.string().trim(),
});

export const updateItemSchema = z
  .object({
    name: z.string().trim().min(1, 'Name cannot be empty').optional(),

    photo: z.string().optional(),

    description: z
      .string()
      .trim()
      .min(1, 'Description cannot be empty')
      .optional(),

    category: z.string().trim().optional(),
    isArchived: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.photo !== undefined ||
      data.description !== undefined ||
      data.category !== undefined ||
      data.isArchived !== undefined,
    {
      message: 'At least one field is required to update',
    },
  );

export const itemIDParamsSchema = z.object({
  itemId: z.string().min(1),
});

export const archiveQuerySchema = z.object({
  archive: z.enum(['true', 'false']).optional(),
});

export type CreateItemInout = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type ItemIDParamsInput = z.infer<typeof itemIDParamsSchema>;
export type ArchiveParamsSchema = z.infer<typeof archiveQuerySchema>;
