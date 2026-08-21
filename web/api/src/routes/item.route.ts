import { Router } from 'express';
import { IItemController } from '../controllers/interface/item.controller.interface.js';
import { validate } from '../middleware/zod.middleware.js';
import {
  archiveQuerySchema,
  createItemSchema,
  itemIDParamsSchema,
  updateItemSchema,
} from '../validators/item.validator.js';

export class ItemRoute {
  public readonly router: Router;

  constructor(private readonly ItemController: IItemController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/',
      validate({ body: createItemSchema }),
      this.ItemController.createItem.bind(this.ItemController),
    );

    this.router.get(
      '/',
      validate({ query: archiveQuerySchema }),
      this.ItemController.getAllItem.bind(this.ItemController),
    );

    this.router.get(
      '/:id',
      validate({ params: itemIDParamsSchema }),
      this.ItemController.getSingleItem.bind(this.ItemController),
    );

    this.router.patch(
      '/:id',
      validate({ body: updateItemSchema, params: itemIDParamsSchema }),
      this.ItemController.updateItem.bind(this.ItemController),
    );

    this.router.delete(
      '/:id',
      validate({ params: itemIDParamsSchema }),
      this.ItemController.deleteItem.bind(this.ItemController),
    );
  }
}
