// import { AddItemForm } from "@/features/items/components/AddItemForm";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../../@/components/ui/dialog";
import { Button } from "../../../@/components/ui/button";
import { Plus } from "lucide-react";

interface AddItemFormProps {
  onSuccess: () => void;
}

interface AddFormsProps {
  formName: string;
  FormComponent: React.ComponentType<AddItemFormProps>;
}

export function AddForms({ formName, FormComponent }: AddFormsProps) {
  const [open, setOpen] = useState(false);
  //   const [activeTab, setActiveTab] = useState("item");

  const handleSuccess = () => {
    setOpen(false); // close the dialog once the form submits successfully
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="font-bold text-sm cursor-pointer">
          <Plus />
          Add {formName}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <FormComponent onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
