import Link from "next/link";
import type { ReactNode } from "react";
import type { getDashboardSnapshot } from "@/lib/dashboard-data";
import { Badge, type BadgeProps } from "@/components/reui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type DashboardSnapshot = Awaited<ReturnType<typeof getDashboardSnapshot>>;
export type DashboardLead = DashboardSnapshot["recentLeads"][number];
export type DashboardEvent = DashboardSnapshot["recentEvents"][number];
export type BreakdownItem = DashboardSnapshot["sourceBreakdown"][number];

export const dashboardNavItems = [
  {
    href: "/dashboard/overview",
    label: "Tổng quan",
    shortLabel: "Tổng quan"
  },
  {
    href: "/dashboard/leads",
    label: "Lead",
    shortLabel: "Lead"
  },
  {
    href: "/dashboard/analytics",
    label: "Phân tích",
    shortLabel: "Phân tích"
  },
  {
    href: "/dashboard/follow-up",
    label: "Follow-up",
    shortLabel: "Follow-up"
  },
  {
    href: "/dashboard/maintenance",
    label: "Bảo trì",
    shortLabel: "Bảo trì"
  }
] as const;

const dashboardPageMeta = {
  overview: {
    title: "Tổng quan",
    description: "Xem nhanh nhịp lead, trạng thái và activity mới nhất."
  },
  leads: {
    title: "Lead",
    description: "Lọc, xem chi tiết và xử lý lead theo đúng nhóm khách."
  },
  analytics: {
    title: "Phân tích",
    description: "Theo dõi chat, form và hành vi phát sinh trong ngày."
  },
  followUp: {
    title: "Follow-up",
    description: "Ưu tiên nhóm lead cần gọi lại, gửi Zalo hoặc chốt lịch."
  },
  maintenance: {
    title: "Bảo trì",
    description: "Kiểm tra dữ liệu và thao tác dọn dẹp có xác nhận."
  },
  leadDetail: {
    title: "Chi tiết lead",
    description: "Xem hồ sơ lead, lịch sử và thao tác xử lý tiếp theo."
  },
  eventDetail: {
    title: "Chi tiết event",
    description: "Đọc lại event, nguồn phát sinh và dữ liệu liên quan."
  }
} as const;

export function isDashboardNavItemActive(pathname: string, href: (typeof dashboardNavItems)[number]["href"]) {
  if (pathname === href) {
    return true;
  }

  if (href === "/dashboard/leads" && pathname.startsWith("/dashboard/leads/")) {
    return true;
  }

  if (href === "/dashboard/analytics" && pathname.startsWith("/dashboard/events/")) {
    return true;
  }

  return href !== "/dashboard/overview" && pathname.startsWith(`${href}/`);
}

