import { useLoanSummary } from "../loans/hooks/useLoanSummary";
import { SummaryCards } from "./components/SummaryCards";
import { UpcomingDueList } from "./components/UpcomingDueList";

export default function DashboardPage() {
  const { summary, isLoading, error, refetch } = useLoanSummary();

  if (isLoading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="p-6 text-center text-red-600">
        {error ?? "Failed to load dashboard"}
      </div>
    );
  }

  return (
    <>
      <SummaryCards summary={summary} />
      <UpcomingDueList items={summary.upcomingDueItems} onChanged={refetch} />
    </>
  );
}
