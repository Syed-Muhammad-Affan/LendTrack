import { Request, Response } from 'express';
import { IItemController } from './interface/item.controller.interface.js';
import { IItemService } from '../services/item.service/interface/item.service.interface.js';
import errors from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import { IItemFilters } from '../repository/interface/allItemFilter.interface.js';
// import { IAllItemFilter, IItemFilters } from '../repository/interface/allItemFilter.interface.js';

export class ItemController implements IItemController {
  constructor(private readonly ItemService: IItemService) {}

  async createItem(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;

    if (!userId) {
      throw new errors.Unauthenticated('Authentication required');
    }

    const item = await this.ItemService.createItem(req.body, userId);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Item created',
      data: item,
    });
  }

  async getAllItem(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;

    // const archived =
    //   req.query.archived === undefined
    //     ? undefined
    //     : req.query.archived === 'true';

    if (!userId) {
      throw new errors.Unauthenticated('Authentication required');
    }

    const filters: IItemFilters = {};

if (typeof req.query.archived === 'string') {
  filters.isArchived = req.query.archived === 'true';
}
if (typeof req.query.name === 'string' && req.query.name) {
  filters.name = req.query.name;
}
if (typeof req.query.category === 'string' && req.query.category) {
  filters.category = req.query.category;
}

    const items = await this.ItemService.getAllItem(userId, filters);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'All items fetched successfully',
      data: items,
    });
  }

  async getSingleItem(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;

    if (!userId) {
      throw new errors.Unauthenticated('Authentication required');
    }

    const itemId = req.params.id;

    if (typeof itemId !== 'string') {
      throw new errors.BadRequest('Item ID is required');
    }

    const item = await this.ItemService.getSingleItem(itemId, userId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Item fetched successfully',
      data: item,
    });
  }

  async updateItem(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;

    if (!userId) {
      throw new errors.Unauthenticated('Authentication required');
    }

    const itemId = req.params.id;

    if (typeof itemId !== 'string') {
      throw new errors.BadRequest('Item ID is required');
    }

    const item = await this.ItemService.updateItem(itemId, userId, req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Item updated',
      data: item,
    });
  }

  async deleteItem(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;

    if (!userId) {
      throw new errors.Unauthenticated('Authentication required');
    }

    const itemId = req.params.id;

    if (typeof itemId !== 'string') {
      throw new errors.BadRequest('Item ID is required');
    }

    const item = await this.ItemService.deleteItem(itemId, userId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Item deleted',
      data: item,
    });
  }

  async getCategories(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;

    if (!userId) {
      throw new errors.Unauthenticated('Authentication required');
    }

    const categories = await this.ItemService.getCategories(userId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'All Categories',
      data: categories,
    });
  }
}
