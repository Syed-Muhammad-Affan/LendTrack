import z from 'zod';

export interface IItemResponse {
  id: string;
  name: string;
  description: string;
  category: string;
  photo?: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const itemResponseSchema = z
  .object({
    id: z.string().openapi({ example: '6a8ffc77ad87207e690fa107' }),
    name: z.string().openapi({ example: 'Cordless Drill' }),
    category: z.string().openapi({ example: 'Tools' }),
    description: z.string().openapi({ example: 'DeWalt 20V cordless drill' }),
    isArchived: z.boolean().openapi({ example: false }),
    photo: z.string().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi('ItemResponse');
