import { useState } from "react";
import { useLoanSummary } from "../loans/hooks/useLoanSummary";
import { FiltersItems } from "./components/FiltersItems";
import { HeroSection } from "./components/HeroSection";
import { SummaryCards } from "./components/SummaryCards";
import { useItems } from "./useItems";
import { useDebounce } from "@/hooks/useDebounce";
import { ItemsList } from "./components/ItemsList";

export function ItemsPageLayout() {
  // const { error, isLoading, items, refetch } = useItems();
  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { items, isLoading, error } = useItems({
    archived: showArchived,
    name: debouncedSearch,
    category,
  });
  const { summary } = useLoanSummary();

  const totalItems = items.length;

  if (isLoading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (error || !items) {
    return (
      <div className="p-6 text-center text-red-600">
        {error ?? "Failed to load dashboard"}
      </div>
    );
  }

  return (
    <>
      <HeroSection />
      <SummaryCards totalItems={totalItems} summary={summary} />
      <FiltersItems
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        showArchived={showArchived}
        setShowArchived={setShowArchived}
      />
      <ItemsList items={items} />
    </>
  );
}
