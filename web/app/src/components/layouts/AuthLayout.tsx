import { Outlet } from "react-router-dom";
import { AuthPageHeader } from "./AuthPageHeader";

export function AuthLayout() {
  return (
    <div className="">
      <AuthPageHeader />
      <Outlet />
    </div>
  );
}
