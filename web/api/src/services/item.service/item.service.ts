import { Types } from 'mongoose';
import { IItem } from '../../interface/item.interface.js';
import { IItemService } from './interface/item.service.interface.js';
import { IItemResponse } from './interface/itemResponse.interface.js';
import { IItemRepository } from '../../repository/interface/item.repository.interface.js';
import errors from '../../errors/index.js';

export class ItemService implements IItemService {
  constructor(private readonly ItemRepository: IItemRepository) {}

  async createItem(
    data: Partial<IItem>,
    userId: string,
  ): Promise<IItemResponse> {
    data.userId = new Types.ObjectId(userId);

    const item = await this.ItemRepository.createItem(data);

    const response: IItemResponse = {
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      category: item.category,
      isArchived: item.isArchived,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };

    if (item.photo !== undefined) {
      response.photo = item.photo;
    }

    return response;
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

    return items?.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      category: item.category,
      isArchived: item.isArchived,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      ...(item.photo !== undefined && { photo: item.photo }),
    }));
  }

  async getSingleItem(itemId: string, userId: string): Promise<IItemResponse> {
    const item = await this.ItemRepository.getSingleItem(itemId, userId);

    if (!item) {
      throw new errors.NotFound('Item not found');
    }

    const response: IItemResponse = {
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      category: item.category,
      isArchived: item.isArchived,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };

    if (item.photo !== undefined) {
      response.photo = item.photo;
    }

    return response;
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

    const response: IItemResponse = {
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      category: item.category,
      isArchived: item.isArchived,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };

    if (item.photo !== undefined) {
      response.photo = item.photo;
    }

    return response;
  }

  async deleteItem(itemId: string, userId: string): Promise<IItemResponse> {
    const item = await this.ItemRepository.deleteItem(itemId, userId);

    if (!item) {
      throw new errors.NotFound('Item not found');
    }

    const response: IItemResponse = {
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      category: item.category,
      isArchived: item.isArchived,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };

    if (item.photo !== undefined) {
      response.photo = item.photo;
    }

    return response;
  }
}
