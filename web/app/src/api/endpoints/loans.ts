import { apiClient } from '../apiClient';
import type {
  LoanResponse,
  LoanSummaryResponse,
  CreateLoanInput,
  UpdateLoanInput,
  LoanFilters,
} from '../../features/loans/types';
import type { DeleteResponse } from '../../types/common';

export const loansApi = {
  getAll: (filters?: LoanFilters) =>
    apiClient.get<{ success: boolean; message: string; data: LoanResponse[] }>('/loans', {
      params: filters,
    }),

  getSummary: () =>
    apiClient.get<{ success: boolean; message: string; data: LoanSummaryResponse }>(
      '/loans/dashboard-summary',
    ),

  getOne: (id: string) =>
    apiClient.get<{ success: boolean; message: string; data: LoanResponse }>(`/loans/${id}`),

  create: (body: CreateLoanInput) =>
    apiClient.post<{ success: boolean; message: string; data: LoanResponse }>('/loans', body),

  update: (id: string, body: UpdateLoanInput) =>
    apiClient.patch<{ success: boolean; message: string; data: LoanResponse }>(`/loans/${id}`, body),

  remove: (id: string) =>
    apiClient.delete<{ success: boolean; message: string; data: DeleteResponse }>(`/loans/${id}`),

  markReturned: (id: string) =>
    apiClient.patch<{ success: boolean; message: string; data: LoanResponse }>(`/loans/${id}/return`),

  markLost: (id: string) =>
    apiClient.patch<{ success: boolean; message: string; data: LoanResponse }>(`/loans/${id}/lost`),
};