import { IItem } from '../../interface/item.interface.js';

export interface IItemRepository {
  createItem(body: Partial<IItem>): Promise<IItem>;
  getAllItem(userId: string): Promise<IItem[] | null>;
  getSingleItem(itemId: string, userId: string): Promise<IItem | null>;
  updateItem(
    itemId: string,
    userId: string,
    body: Partial<IItem>,
  ): Promise<IItem | null>;
  deleteItem(itemId: string, userId: string): Promise<IItem | null>;
}
