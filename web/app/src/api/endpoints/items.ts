import type { DeleteResponse } from '@/types/common';
import { apiClient } from '../apiClient';
import type { CreateItemInput, ItemResponse, UpdateItemInput } from '@/features/items/types';

export const itemsApi = {
  getAll: (archived?: boolean) =>
    apiClient.get<{ success: boolean; message: string; data: ItemResponse[] }>('/items', {
      params: archived === undefined ? {} : { archived: String(archived) },
    }),

  getOne: (id: string) =>
    apiClient.get<{ success: boolean; message: string; data: ItemResponse }>(`/items/${id}`),

  create: (body: CreateItemInput) =>
    apiClient.post<{ success: boolean; message: string; data: ItemResponse }>('/items', body),

  update: (id: string, body: UpdateItemInput) =>
    apiClient.patch<{ success: boolean; message: string; data: ItemResponse }>(`/items/${id}`, body),

  remove: (id: string) =>
    apiClient.delete<{ success: boolean; message: string; data: DeleteResponse }>(`/items/${id}`),
};