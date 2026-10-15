import { Navigate, Route, Routes } from "react-router-dom";
import { GuestRoute } from "./components/GuestRoute";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import DashboardPage from "./features/dashboard/DashboardPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ForgotPasswordPage from "./features/auth/ForgotPasswordPage";
import { AuthLayout } from "./components/layouts/AuthLayout";
import ResetPasswordPage from "./features/auth/ResetPasswordPage";
import { AppLayout } from "./components/layouts/AppLayout";
import { ItemsPageLayout } from "./features/items/ItemsPageLayout";

export default function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* <Route path="/loans" element={<LoanListPage />} /> */}
          <Route path="/items" element={<ItemsPageLayout />} />
          {/* <Route path="/contacts" element={<ContactListPage />} /> */}
          {/* <Route path="/reminders" element={<ReminderLogPage />} /> */}
          {/* <Route path="/settings/billing" element={<BillingSettingsPage />} /> */}
        </Route>
        {/* later: /loans, /items, /contacts, /settings/billing all go here */}
      </Route>

      {/* anything else: logged-in users land on the dashboard, logged-out users get bounced to /login */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
