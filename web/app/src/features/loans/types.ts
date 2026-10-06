// features/loans/types.ts
export interface LoanItemSummary {
  id: string;
  name: string;
  photo?: string;
}

export interface LoanContactSummary {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface LoanResponse {
  id: string;
  item?: LoanItemSummary;
  itemDescription?: string;
  contact: LoanContactSummary;
  direction: 'lent_out' | 'borrowed';
  status: 'active' | 'returned' | 'overdue' | 'lost';
  loanedAt: string;
  expectedReturnAt: string;
  returnedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoanSummaryResponse {
  total: number;
  active: number;
  returned: number;
  overdue: number;
  lost: number;
  lentOut: number;
  borrowed: number;
  upcomingDueCount: number;
  upcomingDueItems: Array<{
    id: string;
    item?: LoanItemSummary;
    contact: LoanContactSummary;
    expectedReturnAt: string;
  }>;
}

export interface CreateLoanInput {
  contactId: string;
  itemId?: string;           // required when direction is 'lent_out'
  itemDescription?: string;  // required when direction is 'borrowed'
  direction: 'lent_out' | 'borrowed';
  loanedAt?: string;
  expectedReturnAt: string;
}

export type UpdateLoanInput = Partial<Omit<CreateLoanInput, 'direction'>>;

export interface LoanFilters {
  status?: 'active' | 'returned' | 'overdue' | 'lost';
  contactId?: string;
  direction?: 'lent_out' | 'borrowed';
}