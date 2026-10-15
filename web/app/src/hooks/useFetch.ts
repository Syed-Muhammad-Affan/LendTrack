import { useCallback, useEffect, useRef, useState } from 'react';
import { parseApiError } from '@/lib/apiError';
import { DATA_CHANGED_EVENT } from '@/lib/events';

export function useFetch<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const latestRequest = useRef(0);

  const executeFetch = useCallback(
    async (isManualRefetch = false) => {
      const requestId = ++latestRequest.current;

      if (isManualRefetch) {
        setIsLoading(true);
      }

      try {
        const result = await fetcher();
        if (requestId !== latestRequest.current) return;
        setData(result);
        setError(null);
      } catch (err) {
        if (requestId !== latestRequest.current) return;
        setError(parseApiError(err).message);
      } finally {
        if (requestId === latestRequest.current) {
          setIsLoading(false);
        }
      }
    },
    [fetcher]
  );

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      if (!isMounted) return;
      await executeFetch(false);
    })();

    // Listen for global data mutations (from header, forms, etc.)
    const handleGlobalRefresh = () => {
      void executeFetch(true);
    };

    window.addEventListener(DATA_CHANGED_EVENT, handleGlobalRefresh);

    return () => {
      isMounted = false;
      window.removeEventListener(DATA_CHANGED_EVENT, handleGlobalRefresh);
    };
  }, [executeFetch]);

  const refetch = useCallback(() => executeFetch(true), [executeFetch]);

  return { data, isLoading, error, refetch };
}