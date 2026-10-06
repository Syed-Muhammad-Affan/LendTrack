// features/items/types.ts
export interface ItemResponse {
  id: string;
  name: string;
  category: string;
  description: string;
  isArchived: boolean;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemInput {
  name: string;
  description: string;
  category: string;
  photo?: string;
}

export type UpdateItemInput = Partial<CreateItemInput> & { isArchived?: boolean };