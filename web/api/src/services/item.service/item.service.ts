import { Types } from 'mongoose';
import { IItem } from '../../interface/item.interface.js';
import { IItemService } from './interface/item.service.interface.js';
import { IItemRepository } from '../../repository/interface/item.repository.interface.js';
import errors from '../../errors/index.js';
import { IItemResponse } from './interface/itemResponse.interface.js';

export class ItemService implements IItemService {
  private toItemResponse(item: IItem): IItemResponse {
    const response: IItemResponse = {
      id: item._id.toString(),
      name: item.name,
      category: item.category,
      description: item.description,
      isArchived: item.isArchived,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };

    if (item.photo) {
      response.photo = item.photo;
    }

    return response;
  }

  constructor(private readonly ItemRepository: IItemRepository) {}

  async createItem(
    data: Partial<IItem>,
    userId: string,
  ): Promise<IItemResponse> {
    data.userId = new Types.ObjectId(userId);

    const item = await this.ItemRepository.createItem(data);

    return this.toItemResponse(item);
  }

  async getAllItem(
    userId: string,
    isArchived?: boolean,
  ): Promise<IItemResponse[]> {
    const filter: any = { userId };

    if (isArchived === undefined) {
      filter.isArchived = false;
    } else {
      filter.isArchived = isArchived;
    }

    const items = await this.ItemRepository.getAllItem(filter);

    return items.map((item) => this.toItemResponse(item));
  }

  async getSingleItem(itemId: string, userId: string): Promise<IItemResponse> {
    const item = await this.ItemRepository.getSingleItem(itemId, userId);

    if (!item) {
      throw new errors.NotFound('Item not found');
    }

    return this.toItemResponse(item);
  }

  async updateItem(
    itemId: string,
    userId: string,
    body: Partial<IItem>,
  ): Promise<IItemResponse> {
    const item = await this.ItemRepository.updateItem(itemId, userId, body);

    if (!item) {
      throw new errors.NotFound('Item not found');
    }

    return this.toItemResponse(item);
  }

  async deleteItem(itemId: string, userId: string): Promise<IItemResponse> {
    const item = await this.ItemRepository.deleteItem(itemId, userId);

    if (!item) {
      throw new errors.NotFound('Item not found');
    }

    return this.toItemResponse(item);
  }
}
