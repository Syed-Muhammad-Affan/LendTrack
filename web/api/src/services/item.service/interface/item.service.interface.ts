import { IItem } from '../../../interface/item.interface.js';
import { IItemFilters } from '../../../repository/interface/allItemFilter.interface.js';
import { IItemResponse } from './itemResponse.interface.js';

export interface IItemService {
  createItem(data: Partial<IItem>, userId: string): Promise<IItemResponse>;
  getAllItem(userId: string, filters: IItemFilters): Promise<IItemResponse[]>;
  getSingleItem(itemId: string, userId: string): Promise<IItemResponse>;
  updateItem(
    itemId: string,
    userId: string,
    body: Partial<IItem>,
  ): Promise<IItemResponse>;
  deleteItem(itemId: string, userId: string): Promise<IItemResponse>;
  getCategories(userId: string): Promise<string[]>;
}
