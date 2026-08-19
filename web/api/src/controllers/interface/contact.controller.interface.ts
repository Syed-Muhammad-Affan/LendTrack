import { Request, Response } from 'express';

export interface IContactController {
  createContact(req: Request, res: Response): Promise<Response>;
  getAllContact(req: Request, res: Response): Promise<Response>;
  getSingleContact(req: Request, res: Response): Promise<Response>;
  updateContact(req: Request, res: Response): Promise<Response>;
  deleteContact(req: Request, res: Response): Promise<Response>;
}
