export interface ContactResponse {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactInput {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export type UpdateContactInput = Partial<CreateContactInput>;

export interface ContactFilters {
  name?: string;
}