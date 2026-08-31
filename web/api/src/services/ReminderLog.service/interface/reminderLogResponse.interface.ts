export interface IReminderLogResponse {
  id: string;
  loanId?: string;
  type: 'pre_due' | 'overdue' | 'weekly_digest';
  status: 'sent' | 'failed';
  channel: 'email';
  recipientEmail: string;
  errorMessage?: string;
  sentAt: Date;
  createdAt: Date;
}
