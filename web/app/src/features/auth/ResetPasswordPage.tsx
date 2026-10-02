import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authApi } from "../../api/endpoints/auth";
import { parseApiError } from "../../lib/apiError";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../@/components/ui/card";
import { Button } from "../../../@/components/ui/button";
import { Input } from "../../../@/components/ui/input";
import { Label } from "../../../@/components/ui/label";
import { Container } from "@/customDiv/container";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("This reset link is invalid or has expired.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <section>
        <Container className="py-28">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Password updated</CardTitle>
              <CardDescription>Redirecting you to login...</CardDescription>
            </CardHeader>
          </Card>
        </Container>
      </section>
    );
  }

  return (
    <section>
      <Container className="py-28">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>
              Enter a new password for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="reset-password-form" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </form>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              form="reset-password-form"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update password"}
            </Button>
          </CardFooter>
        </Card>
      </Container>
    </section>
  );
}
