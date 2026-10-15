// import { useCallback, useEffect, useRef, useState } from 'react';
import { itemsApi } from '@/api/endpoints/items';
// import { parseApiError } from '@/lib/apiError';
import type { ItemFilters, ItemResponse } from './types';
import { useFetch } from '@/hooks/useFetch';
import { useCallback } from 'react';

export function useItems(filters: ItemFilters) {
  // const [items, setItems] = useState<ItemResponse[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const latestRequest = useRef(0);

  // Core async fetch handler
  // const executeFetch = useCallback(
  //   async (isRefetch = false) => {
  //     const requestId = ++latestRequest.current;

  //     if (isRefetch) {
  //       setIsLoading(true);
  //     }

  //     try {
  //       const res = await itemsApi.getAll(archived);
  //       if (requestId !== latestRequest.current) return;
  //       setItems(res.data.data);
  //       setError(null);
  //     } catch (err) {
  //       if (requestId !== latestRequest.current) return;
  //       setError(parseApiError(err).message);
  //     } finally {
  //       if (requestId === latestRequest.current) {
  //         setIsLoading(false);
  //       }
  //     }
  //   },
  //   [archived]
  // );

  // useEffect(() => {
  //   let isMounted = true;

  //   // Void operator explicitly marks the promise call as intentional background execution
  //   void (async () => {
  //     if (!isMounted) return;
  //     await executeFetch(false);
  //   })();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [executeFetch]);

  // const refetch = useCallback(() => executeFetch(true), [executeFetch]);

  // return { items, isLoading, error, refetch };


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