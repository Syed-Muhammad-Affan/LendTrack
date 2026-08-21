import { IItem } from '../interface/item.interface.js';
import Item from '../models/Item.js';
import { IAllItemFilter } from './interface/allItemFilter.interface.js';
import { IItemRepository } from './interface/item.repository.interface.js';

export class ItemRepository implements IItemRepository {
  async createItem(body: Partial<IItem>): Promise<IItem> {
    return await Item.create(body);
  }

  async getAllItem(filter: IAllItemFilter): Promise<IItem[]> {
    return await Item.find(filter).sort('createdAt');
  }

  async getSingleItem(itemId: string, userId: string): Promise<IItem | null> {
    return await Item.findOne({ _id: itemId, userId: userId });
  }

  async updateItem(
    itemId: string,
    userId: string,
    body: Partial<IItem>,
  ): Promise<IItem | null> {
    return await Item.findOneAndUpdate({ _id: itemId, userId: userId }, body, {
      runValidators: true,
      returnDocument: 'after',
    });
  }

  async deleteItem(itemId: string, userId: string): Promise<IItem | null> {
    return await Item.findOneAndDelete({ _id: itemId, userId: userId });
  }
}
