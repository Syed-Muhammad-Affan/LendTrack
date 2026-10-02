import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { parseApiError } from '../../lib/apiError';
// import { Container } from '../../customDiv/container';
// import { useApp } from '../../hooks/useApp';
import {  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle } from '../../../@/components/ui/card';
  import { Button, buttonVariants } from '../../../@/components/ui/button';
  import { Input } from '../../../@/components/ui/input';
  import { Label } from '../../../@/components/ui/label';
import { Container } from '@/customDiv/container';
import { ThemeToggle } from '@/components/themeToggle';
import { cn } from '../../../@/lib/utils';


export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    try {
      await login(email.trim(), password);
      // GuestRoute redirects to /dashboard once the user is set
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
      setFieldErrors(parsed.fields);
    }
  };

  return (

    <section>
      <Container className="flex-row  px-5 justify-between py-5">
       <div className='flex gap-5'>
        <img src="/first-logo.svg" alt="LendTrack Logo" className="w-10" />
       <h3 className={`text-primary`}>LendTrack</h3>
       </div>
       <ThemeToggle></ThemeToggle>
      </Container>
      <Container className="py-28">
      <Card className="w-full max-w-sm [--card-spacing:--spacing(8)]">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Link className={cn(buttonVariants({ variant: 'link' }), 'cursor-pointer')} to="/register">
           Sign Up
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
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
              {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password" required />
            {fieldErrors.password && <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>}
            </div>
          </div>
        </form>
      </CardContent>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <CardFooter className="flex-col gap-2">
        <Button type="submit" form="login-form" className="w-full">
          Login
        </Button>
      </CardFooter>
    </Card> 
    </Container>
    </section>  
  );
}