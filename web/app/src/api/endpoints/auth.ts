// import { apiClient } from "@/api/apiClient";

// export const authApi = {
//     login: (email: string, password: string) => apiClient.post('/auth/login', { email, password }),
//     register: (name: string, email: string, password: string) => apiClient.post('/auth/register', { name, email, password }),
//     logout: () => apiClient.post('/auth/logout'),
//     forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
//     resetPassword: (token: string, newPassword: string) => apiClient.post(`/auth/reset-password/${token}`, { newPassword }),
// }

import type { AuthUser } from '@/features/auth/types';
import { apiClient } from '../apiClient';

export const authApi = {
  register: (name: string, email: string, password: string) =>
    apiClient.post<{ success: boolean; message: string; data: AuthUser }>('/auth/register', {
      name,
      email,
      password,
    }),

  login: (email: string, password: string) =>
    apiClient.post<{ success: boolean; message: string; data: AuthUser }>('/auth/login', {
      email,
      password,
    }),

  logout: () => apiClient.post('/auth/logout'),

  getMe: () => apiClient.get<{ success: boolean; message: string; data: AuthUser }>('/auth/me'),

  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    apiClient.patch(`/auth/reset-password/${token}`, { newPassword }),
}