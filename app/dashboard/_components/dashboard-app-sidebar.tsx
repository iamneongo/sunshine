"use client";

import Link from "next/link";
import { Command } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { DashboardNavMain } from "./dashboard-nav-main";
import { DashboardNavUser } from "./dashboard-nav-user";

export function DashboardAppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { isMobile, state } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  return (
    <Sidebar {...props} variant="inset" collapsible="icon">
      <SidebarHeader className="border-b bg-sidebar px-2 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Sunshine Bay Retreat"
              className={isCollapsed ? "justify-center" : "min-w-0 rounded-xl"}
            >
              <Link href="/dashboard/overview" prefetch={false} className="min-w-0">
                <Command className="shrink-0" />
                {!isCollapsed ? (
                  <div className="min-w-0">
                    <span className="block truncate font-semibold text-base">Sunshine Bay Retreat</span>
                  </div>
                ) : null}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <DashboardNavMain />
      </SidebarContent>
      <SidebarFooter>
        <DashboardNavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
