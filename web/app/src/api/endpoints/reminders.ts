import { apiClient } from '../apiClient';
import type { ReminderLogResponse, ReminderLogFilters } from '../../features/reminders/types';

export const reminderLogsApi = {
  getAll: (filters?: ReminderLogFilters) =>
    apiClient.get<{ success: boolean; message: string; data: ReminderLogResponse[] }>(
      '/reminder-log',
      { params: filters },
    ),

  getOne: (id: string) =>
    apiClient.get<{ success: boolean; message: string; data: ReminderLogResponse }>(
      `/reminder-log/${id}`,
    ),
};