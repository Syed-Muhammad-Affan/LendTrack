import { ItemController } from '../controllers/item.controller.js';
import { ItemRepository } from '../repository/item.repository.js';
import { ItemRoute } from '../routes/item.route.js';
import { ItemService } from '../services/item.service/item.service.js';

export const createItemModule = () => {
  const itemRepository = new ItemRepository();
  const itemService = new ItemService(itemRepository);
  const itemController = new ItemController(itemService);
  return new ItemRoute(itemController);
};
