import { IItem } from '../../interface/item.interface.js';
import { IItemFilters } from './allItemFilter.interface.js';
// import { IAllItemFilter } from './allItemFilter.interface.js';

export interface IItemRepository {
  createItem(body: Partial<IItem>): Promise<IItem>;
  getAllItem(userId: string, filters: IItemFilters): Promise<IItem[]>;
  getSingleItem(itemId: string, userId: string): Promise<IItem | null>;
  updateItem(
    itemId: string,
    userId: string,
    body: Partial<IItem>,
  ): Promise<IItem | null>;
  deleteItem(itemId: string, userId: string): Promise<IItem | null>;
  itemExists(itemId: string, userId: string): Promise<boolean>;
  getCategories(userId: string): Promise<string[]>;
}
