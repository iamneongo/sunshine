import type { ReactNode } from "react";
import { DashboardNav } from "./_components/dashboard-nav";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden border-r border-slate-200 bg-white lg:block">
          <div className="sticky top-0 flex h-screen flex-col px-6 py-6">
            <div className="pb-8">
              <div className="text-lg font-black tracking-tight text-slate-950">Sunshine Bay Retreat</div>
              <div className="mt-1 text-sm text-slate-500">Dashboard</div>
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
                <div className="mt-0.5 text-xs text-slate-500">Dashboard</div>
              </div>
              <DashboardNav mobile />
            </div>
          </div>

          <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
