// openapi/schemas/common.schemas.ts
import { z } from 'zod';

export const deleteResponseSchema = z
  .object({
    id: z.string(),
  })
  .openapi('DeleteResponse');

export const errorResponseSchema = z
  .object({
    success: z.literal(false),
    error: z.object({
      code: z.string(),
      message: z.string(),
      fields: z.record(z.string(), z.string()).optional(),
    }),
  })
  .openapi('ErrorResponse');
