import { Mail, Phone, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shadcn/components/ui/card";
import type { ContactResponse } from "../types";

interface ContactsCardProps {
  contact: ContactResponse;
}

export function ContactsCard({ contact }: ContactsCardProps) {
  const initial = contact.name ? contact.name.charAt(0).toUpperCase() : "?";

  return (
    <Link to={`/contacts/${contact.id}`}>
      <Card className="w-full flex flex-col justify-between transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20">
        <CardHeader className="flex flex-row items-start gap-3 pb-2">
          {/* Avatar Initial Box */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border font-bold text-lg">
            {initial}
          </div>

          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <CardTitle
              className="text-lg font-bold line-clamp-1 leading-tight"
              title={contact.name}
            >
              {contact.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {contact.notes || "No notes added"}
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-2 pt-4 mt-auto border-t border-border/40">
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            {contact.email && (
              <span className="flex items-center gap-2 truncate">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{contact.email}</span>
              </span>
            )}
            {contact.phone && (
              <span className="flex items-center gap-2 truncate">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{contact.phone}</span>
              </span>
            )}
          </div>

          {/* Date Created */}
          <div className="flex items-center justify-end gap-1.5 pt-2 text-[11px] text-muted-foreground/70">
            <Calendar className="h-3 w-3" />
            <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
