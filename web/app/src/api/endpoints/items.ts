import type { DeleteResponse } from '@/types/common';
import { apiClient } from '../apiClient';
import type { CreateItemInput, ItemFilters, ItemResponse, UpdateItemInput } from '@/features/items/types';

export const itemsApi = {
  getAll: (filters: ItemFilters = {}) =>
  apiClient.get<{ success: boolean; message: string; data: ItemResponse[] }>('/items', {
    params: {
      ...(filters.archived !== undefined && { archived: String(filters.archived) }),
      ...(filters.name && { name: filters.name }),
      ...(filters.category && { category: filters.category }),
    },
  }),

  getCategories: () =>
  apiClient.get<{ success: boolean; message: string; data: string[] }>('/items/categories'),

  getOne: (id: string) =>
    apiClient.get<{ success: boolean; message: string; data: ItemResponse }>(`/items/${id}`),

  create: (body: CreateItemInput) =>
    apiClient.post<{ success: boolean; message: string; data: ItemResponse }>('/items', body),

  update: (id: string, body: UpdateItemInput) =>
    apiClient.patch<{ success: boolean; message: string; data: ItemResponse }>(`/items/${id}`, body),

  remove: (id: string) =>
    apiClient.delete<{ success: boolean; message: string; data: DeleteResponse }>(`/items/${id}`),
};