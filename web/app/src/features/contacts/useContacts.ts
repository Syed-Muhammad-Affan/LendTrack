import { useCallback } from "react";
import { useFetch } from "@/hooks/useFetch";
import type { ContactFilters, ContactResponse } from "./types";
import { contactsApi } from "@/api/endpoints/contact";

export function useContacts(filters: ContactFilters = {}) {
  const { name } = filters;

  const fetcher = useCallback(
    async () => (await contactsApi.getAll()).data.data,
    []
  );

  const { data, isLoading, error, refetch } = useFetch<ContactResponse[]>(fetcher);

  // Client-side filtering by name until backend supports name search queries
  const items = (data ?? []).filter((c) =>
    name ? c.name.toLowerCase().includes(name.toLowerCase()) : true
  );

  return { contacts: items, isLoading, error, refetch };
}

export function useContact(id: string | undefined) {
  const fetcher = useCallback(async () => {
    if (!id) throw new Error("Contact ID is required");
    return (await contactsApi.getOne(id)).data.data;
  }, [id]);

  const { data, isLoading, error, refetch } = useFetch<ContactResponse>(fetcher);
  return { contact: data, isLoading, error, refetch };
}