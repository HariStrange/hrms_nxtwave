"use client"

import * as React from "react";
import { useLocation } from "react-router-dom"; // Import for pathname
import {
  Building2,
  Command,
  LayoutDashboardIcon,
  LifeBuoy,
  Send,
  UserRoundIcon,
  Users,
} from "lucide-react";

import { useAuth } from "@/contexts/authContext";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Teams",
    url: "/teams",
    icon: Users,
  },
  {
    title: "Employees",
    url: "/employees",
    icon: UserRoundIcon,
  },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth(); // ← dynamic user data
  const location = useLocation(); // ← React Router hook for pathname
  const pathname = location.pathname; // ← Auto-updates on route changes

  return (
    <Sidebar
      {...props}
      // Remove top/h calc—now full h-svh from top:0 via parent
      className="h-full flex flex-col"
    >
      <SidebarHeader>
        <SidebarMenu >
          <SidebarMenuItem >
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-muted-foreground text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img src="https://res.cloudinary.com/dx5lg8mei/image/upload/v1763799381/evalloLogo_euz0j9.png" className="rounded-4xl" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.name || "Loading..."}
                  </span>
                  <span className="truncate text-xs">{user?.email || ""}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        <NavMain items={navItems} pathname={pathname} />
        <NavSecondary
          items={[
            { title: "Support", url: "#", icon: LifeBuoy },
            { title: "Feedback", url: "#", icon: Send },
          ]}
          className="mt-auto"
          pathname={pathname} // Pass if NavSecondary needs it too
        />
      </SidebarContent>

      {/* Footer User */}
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || "",
            email: user?.email || "",
            avatar: "https://res.cloudinary.com/dx5lg8mei/image/upload/v1763799381/evalloLogo_euz0j9.png",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}