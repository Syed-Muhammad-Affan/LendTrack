// components/layout/AppSidebar.tsx
import {
  LayoutDashboard,
  Package,
  Users,
  Handshake,
  Bell,
  CreditCard,
  SquareArrowRightExit,
  Settings,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "../../../@/components/ui/sidebar";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../../@/components/ui/button";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Items", url: "/items", icon: Package },
  { title: "Contacts", url: "/contacts", icon: Users },
];

const transactionItems = [
  { title: "Loans", url: "/loans", icon: Handshake },
  { title: "Reminders", url: "/reminders", icon: Bell },
];

const accountItems = [
  { title: "Billing", url: "/billing", icon: CreditCard },
  { title: "Setting", url: "/setting", icon: Settings },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <img src="/first-logo.svg" alt="LendTrack" className="w-7" />
          <span className="font-semibold">LendTrack</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="
                     data-[active=true]:bg-primary
                   data-[active=true]:text-white
                     data-[active=true]:font-semibold
                     "
                  >
                    <NavLink to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Transaction</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {transactionItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="
                     data-[active=true]:bg-primary
                   data-[active=true]:text-white
                     data-[active=true]:font-semibold
                     "
                  >
                    <NavLink to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account and Usage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="
                     data-[active=true]:bg-primary
                   data-[active=true]:text-white
                     data-[active=true]:font-semibold
                     "
                  >
                    <NavLink to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between px-2 py-1 text-sm gap-3">
          <span className="capitalize bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white">
            {user?.name?.charAt(0)}
          </span>
          <span className="truncate capitalize">{user?.name}</span>
          <Button variant="ghost" size="sm" onClick={logout}>
            <SquareArrowRightExit />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
