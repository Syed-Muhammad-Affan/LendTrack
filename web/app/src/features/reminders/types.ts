// features/reminders/types.ts
export interface ReminderLogResponse {
  id: string;
  loanId?: string;
  type: 'pre_due' | 'overdue' | 'weekly_digest';
  status: 'sent' | 'failed';
  channel: 'email';
  recipientEmail: string;
  errorMessage?: string;
  sentAt: string;
  createdAt: string;
}

export interface ReminderLogFilters {
  type?: 'pre_due' | 'overdue' | 'weekly_digest';
  status?: 'sent' | 'failed';
  loanId?: string;
}