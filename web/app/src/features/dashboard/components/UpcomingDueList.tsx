import { Container } from "@/customDiv/container";
import type { UpcomingDueLoan } from "@/features/loans/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../@/components/ui/card";
import { Badge } from "../../../../@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Button } from "../../../../@/components/ui/button";
import { useState } from "react";
import { parseApiError } from "@/lib/apiError";
import { loansApi } from "@/api/endpoints/loans";

interface UpcomingDueListProps {
  items: UpcomingDueLoan[];
  onChanged: () => void | Promise<void>;
}

export function UpcomingDueList({ items, onChanged }: UpcomingDueListProps) {
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const markAsReturned = async (loanId: string) => {
    try {
      await loansApi.markReturned(loanId);
      await onChanged();
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
      console.log(error);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <section>
      <Container className="pb-24">
        <h2 className="mb-3 text-lg font-semibold">Due soon Loans</h2>

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing due in the next 7 days.
          </p>
        ) : (
          <div className="w-full">
            {items.map((loan) => (
              <Card key={loan.id} className="w-full">
                <CardHeader className="flex items-center justify-between gap-5">
                  <CardTitle className="text-3xl">
                    {loan.item?.name ?? loan.borrowedItemName ?? "Item"}
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    {loan.direction == "lent_out" ? (
                      <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                        <ArrowUpRight />
                        Lent out
                      </Badge>
                    ) : (
                      <Badge>
                        <ArrowDownLeft className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300" />
                        Borrowed
                      </Badge>
                    )}
                    <Badge>Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex text-sm text-muted-foreground justify-between">
                  <div>
                    <p>{loan.contact.name}</p>
                    <p>
                      Due {new Date(loan.expectedReturnAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="self-end">
                    <Button
                      onClick={() => markAsReturned(loan.id)}
                      disabled={pendingId === loan.id}
                      variant="secondary"
                      size={"lg"}
                      className="cursor-pointer"
                    >
                      {pendingId === loan.id ? "Saving..." : "Mark as Returned"}
                    </Button>
                    {error && (
                      <p className="mb-3 text-sm text-red-600">{error}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
