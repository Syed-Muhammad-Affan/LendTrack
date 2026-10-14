import { Types } from 'mongoose';
import { IItem } from '../interface/item.interface.js';
import Item from '../models/Item.js';
import { IItemFilters } from './interface/allItemFilter.interface.js';
// import { IAllItemFilter } from './interface/allItemFilter.interface.js';
import { IItemRepository } from './interface/item.repository.interface.js';

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class ItemRepository implements IItemRepository {
  async createItem(body: Partial<IItem>): Promise<IItem> {
    return await Item.create(body);
  }

  async getAllItem(userId: string, filters: IItemFilters): Promise<IItem[]> {
    const query: Record<string, unknown> = {
    userId: new Types.ObjectId(userId),
    isArchived: filters.isArchived ?? false, // default stays "active only"
  };

  if (filters.name) {
    query.name = { $regex: escapeRegex(filters.name), $options: 'i' }; // contains, any case
  }
  if (filters.category) {
    query.category = { $regex: `^${escapeRegex(filters.category)}$`, $options: 'i' }; // exact, any case
  }

  return await Item.find(query).sort('createdAt');
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

  async itemExists(itemId: string, userId: string): Promise<boolean> {
    const result = await Item.exists({ _id: itemId, userId });
    return result !== null;
  }

  async getCategories(userId: string): Promise<string[]> {
  return (await Item.distinct('category', { userId: new Types.ObjectId(userId) })).sort();
  }
}
