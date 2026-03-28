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
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-[272px_minmax(0,1fr)] xl:grid-cols-[288px_minmax(0,1fr)]">
        <aside className="hidden border-r border-slate-200 bg-white lg:block">
          <div className="sticky top-0 flex h-screen flex-col px-5 py-5 xl:px-6 xl:py-6">
            <div className="pb-7">
              <div className="text-lg font-black tracking-tight text-slate-950">Sunshine Bay Retreat</div>
            </div>

            <div className="space-y-2">
              <DashboardNav />
            </div>
          </div>
        </aside>

        <div className="min-w-0 bg-slate-50">
          <div className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
              <div className="min-w-0 flex-1">
                <div className="truncate text-base font-black tracking-tight text-slate-950 sm:text-lg">Sunshine Bay Retreat</div>
              </div>
              <div className="flex items-center gap-2">
                <form action="/api/auth/logout" method="post" className="lg:hidden">
                  <button
                    type="submit"
                    className={`${dashboardButtonClasses("outline")} px-3 py-2 text-[10px] tracking-[0.14em]`}
                  >
                    Đăng xuất
                  </button>
                </form>
                <DashboardNav mobile />
              </div>
            </div>
          </div>

          <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="mb-5 hidden justify-end lg:flex">
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
