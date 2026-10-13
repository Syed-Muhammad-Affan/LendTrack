import { Container } from "@/customDiv/container";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../@/components/ui/card";
import { Badge } from "../../../../@/components/ui/badge";
import type { LoanSummaryResponse } from "@/features/loans/types";
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  ClipboardCheck,
  Clock,
} from "lucide-react";

interface SummaryCardsProps {
  summary: LoanSummaryResponse;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    { label: "Total Loans", value: summary.total, icon: ClipboardCheck },
    {
      label: "Lent Out",
      value: summary.lentOut,
      icon: ArrowUpRight,
      iconStyle:
        "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
      badgeContent: "Active",
      badgeStyle:
        "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
    },
    {
      label: "Borrowed",
      value: summary.borrowed,
      icon: ArrowDownLeft,
      iconStyle:
        "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    },
    {
      label: "Due Soon",
      value: summary.upcomingDueCount,
      icon: Clock,
      iconStyle: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
      badgeContent: "Amber",
      badgeStyle: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    },
    {
      label: "Overdue",
      value: summary.overdue,
      icon: AlertCircle,
      iconStyle: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
      badgeContent: "Action",
      badgeStyle: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    },
  ];

  return (
    <section>
      <Container className="py-18 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.label}
              className="gap-2 [--card-spacing:--spacing(6)] h-full justify-between transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20"
            >
              <CardHeader className="pb-2 flex justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                {card.iconStyle ? (
                  <Badge className={`${card.iconStyle}`}>
                    <Icon />
                  </Badge>
                ) : (
                  <Badge variant={"secondary"}>
                    <Icon />
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="flex flex-row gap-3">
                <h2 className="font-semibold">{card.value}</h2>
                {card.badgeContent && (
                  <Badge className={`${card.badgeStyle} self-end`}>
                    {card.badgeContent}
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Container>
    </section>
  );
}
