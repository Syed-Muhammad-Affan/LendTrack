import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { parseApiError } from "../../lib/apiError";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../@/components/ui/card";
import { Button, buttonVariants } from "../../../@/components/ui/button";
import { Input } from "../../../@/components/ui/input";
import { Label } from "../../../@/components/ui/label";
import { Container } from "@/customDiv/container";
import { cn } from "../../../@/lib/utils";

export default function RegisterPage() {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Client-side checks for instant feedback. Match these to your backend's register rules.
    if (password.length < 8) {
      setFieldErrors({ password: "Password must be at least 8 characters" });
      return;
    }
    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      await register(name.trim(), email.trim(), password);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
      setFieldErrors(parsed.fields);
    }
  };

  return (
    <section>
      <Container className="py-28">
        <Card className="w-full max-w-sm [--card-spacing:--spacing(8)]">
          <CardHeader>
            <CardTitle>Register your account</CardTitle>
            <CardDescription>
              Enter your details below to create an account.
            </CardDescription>
            <CardAction>
              <Link
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "cursor-pointer",
                )}
                to="/login"
              >
                Log In
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form id="login-form" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    placeholder="John Doe"
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm leading-3.5 px-8 text-red-600">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    placeholder="m@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm leading-3.5 px-8 text-red-600">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  {fieldErrors.password && (
                    <p className="mt-1 text-sm leading-3.5 px-8 text-red-600">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-sm leading-3.5 px-8 text-red-600">
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </CardContent>

          {error && (
            <p className="text-sm px-8 leading-3.5 text-red-600">{error}</p>
          )}

          <CardFooter className="flex-col gap-2">
            <Button type="submit" form="login-form" className="w-full">
              Register
            </Button>
          </CardFooter>
        </Card>
      </Container>
    </section>
  );
}
