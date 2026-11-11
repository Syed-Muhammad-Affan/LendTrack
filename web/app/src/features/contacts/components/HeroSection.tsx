import { AddForms } from "@/components/layouts/AddForms";
import { Container } from "@/customDiv/container";
import { AddContactForm } from "./AddContactForm";

export function HeroSection() {
  return (
    <section>
      <Container className="pt-18 flex-row justify-between items-end">
        <div className="flex flex-col gap-3">
          <h1>My Contacts</h1>
          <p className="dark:text-muted-foreground text-muted-foreground">
            Manage your personal contacts and track active item lendings.
          </p>
        </div>
        <AddForms formName="Contact" FormComponent={AddContactForm} />
      </Container>
    </section>
  );
}
