import { Container } from "@/customDiv/container";
import type { UpcomingDueLoan } from "@/features/loans/types";
import { UpcomingDueCard } from "./UpcomingDueCards";

interface UpcomingDueListProps {
  items: UpcomingDueLoan[];
  onChanged: () => void | Promise<void>;
}

export function UpcomingDueList({ items, onChanged }: UpcomingDueListProps) {
  return (
    <section>
      <Container className="pb-24">
        <h2 className="mb-3 text-lg font-semibold">Due soon Loans</h2>

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing due in the next 7 days.
          </p>
        ) : (
          <div className="w-full flex flex-col gap-5">
            {items.map((loan) => (
              <UpcomingDueCard
                key={loan.id}
                loan={loan}
                onChanged={onChanged}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
