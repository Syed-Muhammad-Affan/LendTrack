import { apiClient } from "@/api/apiClient";

export const authApi = {
    login: (email: string, password: string) => apiClient.post('/auth/login', { email, password }),
    register: (name: string, email: string, password: string) => apiClient.post('/auth/register', { name, email, password }),
    logout: () => apiClient.post('/auth/logout'),
    forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
    resetPassword: (token: string, newPassword: string) => apiClient.post(`/auth/reset-password/${token}`, { newPassword }),
}