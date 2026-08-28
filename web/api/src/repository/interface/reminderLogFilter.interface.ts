export interface IReminderLogFilter {
  userId: string;
  type?: 'pre_due' | 'overdue' | 'weekly_digest';
  status?: 'sent' | 'failed';
  loanId?: string;
}
