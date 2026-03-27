import type { ReactNode } from "react";
import Link from "next/link";
import type { getDashboardSnapshot } from "@/lib/dashboard-data";

export type DashboardSnapshot = Awaited<ReturnType<typeof getDashboardSnapshot>>;
export type DashboardLead = DashboardSnapshot["recentLeads"][number];
export type DashboardEvent = DashboardSnapshot["recentEvents"][number];
export type BreakdownItem = DashboardSnapshot["sourceBreakdown"][number];

export const dashboardNavItems = [
  {
    href: "/dashboard/overview",
    label: "Tổng quan",
    shortLabel: "Overview"
  },
  {
    href: "/dashboard/leads",
    label: "Leads",
    shortLabel: "Leads"
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    shortLabel: "Analytics"
  },
  {
    href: "/dashboard/follow-up",
    label: "Follow-up",
    shortLabel: "Follow-up"
  },
  {
    href: "/dashboard/maintenance",
    label: "Maintenance",
    shortLabel: "Maintenance"
  }
] as const;

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ScrollAreaVariant = "card" | "table";

export function dashboardScrollAreaClasses(variant: ScrollAreaVariant = "card") {
  return cn(
    "overscroll-contain pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.75)_transparent] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300/80 [&::-webkit-scrollbar-track]:bg-transparent",
    variant === "card" && "max-h-[360px] overflow-y-auto md:max-h-[440px] xl:max-h-[520px]",
    variant === "table" && "max-h-[68vh] overflow-auto"
  );
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

export function getLeadDisplayName(lead: DashboardLead): string {
  return lead.fullName || lead.phone || lead.zalo || "Lead mới";
}

const leadSourceLabels = {
  form: "Form",
  chatbot: "Chatbot",
  unknown: "Khác"
} satisfies Record<DashboardLead["source"], string>;

export function getLeadSourceLabel(source: DashboardLead["source"]): string {
  return leadSourceLabels[source] ?? source;
}

export function getLeadSourceTone(source: DashboardLead["source"]): string {
  if (source === "chatbot") {
    return "border-indigo-200 bg-indigo-50 text-indigo-700";
  }

  if (source === "form") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

export function getLeadPrimaryContact(lead: DashboardLead): string {
  return lead.phone || lead.zalo || lead.email || "Chưa có liên hệ";
}

function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, "");
}

export function buildLeadQuickActions(
  lead: DashboardLead
): Array<{ href: string; label: string; icon: string; external?: boolean }> {
  const actions: Array<{ href: string; label: string; icon: string; external?: boolean }> = [];
  const phone = normalizePhone(lead.phone);
  const zalo = normalizePhone(lead.zalo || lead.phone);
  const email = lead.email.trim();

  if (phone) {
    actions.push({ href: `tel:${phone}`, label: "Gọi", icon: "fa-phone" });
  }

  if (zalo) {
    actions.push({ href: `https://zalo.me/${zalo}`, label: "Zalo", icon: "fa-comments", external: true });
  }

  if (email) {
    actions.push({ href: `mailto:${email}`, label: "Email", icon: "fa-envelope" });
  }

  return actions;
}

export function getHotnessTone(hotness: string): string {
  if (hotness === "Nóng") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (hotness === "Ấm") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-600";
}

export function getStatusTone(status: string): string {
  if (status === "Đặt lịch" || status === "Đang chốt") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "Đã gửi thông tin" || status === "Đã gọi") {
    return "border-sky-200 bg-sky-50 text-sky-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-600";
}

export function getConnectionTone(source: string): string {
  if (source === "supabase") {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-100";
  }

  return "border-amber-400/25 bg-amber-500/10 text-amber-100";
}

export function getSystemState(
  snapshot: DashboardSnapshot,
  isUsingFallback: boolean
): { tone: string; title: string; message: string } {
  if (!snapshot.connection.supabaseConfigured) {
    return {
      tone: "border-sky-200 bg-sky-50 text-sky-900",
      title: "Đang chạy local fallback",
      message: "Dashboard đang đọc local JSON."
    };
  }

  if (isUsingFallback) {
    return {
      tone: "border-amber-200 bg-amber-50 text-amber-900",
      title: "Có nguồn đang fallback",
      message: "Ít nhất một nguồn đang đọc local JSON."
    };
  }

  return {
    tone: "border-emerald-200 bg-emerald-50 text-emerald-900",
    title: "Đang đọc dữ liệu live",
    message: "Lead và event đang đọc từ Supabase."
  };
}

