import { Container } from "@/customDiv/container";
import { Users, Handshake } from "lucide-react";
import { Card, CardContent } from "@shadcn/components/ui/card";
import type { LoanSummaryResponse } from "@/features/loans/types";

interface SummaryCardsProps {
  totalContacts: number;
  summary: LoanSummaryResponse | null;
}

export function SummaryCards({ totalContacts, summary }: SummaryCardsProps) {
  const cards = [
    {
      label: "TOTAL CONTACTS",
      value: totalContacts ?? 0,
      icon: Users,
      iconBoxStyle:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
      labelStyle: "text-muted-foreground",
      valueStyle: "text-foreground",
    },
    {
      label: "ACTIVE BORROWERS",
      value: summary?.borrowed ?? 0,
      icon: Handshake,
      iconBoxStyle:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",
      labelStyle: "text-emerald-600 dark:text-emerald-400",
      valueStyle: "text-foreground",
    },
  ];

  return (
    <section>
      <Container className="py-18 grid sm:grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.label}
              className="p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20"
            >
              <CardContent className="p-0 flex items-center gap-3.5">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.iconBoxStyle}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-2xl font-bold leading-tight ${card.valueStyle}`}
                  >
                    {card.value}
                  </span>
                  <span
                    className={`text-[11px] font-bold tracking-wider uppercase truncate ${card.labelStyle}`}
                  >
                    {card.label}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </Container>
    </section>
  );
}
