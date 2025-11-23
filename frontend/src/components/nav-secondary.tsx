import * as React from "react"
import { type LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"; // ← Import Link for smooth routing

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  pathname,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
  pathname: string // ← Add this prop for active detection
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url // ← Compute active state
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  size="sm"
                  isActive={isActive} // ← Pass it here for highlighting
                  tooltip={isActive ? undefined : item.title} // Optional: Hide tooltip if active
                >
                  <Link to={item.url}> {/* ← Use Link instead of <a> */}
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}