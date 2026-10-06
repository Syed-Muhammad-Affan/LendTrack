import { apiClient } from '../apiClient';
import type { ContactResponse, CreateContactInput, UpdateContactInput } from '../../features/contacts/types';
import type { DeleteResponse } from '../../types/common';

export const contactsApi = {
  getAll: () =>
    apiClient.get<{ success: boolean; message: string; data: ContactResponse[] }>('/contacts'),

  getOne: (id: string) =>
    apiClient.get<{ success: boolean; message: string; data: ContactResponse }>(`/contacts/${id}`),

  create: (body: CreateContactInput) =>
    apiClient.post<{ success: boolean; message: string; data: ContactResponse }>('/contacts', body),

  update: (id: string, body: UpdateContactInput) =>
    apiClient.patch<{ success: boolean; message: string; data: ContactResponse }>(`/contacts/${id}`, body),

  remove: (id: string) =>
    apiClient.delete<{ success: boolean; message: string; data: DeleteResponse }>(`/contacts/${id}`),
};