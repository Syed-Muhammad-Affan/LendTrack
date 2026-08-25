export interface ILoanResponse {
  id: string;
  direction: string;
  status: string;
  returnAt: Date;
  expectedReturnAt: Date;
  createdAt: Date;
  updatedAt: Date;
  contactId: string;
}
