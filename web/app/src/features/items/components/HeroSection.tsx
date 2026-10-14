import { AddForms } from "@/components/layouts/AddForms";
import { Container } from "@/customDiv/container";
import { AddItemForm } from "./AddItemForm";

export function HeroSection() {
  return (
    <section>
      <Container className="pt-18 flex-row justify-between items-end">
        <div className="flex flex-col gap-3">
          <h1>My Items</h1>
          <p className="dark:text-muted-foreground text-muted-foreground">
            Catalog, organize, and monitor custody of your personal belongings.
          </p>
        </div>
        <AddForms formName="Item" FormComponent={AddItemForm} />
      </Container>
    </section>
  );
}
