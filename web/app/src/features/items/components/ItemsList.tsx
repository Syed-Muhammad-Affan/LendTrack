import { Container } from "@/customDiv/container";
import type { ItemResponse } from "../types";
import { ItemsCard } from "./ItemsCard";

interface ItemsListProps {
  items: ItemResponse[];
}

export function ItemsList({ items }: ItemsListProps) {
  return (
    <section>
      <Container className="pb-24">
        {/* <h2 className="mb-3 text-lg font-semibold">Due soon Loans</h2> */}

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">You have not any item</p>
        ) : (
          <div className="w-full flex flex-col gap-5">
            {items.map((item) => (
              <ItemsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
