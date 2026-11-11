import { Input } from "@shadcn/components/ui/input";
import { Button } from "@shadcn/components/ui/button";
import { Container } from "@/customDiv/container";
import { Search } from "lucide-react";

interface FiltersContactsProps {
  search: string;
  setSearch: (value: string) => void;
}

export function FiltersContacts({ search, setSearch }: FiltersContactsProps) {
  const hasActiveFilters = Boolean(search);

  return (
    <section>
      <Container className="sm:flex-row pb-10 justify-between gap-4 w-full items-start">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 w-full"
          />
        </div>

        {/* Action Controls */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearch("")}
              className="h-10 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Clear
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
