import { apiClient } from "@/api/apiClient";
import type { CreateItemInput } from "@/types/item";

export const itemsApi = {
    create: ({category, description, name, photo}: CreateItemInput) => apiClient.post('/items', { name, description, category, photo }),
    getAll: () => apiClient.get('/items'),
    getSingle: () => apiClient.get('/item/:id'),
    update: (category :string, description: string, name: string, photo: string) => apiClient.post('/items/:id', { category, description, name, photo }),
    delete: () => apiClient.delete('/item/:id'),
}