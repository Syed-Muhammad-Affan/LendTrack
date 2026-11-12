import { useState } from "react";
import {
  ArrowLeft,
  Trash2,
  Calendar,
  Clock,
  Pencil,
  Mail,
  Phone,
  //   FileText,
  //   User,
} from "lucide-react";
import { contactsApi } from "@/api/endpoints/contact";
import { parseApiError } from "@/lib/apiError";
import { notifyDataChanged } from "@/lib/events";
import { useContact } from "../useContacts";
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
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@shadcn/components/ui/dialog";
import { AddContactForm } from "./AddContactForm";

export function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contact, isLoading, error } = useContact(id);

  const [actionError, setActionError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isLoading) {
    return (
      <Container className="py-12 text-center text-muted-foreground">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Loading contact details...</p>
        </div>
      </Container>
    );
  }

  if (error || !contact) {
    return (
      <Container className="py-12">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
          <p className="mb-4 text-red-600 dark:text-red-400">
            {error ?? "Contact not found"}
          </p>
          <Button variant="outline" onClick={() => navigate("/contacts")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to contacts
          </Button>
        </div>
      </Container>
    );
  }

  const handleDeleteConfirmed = async () => {
    setActionError(null);
    setIsBusy(true);
    try {
      await contactsApi.remove(contact.id);
      notifyDataChanged();
      setIsDeleteDialogOpen(false);
      navigate("/contacts", { replace: true });
    } catch (err) {
      setActionError(parseApiError(err).message);
      setIsBusy(false);
    }
  };

  const initial = contact.name ? contact.name.charAt(0).toUpperCase() : "?";

  return (
    <section>
      <Container className="py-8 gap-10">
        {/* Top Navigation */}
        <Link
          to="/contacts"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to contacts
        </Link>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Avatar Card */}
          <Card className="overflow-hidden md:col-span-1">
            <div className="flex h-64 md:h-80 w-full flex-col items-center justify-center bg-muted text-muted-foreground gap-3">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-background border-2 border-border text-foreground font-bold text-4xl shadow-sm">
                {initial}
              </div>
              <span className="text-sm font-medium text-foreground">
                {contact.name}
              </span>
            </div>
          </Card>

          {/* Details & Actions Card */}
          <Card className="md:col-span-2 flex flex-col justify-between">
            <CardHeader className="space-y-3 pb-4">
              <CardTitle className="text-2xl sm:text-3xl font-bold break-words">
                {contact.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {contact.email ? (
                    <div className="flex items-center gap-2 text-foreground">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <a
                        href={`mailto:${contact.email}`}
                        className="hover:underline truncate"
                      >
                        {contact.email}
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span>No email provided</span>
                    </div>
                  )}

                  {contact.phone ? (
                    <div className="flex items-center gap-2 text-foreground">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                      <a
                        href={`tel:${contact.phone}`}
                        className="hover:underline truncate"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>No phone provided</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Notes
                </h4>
                <p className="text-sm sm:text-base text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {contact.notes || "No notes available for this contact."}
                </p>
              </div>

              {/* Metadata Timestamps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border/60">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-4 w-4 text-muted-foreground/70" />
                  <span>
                    Created {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4 text-muted-foreground/70" />
                  <span>
                    Updated {new Date(contact.updatedAt).toLocaleDateString()}
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
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Edit Contact
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-lg">
                    <AddContactForm
                      contactId={contact.id}
                      defaultValues={{
                        name: contact.name,
                        email: contact.email,
                        phone: contact.phone,
                        notes: contact.notes,
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
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Contact
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
                          "{contact.name}"
                        </span>{" "}
                        from your contacts list.
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
                        className="bg-destructive text-destructive-foreground"
                      >
                        {isBusy ? "Deleting..." : "Delete Contact"}
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