export function getDashboardPageMeta(pathname: string) {
  if (pathname.startsWith("/dashboard/leads/")) {
    return dashboardPageMeta.leadDetail;
  }

  if (pathname.startsWith("/dashboard/events/")) {
    return dashboardPageMeta.eventDetail;
  }

  if (pathname.startsWith("/dashboard/leads")) {
    return dashboardPageMeta.leads;
  }

  if (pathname.startsWith("/dashboard/analytics")) {
    return dashboardPageMeta.analytics;
  }

  if (pathname.startsWith("/dashboard/follow-up")) {
    return dashboardPageMeta.followUp;
  }

  if (pathname.startsWith("/dashboard/maintenance")) {
    return dashboardPageMeta.maintenance;
  }

  return dashboardPageMeta.overview;
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ScrollAreaVariant = "card" | "table";

export function dashboardScrollAreaClasses(variant: ScrollAreaVariant = "card") {
  return cn(
    "overscroll-contain pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.8)_transparent] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300/85 [&::-webkit-scrollbar-track]:bg-transparent",
    variant === "card" && "max-h-[340px] overflow-y-auto sm:max-h-[380px] lg:max-h-[440px] xl:max-h-[540px]",
    variant === "table" && "max-h-[56svh] overflow-auto sm:max-h-[60vh] xl:max-h-[66vh]"
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

const dashboardEventCopy = {
  chatbot_welcome_shown: {
    label: "Hiển thị lời chào chatbot",
    description: "Khách vừa nhìn thấy lời chào mở đầu của chatbot."
  },
  chatbot_opened: {
    label: "Mở khung chat",
    description: "Khách mở chatbot để bắt đầu xem thông tin."
  },
  chatbot_closed: {
    label: "Đóng khung chat",
    description: "Khách vừa đóng chatbot sau khi tương tác."
  },
  chatbot_activity: {
    label: "Tương tác trong chatbot",
    description: "Có thao tác mới phát sinh bên trong chatbot."
  },
  chatbot_reply_rendered: {
    label: "Hiển thị phản hồi chatbot",
    description: "Hệ thống vừa hiển thị một câu trả lời mới cho khách."
  },
  chatbot_intent_selected: {
    label: "Chọn nhóm thông tin quan tâm",
    description: "Khách vừa chọn nội dung muốn xem trước trong chatbot."
  },
  chatbot_budget_selected: {
    label: "Chọn khung tài chính",
    description: "Khách đã chọn khoảng ngân sách đang quan tâm."
  },
  chatbot_need_selected: {
    label: "Chọn nhu cầu quan tâm",
    description: "Khách đã cho biết nhu cầu chính như đầu tư, ở hoặc nghỉ dưỡng."
  },
  chatbot_contact_submitted: {
    label: "Gửi thông tin liên hệ trong chat",
    description: "Khách đã để lại thông tin liên hệ qua chatbot."
  },
  landing_lead_form_submitted: {
    label: "Gửi form để lại thông tin",
    description: "Khách gửi form để nhận bảng giá, video hoặc tài liệu liên quan."
  },
  landing_cta_clicked: {
    label: "Bấm nút kêu gọi hành động",
    description: "Khách vừa bấm một nút CTA trên landing page."
  },
  dashboard_lead_updated: {
    label: "Cập nhật hồ sơ lead",
    description: "Admin vừa chỉnh sửa thông tin lead trong dashboard."
  },
  dashboard_call_bot_triggered: {
    label: "Đẩy lead sang call bot",
    description: "Lead đã được gửi sang hệ thống gọi tự động."
  }
} satisfies Record<string, { label: string; description: string }>;

const dashboardEventTokenLabels: Record<string, string> = {
  chatbot: "chatbot",
  landing: "landing page",
  dashboard: "dashboard",
  system: "hệ thống",
  lead: "lead",
  form: "form",
  submitted: "đã gửi",
  updated: "đã cập nhật",
  call: "cuộc gọi",
  bot: "bot",
  triggered: "được kích hoạt",
  opened: "đã mở",
  closed: "đã đóng",
  welcome: "lời chào",
  shown: "hiển thị",
  reply: "phản hồi",
  rendered: "được hiển thị",
  activity: "tương tác",
  clicked: "được bấm",
  selected: "đã chọn",
  viewed: "đã xem",
  started: "bắt đầu",
  completed: "hoàn tất",
  price: "bảng giá",
  video: "video",
  legal: "pháp lý",
  phone: "số điện thoại",
  zalo: "zalo",
  name: "tên",
  need: "nhu cầu",
  budget: "ngân sách",
  visit: "lịch xem",
  callback: "gọi lại"
};

export function getLeadSourceLabel(source: DashboardLead["source"]): string {
  return leadSourceLabels[source] ?? source;
}

function titleCaseVietnamese(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getDashboardEventLabel(name: string): string {
  const normalizedName = name.trim();

  if (!normalizedName) {
    return "Hoạt động hệ thống";
  }

  const predefined = dashboardEventCopy[normalizedName as keyof typeof dashboardEventCopy];

  if (predefined) {
    return predefined.label;
  }

  const translated = normalizedName
    .split(/[_-]+/)
    .map((token) => dashboardEventTokenLabels[token] ?? token)
    .join(" ")
    .trim();

  return titleCaseVietnamese(translated || normalizedName.replace(/[_-]+/g, " "));
}

export function getDashboardEventDescription(name: string): string {
  const normalizedName = name.trim();
  const predefined = dashboardEventCopy[normalizedName as keyof typeof dashboardEventCopy];

  if (predefined) {
    return predefined.description;
  }

  return "Hoạt động phát sinh từ landing page, chatbot hoặc thao tác trong dashboard.";
}

export function getDashboardEventSummary(name: string, summary: string): string {
  return summary === "Không có metadata bổ sung" ? getDashboardEventDescription(name) : summary;
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
    "inline-flex min-h-10 items-center justify-center rounded-xl border px-3.5 py-2.5 text-sm font-semibold tracking-tight transition focus:outline-none focus:ring-2 focus:ring-slate-300/70 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4",
    variant === "default" && "border-slate-950 bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.14)] hover:border-slate-800 hover:bg-slate-800",
    variant === "outline" && "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950",
    variant === "secondary" && "border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300 hover:bg-slate-200",
    variant === "dark" && "border-slate-800 bg-slate-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)] hover:bg-slate-800"
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
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg border px-2.5 py-1 text-[11px] font-semibold leading-none tracking-tight sm:px-3",
        variant === "default" && "border-slate-300 bg-white text-slate-700",
        variant === "muted" && "border-slate-200 bg-slate-50 text-slate-600",
        variant === "positive" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        variant === "warning" && "border-amber-200 bg-amber-50 text-amber-700",
        variant === "dark" && "border-slate-800 bg-slate-900 text-white/90",
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

type DashboardPageIntroBadge = {
  label: ReactNode;
  variant?: BadgeProps["variant"];
};

type DashboardPageIntroProps = PageHeaderProps & {
  badges?: DashboardPageIntroBadge[];
  className?: string;
};

export function DashboardPageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div className="max-w-4xl">
        <h1 className="text-[1.95rem] font-black leading-tight tracking-[-0.03em] text-slate-950 sm:text-[2.35rem] lg:text-[2.8rem]">
          {title}
        </h1>
        {description ? <p className="mt-2 text-slate-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2.5 xl:justify-end">{actions}</div> : null}
    </div>
  );
}

export function DashboardPageIntro({ eyebrow, title, description, badges, actions, className }: DashboardPageIntroProps) {
  return (
    <Card className={cn("border-border/80 shadow-sm", className)}>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-3">
            {eyebrow ? (
              <div className="text-muted-foreground text-[11px] font-semibold uppercase tracking-[0.22em]">{eyebrow}</div>
            ) : null}
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</CardTitle>
              {description ? <CardDescription className="max-w-3xl text-sm leading-6 sm:text-base">{description}</CardDescription> : null}
            </div>
            {badges && badges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                  <Badge key={`${String(badge.label)}-${index}`} variant={badge.variant ?? "primary-light"} radius="full" size="xl">
                    {badge.label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>

          {actions ? <div className="flex flex-wrap gap-2 xl:justify-end">{actions}</div> : null}
        </div>
      </CardHeader>
    </Card>
  );
}

type SurfaceCardProps = {
  className?: string;
  children: ReactNode;
};

export function DashboardSurfaceCard({ className = "", children }: SurfaceCardProps) {
  return (
    <article
      className={`rounded-[1.35rem] border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_18px_48px_rgba(15,23,42,0.06)] backdrop-blur ${className}`.trim()}
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
        "p-4 sm:p-5",
        href ? "group h-full border-slate-200 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_50px_rgba(15,23,42,0.1)]" : ""
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="max-w-[14ch] text-[11px] font-semibold uppercase leading-5 tracking-[0.18em] text-slate-500">
            {label}
          </div>
          <div className="mt-2.5 text-3xl font-black tracking-tight text-slate-950 sm:mt-3 sm:text-4xl">{value}</div>
        </div>
        <div
          className={`inline-flex h-11 w-11 items-center justify-center rounded-xl text-base text-white shadow-sm sm:h-12 sm:w-12 sm:text-lg ${tone}`}
        >
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
    <DashboardSurfaceCard className="p-4 sm:p-5 lg:p-6">
      <h2 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">{title}</h2>
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
              className="group block rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 transition hover:border-slate-300 hover:bg-white"
            >
              {content}
            </Link>
          ) : (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3">
              {content}
            </div>
          );
        })}
        {items.length === 0 ? <DashboardEmptyState message="Không có dữ liệu." /> : null}
      </div>
    </DashboardSurfaceCard>
  );
}

export function DashboardEmptyState({
  title = "Chưa có dữ liệu",
  message,
  icon,
  action,
  compact = false
}: {
  title?: string;
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-border bg-muted/40 text-sm text-muted-foreground",
        compact ? "px-4 py-4" : "px-5 py-5"
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {icon ? <div className="text-primary">{icon}</div> : null}
        <div className="space-y-1">
          <div className="font-medium text-foreground">{title}</div>
          <p className="leading-6">{message}</p>
          {action ? <div className="pt-1">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}
