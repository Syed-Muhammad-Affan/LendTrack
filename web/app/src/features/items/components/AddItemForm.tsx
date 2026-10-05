import { itemsApi } from "@/api/endpoints/items";
import type { CreateItemInput } from "@/types/item";
import { useState, type FormEvent } from "react";
import { Label } from "../../../../@/components/ui/label";
import { parseApiError } from "@/lib/apiError";
import { Input } from "../../../../@/components/ui/input";
import { Button } from "../../../../@/components/ui/button";

interface ItemFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<CreateItemInput>; // for edit mode, if reused there too
}

export function AddItemForm({ onSuccess }: ItemFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    try {
      await itemsApi.create({ name, description, category, photo });
      onSuccess?.(); // dialog closes itself; standalone page could navigate instead
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
      setFieldErrors(parsed.fields);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col px-8 py-5 gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name:</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Category:</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            autoComplete="category"
            required
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Description:</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoComplete="description"
            required
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Photo:</Label>
          <Input
            id="photo"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            autoComplete="photo"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
          )}
        </div>
      </div>
      <Button type="submit" className="w-full">
        Add Item
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