export function getRecommendedFollowUp(lead: DashboardLead): string {
  if (lead.status === "Đặt lịch") {
    return "Xác nhận lại lịch xem dự án, vị trí và thời gian đi thực tế ngay trong hôm nay.";
  }

  if (lead.need === "Xem pháp lý") {
    return "Ưu tiên gửi pháp lý trước, sau đó chốt thêm một cuộc gọi xác minh nhu cầu.";
  }

  if (lead.hotness === "Nóng") {
    return "Gọi nhanh 2 phút hoặc gửi Zalo ngay để giữ nhịp chốt sale.";
  }

  if (lead.need === "Đầu tư") {
    return "Gửi danh sách căn giá tốt và nhấn mạnh biên độ tăng giá cùng khả năng cho thuê.";
  }

  return "Gửi bảng giá nội bộ trước, rồi chốt lại tài chính và nhu cầu cụ thể.";
}

type ButtonVariant = "default" | "outline" | "secondary" | "dark";

export function dashboardButtonClasses(variant: ButtonVariant = "default") {
  return cn(
    "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] transition focus:outline-none focus:ring-2 focus:ring-slate-300/70",
    variant === "default" && "bg-slate-950 text-white shadow-sm hover:bg-slate-800",
    variant === "outline" && "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100",
    variant === "secondary" && "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200",
    variant === "dark" && "border border-white/10 bg-white/10 text-white hover:bg-white/15"
  );
}

type BadgeVariant = "default" | "muted" | "positive" | "warning" | "dark";

export function DashboardBadge({
  children,
  variant = "muted",
  className
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em]",
        variant === "default" && "border-slate-300 bg-white text-slate-700",
        variant === "muted" && "border-slate-200 bg-slate-50 text-slate-600",
        variant === "positive" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        variant === "warning" && "border-amber-200 bg-amber-50 text-amber-700",
        variant === "dark" && "border-white/10 bg-white/10 text-white/80",
        className
      )}
    >
      {children}
    </span>
  );
}

type PageHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

export function DashboardPageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">{title}</h1>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

type SurfaceCardProps = {
  className?: string;
  children: ReactNode;
};

export function DashboardSurfaceCard({ className = "", children }: SurfaceCardProps) {
  return (
    <article
      className={`rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.06)] ${className}`.trim()}
    >
      {children}
    </article>
  );
}

type MetricCardProps = {
  label: string;
  value: number | string;
  note?: string;
  icon: string;
  tone: string;
  href?: string;
  actionLabel?: string;
};

export function DashboardMetricCard({ label, value, icon, tone, href }: MetricCardProps) {
  const content = (
    <DashboardSurfaceCard
      className={cn(
        "p-5",
        href ? "group h-full border-slate-200 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_36px_rgba(15,23,42,0.09)]" : ""
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">{label}</div>
          <div className="mt-3 text-4xl font-black tracking-tight text-slate-950">{value}</div>
        </div>
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl text-lg text-white shadow-sm ${tone}`}>
          <i className={`fa-solid ${icon}`}></i>
        </div>
      </div>
    </DashboardSurfaceCard>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}

type BreakdownCardProps = {
  eyebrow: string;
  title: string;
  items: BreakdownItem[];
  barClassName: string;
  getHref?: (item: BreakdownItem) => string | undefined;
};

export function DashboardBreakdownCard({ title, items, barClassName, getHref }: BreakdownCardProps) {
  return (
    <DashboardSurfaceCard className="p-5 sm:p-6">
      <h2 className="text-xl font-black tracking-tight text-slate-950">{title}</h2>
      <div className={cn("mt-5 space-y-3", dashboardScrollAreaClasses("card"))}>
        {items.slice(0, 6).map((item) => {
          const href = getHref?.(item);
          const content = (
            <>
              <div className="mb-2 flex items-start justify-between gap-4 text-sm">
                <span className="font-semibold text-slate-600">{item.label}</span>
                <span className="shrink-0 font-black text-slate-950">{item.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white">
                <div className={`h-full rounded-full ${barClassName}`} style={{ width: `${item.share}%` }} />
              </div>
            </>
          );

          return href ? (
            <Link
              key={item.label}
              href={href}
              className="group block rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 transition hover:border-slate-300 hover:bg-white"
            >
              {content}
            </Link>
          ) : (
            <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
              {content}
            </div>
          );
        })}
        {items.length === 0 ? <DashboardEmptyState message="Không có dữ liệu." /> : null}
      </div>
    </DashboardSurfaceCard>
  );
}

export function DashboardEmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 px-4 py-4 text-sm leading-6 text-slate-500">
      {message}
    </div>
  );
}
