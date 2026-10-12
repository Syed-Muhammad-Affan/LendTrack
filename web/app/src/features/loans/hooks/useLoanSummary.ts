import { useCallback, useEffect, useState } from "react";
import type { LoanSummaryResponse } from "../types";
import { loansApi } from "@/api/endpoints/loans";
import { parseApiError } from "@/lib/apiError";

export function useLoanSummary() {
  const [summary, setSummary] = useState<LoanSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await loansApi.getSummary();
      setSummary(res.data.data);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      setError(null);
      try {
        const res = await loansApi.getSummary();
        if (!ignore) {
          setSummary(res.data.data);
        }
      } catch (err) {
        if (!ignore) {
          setError(parseApiError(err).message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true; // Prevents race conditions if component unmounts
    };
  }, []);

  return { summary, isLoading, error, refetch: fetchSummary };
}