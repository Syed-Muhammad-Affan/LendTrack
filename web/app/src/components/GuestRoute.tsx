import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Container } from "@/customDiv/container";
import { Spinner } from "../../@/components/ui/spinner";

export function GuestRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <section>
        <Container className="py-24">
          <Spinner />
          Loading...
        </Container>
        ;
      </section>
    );
  }

  if (user) {
    const from = (location.state as { from?: { pathname: string } } | null)
      ?.from?.pathname;
    return <Navigate to={from ?? "/dashboard"} replace />;
  }

  return <Outlet />;
}
