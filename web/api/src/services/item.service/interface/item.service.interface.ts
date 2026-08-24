import { IItem } from '../../../interface/item.interface.js';

export interface IItemService {
  createItem(data: Partial<IItem>, userId: string): Promise<IItem>;
  getAllItem(userId: string, isArchived?: boolean): Promise<IItem[]>;
  getSingleItem(itemId: string, userId: string): Promise<IItem>;
  updateItem(
    itemId: string,
    userId: string,
    body: Partial<IItem>,
  ): Promise<IItem>;
  deleteItem(itemId: string, userId: string): Promise<IItem>;
}
