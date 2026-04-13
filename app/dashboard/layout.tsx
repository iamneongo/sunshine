import "./dashboard-globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { Geist_Mono, Manrope } from "next/font/google";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DashboardThemeBridge } from "./_components/dashboard-theme-bridge";
import { DashboardAppSidebar } from "./_components/dashboard-app-sidebar";
import { DashboardTopbar } from "./_components/dashboard-topbar";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope"
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono"
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | Sunshine Bay Retreat"
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";
  const dashboardBodyClassName = `${manrope.variable} ${geistMono.variable}`;

  return (
    <TooltipProvider>
      <DashboardThemeBridge bodyClassName={dashboardBodyClassName} />
      <div className={`${manrope.variable} ${geistMono.variable} dashboard-theme`}>
        <SidebarProvider
          defaultOpen={defaultOpen}
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 68)"
            } as React.CSSProperties
          }
        >
          <DashboardAppSidebar />
          <SidebarInset
            className={cn(
              "peer-data-[variant=inset]:border",
              "[html[data-content-layout=centered]_&>*]:mx-auto",
              "[html[data-content-layout=centered]_&>*]:w-full",
              "[html[data-content-layout=centered]_&>*]:max-w-screen-2xl"
            )}
          >
            <header
              className={cn(
                "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear",
                "sticky top-0 z-40 overflow-hidden rounded-t-[inherit] bg-background backdrop-blur-md"
              )}
            >
              <div className="flex w-full items-center justify-between px-4 lg:px-6">
                <DashboardTopbar />

                <form action="/api/auth/logout" method="post">
                  <Button variant="outline" size="sm">
                    <LogOut data-icon="inline-start" />
                    Đăng xuất
                  </Button>
                </form>
              </div>
            </header>
            <div className="h-full p-4 md:p-6">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  );
}
