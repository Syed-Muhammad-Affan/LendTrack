// import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
// import { useItems } from "../useItems";
import { itemsApi } from "@/api/endpoints/items";
import { Input } from "../../../../@/components/ui/input";
import { Button } from "../../../../@/components/ui/button";
import { Container } from "@/customDiv/container";
import { Search } from "lucide-react";

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

  const hasActiveFilters = Boolean(search || category || showArchived);

  return (
    // <section>
    //   <Container className="flex-row pb-10 justify-between">
    //     <div className="relative w-full max-w-xl">
    //       <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    //       <Input
    //         placeholder="Search by name..."
    //         value={search}
    //         onChange={(e) => setSearch(e.target.value)}
    //         className="pl-9" // Left padding ensures text doesn't overlap the icon
    //       />
    //     </div>

    //     <div className="flex gap-3 items-center">
    //       <select
    //         value={category}
    //         onChange={(e) => setCategory(e.target.value)}
    //         className="h-10 rounded-lg border bg-background px-2 w-32 text-sm"
    //       >
    //         <option value="">All categories</option>
    //         {categories.map((c) => (
    //           <option key={c} value={c}>
    //             {c}
    //           </option>
    //         ))}
    //       </select>

    //       <Button
    //         variant={showArchived ? "outline" : "default"}
    //         size="lg"
    //         onClick={() => setShowArchived(false)}
    //       >
    //         Active
    //       </Button>
    //       <Button
    //         variant={showArchived ? "default" : "outline"}
    //         size="lg"
    //         onClick={() => setShowArchived(true)}
    //       >
    //         Archived
    //       </Button>

    //       {/* {(search || category) && ( */}
    //       <Button
    //         variant="ghost"
    //         size="lg"
    //         onClick={() => {
    //           setSearch("");
    //           setCategory("");
    //         }}
    //       >
    //         Clear
    //       </Button>
    //     </div>
    //   </Container>
    // </section>

    <section>
      <Container className="sm:flex-row pb-10 justify-between gap-4 w-full items-start">
        {/* Search Input Box */}
        <div className="relative w-full sm:max-w-xs md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 w-full"
          />
        </div>

        {/* Filter Controls Group */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Active / Archived Toggle Buttons */}
          <div className="flex items-center rounded-lg border p-1 bg-muted/40 gap-1">
            <Button
              variant={showArchived ? "ghost" : "secondary"}
              size="sm"
              onClick={() => setShowArchived(false)}
              className="h-8 text-xs cursor-pointer font-medium"
            >
              Active
            </Button>
            <Button
              variant={showArchived ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowArchived(true)}
              className="h-8 text-xs cursor-pointer font-medium"
            >
              Archived
            </Button>
          </div>

          {/* Conditional Clear Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setCategory("");
                setShowArchived(false);
              }}
              className="h-10 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Clear
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}
