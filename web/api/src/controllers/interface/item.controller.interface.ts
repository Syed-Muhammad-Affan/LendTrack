import { Request, Response } from 'express';

export interface IItemController {
  createItem(req: Request, res: Response): Promise<Response>;
  getAllItem(req: Request, res: Response): Promise<Response>;
  getSingleItem(req: Request, res: Response): Promise<Response>;
  updateItem(req: Request, res: Response): Promise<Response>;
  deleteItem(req: Request, res: Response): Promise<Response>;
}
