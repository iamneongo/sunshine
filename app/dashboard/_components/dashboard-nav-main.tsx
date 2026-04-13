"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar";
import { dashboardSidebarGroups, type DashboardNavMainItem } from "./dashboard-sidebar-config";

function isActivePath(pathname: string, url: string, subItems?: DashboardNavMainItem["subItems"]) {
  if (subItems?.length) {
    return subItems.some((subItem) => pathname.startsWith(subItem.url));
  }

  if (url === "/dashboard/leads" && pathname.startsWith("/dashboard/leads/")) {
    return true;
  }

  if (url === "/dashboard/analytics" && pathname.startsWith("/dashboard/events/")) {
    return true;
  }

  return pathname === url;
}

function isSubmenuOpen(pathname: string, subItems?: DashboardNavMainItem["subItems"]) {
  return subItems?.some((subItem) => pathname.startsWith(subItem.url)) ?? false;
}

function NavItemExpanded({
  item,
  pathname
}: {
  item: DashboardNavMainItem;
  pathname: string;
}) {
  const active = isActivePath(pathname, item.url, item.subItems);

  return (
    <Collapsible asChild defaultOpen={isSubmenuOpen(pathname, item.subItems)} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          {item.subItems ? (
            <SidebarMenuButton isActive={active} tooltip={item.title}>
              {item.icon ? <item.icon /> : null}
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
              <Link href={item.url}>
                {item.icon ? <item.icon /> : null}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          )}
        </CollapsibleTrigger>

        {item.subItems ? (
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.subItems.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild isActive={isActivePath(pathname, subItem.url)}>
                    <Link href={subItem.url}>
                      {subItem.icon ? <subItem.icon /> : null}
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        ) : null}
      </SidebarMenuItem>
    </Collapsible>
  );
}

function NavItemCollapsed({
  item,
  pathname
}: {
  item: DashboardNavMainItem;
  pathname: string;
}) {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton tooltip={item.title} isActive={isActivePath(pathname, item.url, item.subItems)}>
            {item.icon ? <item.icon /> : null}
            <span>{item.title}</span>
            <ChevronRight />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52 space-y-1" side="right" align="start">
          {item.subItems?.map((subItem) => (
            <DropdownMenuItem key={subItem.title} asChild>
              <SidebarMenuSubButton asChild className="focus-visible:ring-0" isActive={isActivePath(pathname, subItem.url)}>
                <Link href={subItem.url}>
                  {subItem.icon ? <subItem.icon className="[&>svg]:text-sidebar-foreground" /> : null}
                  <span>{subItem.title}</span>
                </Link>
              </SidebarMenuSubButton>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

export function DashboardNavMain() {
  const pathname = usePathname();
  const { isMobile, state } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  return (
    <>
      {dashboardSidebarGroups.map((group) => (
        <SidebarGroup key={group.id}>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {group.items.map((item) => {
                if (isCollapsed && item.subItems?.length) {
                  return <NavItemCollapsed key={item.title} item={item} pathname={pathname} />;
                }

                return <NavItemExpanded key={item.title} item={item} pathname={pathname} />;
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
