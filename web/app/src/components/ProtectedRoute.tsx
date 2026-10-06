import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Container } from "@/customDiv/container";
import { Spinner } from "../../@/components/ui/spinner";

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <section>
        <Container className="flex-row py-24 justify-center items-center gap-2">
          <Spinner />
          Loading...
        </Container>
        ;
      </section>
    );
  }

  if (!user) {
    // remember where they were going so login can send them back
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
