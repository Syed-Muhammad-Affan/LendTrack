import { useAuth } from "../../hooks/useAuth";


export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main className="mx-auto mt-16 max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Welcome, {user?.name}</h1>
      <p className="mt-2">Plan: {user?.plan}</p>

      {/* logout() clears the user, so ProtectedRoute redirects to /login automatically */}
      <button onClick={logout} className="mt-6 rounded border px-4 py-2">
        Log out
      </button>
    </main>
  );
}