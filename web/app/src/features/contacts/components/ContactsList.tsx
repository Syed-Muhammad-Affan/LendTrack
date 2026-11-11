import { Container } from "@/customDiv/container";
import type { ContactResponse } from "../types";
import { ContactsCard } from "./ContactCard";

interface ContactsListProps {
  contacts: ContactResponse[];
}

export function ContactsList({ contacts }: ContactsListProps) {
  return (
    <section>
      <Container className="pb-24">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center w-full">
            <p className="text-sm text-muted-foreground">No contacts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {contacts.map((contact) => (
              <ContactsCard key={contact.id} contact={contact} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
