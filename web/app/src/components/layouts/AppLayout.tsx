// components/layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "../../../@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ThemeToggle } from "../themeToggle";
import { TransactionButton } from "./TransactionButton";
// import { useAuth } from "@/hooks/useAuth";

export function AppLayout() {
  //   const { user } = useAuth();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b px-4">
          <SidebarTrigger />
          <div className=" flex items-center gap-5">
            <ThemeToggle />
            <TransactionButton />
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
