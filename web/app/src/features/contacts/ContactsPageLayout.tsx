import { useState } from "react";
import { useContacts } from "./useContacts";
import { useLoanSummary } from "../loans/hooks/useLoanSummary";
import { useDebounce } from "@/hooks/useDebounce";

import { FiltersContacts } from "./components/FiltersContacts";
import { ContactsList } from "./components/ContactsList";
import { HeroSection } from "./components/HeroSection";
import { SummaryCards } from "./components/SummaryCards";

export function ContactsPageLayout() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { contacts, isLoading, error } = useContacts({ name: debouncedSearch });
  const { summary } = useLoanSummary();

  if (isLoading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading contacts...
      </div>
    );
  }

  if (error || !contacts) {
    return (
      <div className="p-6 text-center text-red-600">
        {error ?? "Failed to load contacts"}
      </div>
    );
  }

  return (
    <>
      <HeroSection />
      <SummaryCards totalContacts={contacts.length} summary={summary} />
      <FiltersContacts search={search} setSearch={setSearch} />
      <ContactsList contacts={contacts} />
    </>
  );
}
