import { useState, type FormEvent } from "react";
import { contactsApi } from "@/api/endpoints/contact";
import type { CreateContactInput } from "../types";
import { Label } from "@shadcn/components/ui/label";
import { Input } from "@shadcn/components/ui/input";
import { Button } from "@shadcn/components/ui/button";
import { parseApiError } from "@/lib/apiError";
import { notifyDataChanged } from "@/lib/events";

interface ContactFormProps {
  onSuccess?: () => void;
  contactId?: string;
  defaultValues?: Partial<CreateContactInput>;
}

export function AddContactForm({
  onSuccess,
  contactId,
  defaultValues,
}: ContactFormProps) {
  const isEditMode = Boolean(contactId);

  const [name, setName] = useState(defaultValues?.name ?? "");
  const [email, setEmail] = useState(defaultValues?.email ?? "");
  const [phone, setPhone] = useState(defaultValues?.phone ?? "");
  const [notes, setNotes] = useState(defaultValues?.notes ?? "");

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const payload: CreateContactInput = {
        name,
        ...(email ? { email } : {}),
        ...(phone ? { phone } : {}),
        ...(notes ? { notes } : {}),
      };

      if (isEditMode && contactId) {
        await contactsApi.update(contactId, payload);
      } else {
        await contactsApi.create(payload);
      }

      notifyDataChanged();
      onSuccess?.();
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
      setFieldErrors(parsed.fields);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col px-8 py-5 gap-6">
      <h3>{isEditMode ? "Edit Contact" : "Add Contact"}</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name:</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {fieldErrors.name && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email:</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone:</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {fieldErrors.phone && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="notes">Notes:</Label>
          <Input
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {fieldErrors.notes && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.notes}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Saving..."
          : isEditMode
            ? "Save Changes"
            : "Add Contact"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
