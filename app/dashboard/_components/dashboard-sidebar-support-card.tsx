"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";

export function DashboardSidebarSupportCard() {
  const { isMobile, state } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  if (isCollapsed) {
    return null;
  }

  return (
    <Card className="bg-background py-4 shadow-none">
      <CardHeader className="gap-1 px-4">
        <CardTitle className="text-sm">Sunshine Bay Retreat</CardTitle>
        <CardDescription>CRM nội bộ cho lead, analytics, follow-up và call bot.</CardDescription>
      </CardHeader>
    </Card>
  );
}
