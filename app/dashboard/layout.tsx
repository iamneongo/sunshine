import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DashboardNav } from "./_components/dashboard-nav";
import { dashboardButtonClasses } from "./_components/dashboard-ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | Sunshine Bay Retreat"
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden border-r border-slate-200 bg-white lg:block">
          <div className="sticky top-0 flex h-screen flex-col px-6 py-6">
            <div className="pb-8">
              <div className="text-lg font-black tracking-tight text-slate-950">Sunshine Bay Retreat</div>
            </div>

            <div className="space-y-2">
              <DashboardNav />
            </div>
          </div>
        </aside>

        <div className="min-w-0 bg-slate-50">
          <div className="border-b border-slate-200 bg-white lg:hidden">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <div className="truncate text-base font-black tracking-tight text-slate-950 sm:text-lg">Sunshine Bay Retreat</div>
              </div>
              <DashboardNav mobile />
            </div>
          </div>

          <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mb-5 flex justify-end">
              <form action="/api/auth/logout" method="post">
                <button type="submit" className={dashboardButtonClasses("outline")}>
                  Đăng xuất
                </button>
              </form>
            </div>

            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
