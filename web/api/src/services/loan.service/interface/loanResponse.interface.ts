export interface ILoanResponse {
  id: string;
  item?: ILoanItemSummary;
  itemDescription?: string;
  direction: 'lent_out' | 'borrowed';
  status: 'active' | 'returned' | 'overdue' | 'lost';
  loanedAt: Date;
  returnedAt?: Date;
  expectedReturnAt: Date;
  createdAt: Date;
  updatedAt: Date;
  contact: ILoanContactSummary;
}

export interface ILoanItemSummary {
  id: string;
  name: string;
  photo?: string;
}

export interface ILoanContactSummary {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface ILoanDeleteResponse {
  id: string;
}

export interface IUpcomingDueLoan {
  id: string;
  item?: ILoanItemSummary;
  itemDescription?: string;
  contact: ILoanContactSummary;
  expectedReturnAt: Date;
}

export interface ILoanSummaryResponse {
  total: number;
  active: number;
  returned: number;
  overdue: number;
  lost: number;
  lentOut: number;
  borrowed: number;
  upcomingDueCount: number;
  upcomingDueItems: IUpcomingDueLoan[];
}
