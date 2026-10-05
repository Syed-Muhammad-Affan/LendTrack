import { Plus } from "lucide-react";
import {
  DialogTitle,
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "../../../@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../@/components/ui/tabs";
import { useState } from "react";
import { Button } from "../../../@/components/ui/button";
import { AddItemForm } from "@/features/items/components/AddItemForm";

export function TransactionButton() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("item");

  const handleSuccess = () => {
    setOpen(false); // close the dialog once the form submits successfully
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="font-bold text-sm cursor-pointer">
          <Plus />
          Transaction
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add new</DialogTitle>
          <DialogDescription>
            Create an item, contact, or log a loan.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="item">Item</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="lent_out">Lent Out</TabsTrigger>
            <TabsTrigger value="borrowed">Borrowed</TabsTrigger>
          </TabsList>

          <TabsContent value="item">
            <AddItemForm onSuccess={handleSuccess} />
          </TabsContent>

          <TabsContent value="contact">
            {/* <ContactForm onSuccess={handleSuccess} /> */}
          </TabsContent>

          <TabsContent value="lent_out">
            {/* <LoanForm direction="lent_out" onSuccess={handleSuccess} /> */}
          </TabsContent>

          <TabsContent value="borrowed">
            {/* <LoanForm direction="borrowed" onSuccess={handleSuccess} /> */}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
