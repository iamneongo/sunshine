"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn, dashboardNavItems } from "./dashboard-ui";

type DashboardNavProps = {
  mobile?: boolean;
};

export function DashboardNav({ mobile = false }: DashboardNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobile || !open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobile, open]);

  if (mobile) {
    return (
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-black uppercase tracking-[0.16em] text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          aria-expanded={open}
          aria-controls="dashboard-mobile-drawer"
        >
          <i className="fa-solid fa-bars text-[13px]"></i>
          Menu
        </button>

        <div className={cn("fixed inset-0 z-50 transition", open ? "pointer-events-auto" : "pointer-events-none")}>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className={cn(
              "absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-300",
              open ? "opacity-100" : "opacity-0"
            )}
          />

          <aside
            id="dashboard-mobile-drawer"
            className={cn(
              "absolute inset-y-0 left-0 flex w-[86vw] max-w-[320px] flex-col border-r border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] transition-transform duration-300",
              open ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5">
              <div className="min-w-0">
                <div className="truncate text-base font-black tracking-tight text-slate-950">Sunshine Bay Retreat</div>
                <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">Dashboard</div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                aria-label="Close menu"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <div className="grid gap-2">
                {dashboardNavItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-sm font-black transition",
                        isActive
                          ? "border-slate-900 bg-slate-950 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <nav className="hidden lg:grid lg:gap-2">
      {dashboardNavItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-xl border px-4 py-3 transition ${
              isActive
                ? "border-slate-900 bg-slate-950 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span className="block text-sm font-black">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
