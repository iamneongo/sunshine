"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getDashboardPageMeta } from "./dashboard-ui";

export function DashboardTopbar() {
  const pathname = usePathname();
  const meta = getDashboardPageMeta(pathname);

  return (
    <div className="flex items-center gap-1 lg:gap-2">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mx-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
      />
      <div className="min-w-0">
        <div className="truncate font-medium text-sm sm:text-base">{meta.title}</div>
        <div className="hidden truncate text-muted-foreground text-xs md:block">{meta.description}</div>
      </div>
    </div>
  );
}
