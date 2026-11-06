import { useState } from "react";
import {
  ArrowLeft,
  Archive,
  ArchiveRestore,
  Trash2,
  Calendar,
  Box,
  Clock,
  Pencil,
} from "lucide-react";
import { itemsApi } from "@/api/endpoints/items";
import { parseApiError } from "@/lib/apiError";
import { notifyDataChanged } from "@/lib/events";
import { useItem } from "../useItems";
import { Container } from "@/customDiv/container";
import { Link, useNavigate, useParams } from "react-router-dom";

// Standard UI Components
import { Button } from "@shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shadcn/components/ui/card";

// shadcn AlertDialog Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@shadcn/components/ui/alert-dialog";
import { Badge } from "@shadcn/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@shadcn/components/ui/dialog";
import { AddItemForm } from "./AddItemForm";

export function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { item, isLoading, error } = useItem(id);

  const [actionError, setActionError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isLoading) {
    return (
      <Container className="py-12 text-center text-muted-foreground">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Loading item details...</p>
        </div>
      </Container>
    );
  }

  if (error || !item) {
    return (
      <Container className="py-12">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
          <p className="mb-4 text-red-600 dark:text-red-400">
            {error ?? "Item not found"}
          </p>
          <Button variant="outline" onClick={() => navigate("/items")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to items
          </Button>
        </div>
      </Container>
    );
  }

  // const handleUpdateItem = async () => {
  //   setActionError(null)
  //   setIsBusy(true);

  // }

  const toggleArchive = async () => {
    setActionError(null);
    setIsBusy(true);
    try {
      await itemsApi.update(item.id, { isArchived: !item.isArchived });
      notifyDataChanged();
    } catch (err) {
      setActionError(parseApiError(err).message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    setActionError(null);
    setIsBusy(true);
    try {
      await itemsApi.remove(item.id);
      notifyDataChanged();
      setIsDeleteDialogOpen(false);
      navigate("/items", { replace: true });
    } catch (err) {
      setActionError(parseApiError(err).message);
      setIsBusy(false);
    }
  };

  const hasPhoto = Boolean(
    item.photo && item.photo.trim() !== "" && item.photo !== "string",
  );

  return (
    <section>
      <Container className="py-8 gap-10">
        {/* Top Navigation */}
        <Link
          to="/items"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to items
        </Link>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Item Photo / Icon Card */}
          <Card className="overflow-hidden md:col-span-1">
            {hasPhoto ? (
              <img
                src={item.photo}
                alt={item.name}
                className="h-64 w-full object-cover md:h-80"
              />
            ) : (
              <div className="flex h-64 md:h-80 w-full flex-col items-center justify-center bg-muted text-muted-foreground gap-2">
                <Box className="h-12 w-12 stroke-1" />
                <span className="text-xs">No image provided</span>
              </div>
            )}
          </Card>

          {/* Details & Actions Card */}
          <Card className="md:col-span-2 flex flex-col justify-between">
            <CardHeader className="space-y-3 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="secondary" className="text-xs font-semibold">
                  {item.category}
                </Badge>
                {item.isArchived && (
                  <Badge
                    variant="outline"
                    className="border-amber-500/30 text-amber-500 bg-amber-500/10 gap-1"
                  >
                    <Archive className="h-3 w-3" />
                    Archived
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold break-words">
                {item.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Description
                </h4>
                <p className="text-sm sm:text-base text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {item.description ||
                    "No description available for this item."}
                </p>
              </div>

              {/* Metadata Timestamps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border/60">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-4 w-4 text-muted-foreground/70" />
                  <span>
                    Added {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4 text-muted-foreground/70" />
                  <span>
                    Updated {new Date(item.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {actionError && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {actionError}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/60">
                <Button
                  variant="outline"
                  disabled={isBusy}
                  onClick={toggleArchive}
                  className="flex-1 sm:flex-none cursor-pointer"
                >
                  {item.isArchived ? (
                    <>
                      <ArchiveRestore className="mr-2 h-4 w-4" /> Unarchive
                    </>
                  ) : (
                    <>
                      <Archive className="mr-2 h-4 w-4" /> Archive
                    </>
                  )}
                </Button>

                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Edit Item
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-lg">
                    <AddItemForm
                      itemId={item.id}
                      defaultValues={{
                        name: item.name,
                        category: item.category,
                        description: item.description,
                        photo: item.photo,
                      }}
                      onSuccess={() => setIsEditOpen(false)}
                    />
                  </DialogContent>
                </Dialog>

                {/* Delete Confirmation Alert Dialog */}
                <AlertDialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      disabled={isBusy}
                      className="flex-1 sm:flex-none cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Item
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete{" "}
                        <span className="font-semibold text-foreground">
                          "{item.name}"
                        </span>{" "}
                        from your inventory.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel
                        disabled={isBusy}
                        variant="outline"
                        size="default"
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        disabled={isBusy}
                        variant="destructive"
                        size="default"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.preventDefault();
                          handleDeleteConfirmed();
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isBusy ? "Deleting..." : "Delete Item"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
