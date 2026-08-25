import { Request, Response } from 'express';

export interface ILoanController {
  createLoan(req: Request, res: Response): Promise<Response>;
  getAllLoan(req: Request, res: Response): Promise<Response>;
  getSingleLoan(req: Request, res: Response): Promise<Response>;
  updateLoan(req: Request, res: Response): Promise<Response>;
  deleteLoan(req: Request, res: Response): Promise<Response>;
  markAsReturn(req: Request, res: Response): Promise<Response>;
  markAsLost(req: Request, res: Response): Promise<Response>;
  getLoanSummary(req: Request, res: Response): Promise<Response>;
}
