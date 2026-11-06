import { itemsApi } from "@/api/endpoints/items";
import type { CreateItemInput } from "@/features/items/types";
import { useState, type FormEvent } from "react";
import { Label } from "@shadcn/components/ui/label";
import { parseApiError } from "@/lib/apiError";
import { Input } from "@shadcn/components/ui/input";
import { Button } from "@shadcn/components/ui/button";
import { notifyDataChanged } from "@/lib/events";

interface ItemFormProps {
  onSuccess?: () => void;
  itemId?: string; // present → edit mode, absent → create mode
  defaultValues?: Partial<CreateItemInput>;
}

export function AddItemForm({
  onSuccess,
  itemId,
  defaultValues,
}: ItemFormProps) {
  const isEditMode = Boolean(itemId);

  const [name, setName] = useState(defaultValues?.name ?? "");
  const [category, setCategory] = useState(defaultValues?.category ?? "");
  const [description, setDescription] = useState(
    defaultValues?.description ?? "",
  );
  const [photo, setPhoto] = useState(defaultValues?.photo ?? "");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const payload: CreateItemInput = {
        name,
        description,
        category,
        ...(photo ? { photo } : {}),
      };

      if (isEditMode && itemId) {
        await itemsApi.update(itemId, payload);
      } else {
        await itemsApi.create(payload);
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
      <h3>{isEditMode ? "Edit Item" : "Add Item"}</h3>
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
          <Label htmlFor="category">Category:</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          {fieldErrors.category && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.category}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description:</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          {fieldErrors.description && (
            <p className="mt-1 text-sm text-red-600">
              {fieldErrors.description}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="photo">Photo:</Label>
          <Input
            id="photo"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
          />
          {fieldErrors.photo && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.photo}</p>
          )}
        </div>
      </div>
      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Item"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
