import { itemsApi } from '@/api/endpoints/items';
import type { ItemFilters, ItemResponse } from './types';
import { useFetch } from '@/hooks/useFetch';
import { useCallback } from 'react';

export function useItems(filters: ItemFilters) {
  const { archived, name, category } = filters;

    const fetcher = useCallback(
    async () =>
      (await itemsApi.getAll({
        ...(archived !== undefined && { archived }),
        ...(name && { name }),
        ...(category && { category }),
      })).data.data,
    [archived, name, category], // primitives, so it only changes when a value does
  );

  const { data, isLoading, error, refetch } = useFetch<ItemResponse[]>(fetcher);
  return { items: data ?? [], isLoading, error, refetch };
}

export function useItem(id: string | undefined) {
  const fetcher = useCallback(async () => {
    if (!id) throw new Error("Item ID is required");
    return (await itemsApi.getOne(id)).data.data;
  }, [id]);

  const { data, isLoading, error, refetch } = useFetch<ItemResponse>(fetcher);

  return { item: data, isLoading, error, refetch };
}