import { apiClient } from '../apiClient';
import type { CheckoutSessionResponse, SubscriptionStatusResponse } from '../../features/billing/types';

export const billingApi = {
  createCheckoutSession: () =>
    apiClient.post<{ success: boolean; message: string; data: CheckoutSessionResponse }>(
      '/billing/create-checkout-session',
    ),

  getStatus: () =>
    apiClient.get<{ success: boolean; message: string; data: SubscriptionStatusResponse }>(
      '/billing/status',
    ),

  cancel: () => apiClient.post('/billing/cancel'),
};