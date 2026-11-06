// import { AddItemForm } from "@/features/items/components/AddItemForm";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../../@/components/ui/dialog";
import { Button } from "../../../@/components/ui/button";
import { Plus } from "lucide-react";

// interface AddItemFormProps {
//   onSuccess: () => void;
// }

interface AddFormsProps<P extends { onSuccess: () => void }> {
  formName: string;
  FormComponent: React.ComponentType<P>;
  formProps?: Omit<P, "onSuccess">;
}

export function AddForms<P extends { onSuccess: () => void }>({
  formName,
  FormComponent,
  formProps,
}: AddFormsProps<P>) {
  const [open, setOpen] = useState(false);
  const handleSuccess = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="font-bold text-sm cursor-pointer">
          <Plus />
          Add {formName}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <FormComponent {...(formProps as P)} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
