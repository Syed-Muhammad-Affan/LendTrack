import { Types } from 'mongoose';
import { IItem } from '../../interface/item.interface.js';
import { IItemService } from './interface/item.service.interface.js';
import { IItemRepository } from '../../repository/interface/item.repository.interface.js';
import errors from '../../errors/index.js';

export class ItemService implements IItemService {
  constructor(private readonly ItemRepository: IItemRepository) {}

  async createItem(data: Partial<IItem>, userId: string): Promise<IItem> {
    data.userId = new Types.ObjectId(userId);

    const item = await this.ItemRepository.createItem(data);

    return item;
  }

  async getAllItem(userId: string, isArchived?: boolean): Promise<IItem[]> {
    const filter: any = { userId };

    if (isArchived === undefined) {
      filter.isArchived = false;
    } else {
      filter.isArchived = isArchived;
    }

    const items = await this.ItemRepository.getAllItem(filter);

    return items;
  }

  async getSingleItem(itemId: string, userId: string): Promise<IItem> {
    const item = await this.ItemRepository.getSingleItem(itemId, userId);

    if (!item) {
      throw new errors.NotFound('Item not found');
    }

    return item;
  }

  async updateItem(
    itemId: string,
    userId: string,
    body: Partial<IItem>,
  ): Promise<IItem> {
    const item = await this.ItemRepository.updateItem(itemId, userId, body);

    if (!item) {
      throw new errors.NotFound('Item not found');
    }

    return item;
  }

  async deleteItem(itemId: string, userId: string): Promise<IItem> {
    const item = await this.ItemRepository.deleteItem(itemId, userId);

    if (!item) {
      throw new errors.NotFound('Item not found');
    }

    return item;
  }
}
