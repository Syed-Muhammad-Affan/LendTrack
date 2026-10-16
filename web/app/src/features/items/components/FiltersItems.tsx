// import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
// import { useItems } from "../useItems";
import { itemsApi } from "@/api/endpoints/items";
import { Input } from "../../../../@/components/ui/input";
import { Button } from "../../../../@/components/ui/button";
import { Container } from "@/customDiv/container";

interface FiltersItemsProps {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  showArchived: boolean;
  setShowArchived: (value: boolean) => void;
}

export function FiltersItems({
  search,
  setSearch,
  category,
  setCategory,
  showArchived,
  setShowArchived,
}: FiltersItemsProps) {
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    itemsApi.getCategories().then((res) => setCategories(res.data.data));
  }, []);

  return (
    <section>
      <Container className="flex-row pb-10 justify-between">
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xl p-3"
        />

        <div className="flex gap-3 items-center">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 rounded-lg border bg-background px-2 w-32 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <Button
            variant={showArchived ? "outline" : "default"}
            size="lg"
            onClick={() => setShowArchived(false)}
          >
            Active
          </Button>
          <Button
            variant={showArchived ? "default" : "outline"}
            size="lg"
            onClick={() => setShowArchived(true)}
          >
            Archived
          </Button>

          {/* {(search || category) && ( */}
          <Button
            variant="destructive"
            size="lg"
            onClick={() => {
              setSearch("");
              setCategory("");
            }}
          >
            Clear
          </Button>
        </div>
      </Container>
    </section>
  );
}
