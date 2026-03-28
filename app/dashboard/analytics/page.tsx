import Link from "next/link";
import { getDashboardSnapshot } from "@/lib/dashboard-data";
import {
  DashboardBadge,
  DashboardBreakdownCard,
  DashboardEmptyState,
  DashboardPageHeader,
  DashboardSurfaceCard,
  dashboardButtonClasses,
  dashboardScrollAreaClasses,
  formatDateTime
} from "../_components/dashboard-ui";

export const dynamic = "force-dynamic";

type DashboardAnalyticsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function buildAnalyticsHref(filters: { event: string; source: string }, overrides: Partial<{ event: string; source: string }>) {
  const next = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (next.event) {
    params.set("event", next.event);
  }

  if (next.source) {
    params.set("source", next.source);
  }

  const query = params.toString();
  return query ? `/dashboard/analytics?${query}` : "/dashboard/analytics";
}

export default async function DashboardAnalyticsPage({ searchParams }: DashboardAnalyticsPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const filters = {
    event: getSingleValue(params?.event).trim(),
    source: getSingleValue(params?.source).trim()
  };

  const snapshot = await getDashboardSnapshot({
    leadLimit: 500,
    eventLimit: 700,
    recentLeadLimit: 20,
    recentEventLimit: 20
  });
  const maxTrend = Math.max(...snapshot.leadTrend.map((item) => item.value), 1);
  const filteredEvents = snapshot.allEvents.filter((event) => {
    if (filters.event && event.name !== filters.event) {
      return false;
    }

    if (filters.source && event.source !== filters.source) {
      return false;
    }

    return true;
  });
  const hasFilters = Boolean(filters.event || filters.source);

  const breakdownCards = [
    {
      eyebrow: "Kênh vào lead",
      title: "Theo nguồn",
      items: snapshot.sourceBreakdown,
      barClassName: "bg-[linear-gradient(90deg,#f59e0b_0%,#f97316_100%)]",
      getHref: (item: (typeof snapshot.sourceBreakdown)[number]) => `/dashboard/leads?source=${encodeURIComponent(item.label)}`
    },
    {
      eyebrow: "Ý định chính",
      title: "Theo nhu cầu",
      items: snapshot.needBreakdown,
      barClassName: "bg-[linear-gradient(90deg,#0f172a_0%,#475569_100%)]",
      getHref: (item: (typeof snapshot.needBreakdown)[number]) => `/dashboard/leads?need=${encodeURIComponent(item.label)}`
    },
    {
      eyebrow: "Khả năng tài chính",
      title: "Theo ngân sách",
      items: snapshot.budgetBreakdown,
      barClassName: "bg-[linear-gradient(90deg,#2563eb_0%,#06b6d4_100%)]",
      getHref: (item: (typeof snapshot.budgetBreakdown)[number]) => `/dashboard/leads?budget=${encodeURIComponent(item.label)}`
    },
    {
      eyebrow: "Nhiệt độ lead",
      title: "Theo độ nóng",
      items: snapshot.hotnessBreakdown,
      barClassName: "bg-[linear-gradient(90deg,#dc2626_0%,#f59e0b_100%)]",
      getHref: (item: (typeof snapshot.hotnessBreakdown)[number]) => `/dashboard/leads?hotness=${encodeURIComponent(item.label)}`
    },
    {
      eyebrow: "Mức độ xử lý",
      title: "Theo trạng thái",
      items: snapshot.statusBreakdown,
      barClassName: "bg-[linear-gradient(90deg,#059669_0%,#84cc16_100%)]",
      getHref: (item: (typeof snapshot.statusBreakdown)[number]) => `/dashboard/leads?status=${encodeURIComponent(item.label)}`
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <DashboardPageHeader

        title="Analytics"

        actions={
          <>
            <Link href="/dashboard/overview" className={dashboardButtonClasses("outline")}>
              Về overview
            </Link>
            <Link href="/dashboard/leads" className={dashboardButtonClasses()}>
              Xem lead table
            </Link>
          </>
        }
      />

      <DashboardSurfaceCard className="p-4 sm:p-5 xl:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Lọc activity cần xem</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <DashboardBadge>{filteredEvents.length} event</DashboardBadge>
            {hasFilters ? <DashboardBadge variant="warning">Đang lọc analytics</DashboardBadge> : <DashboardBadge>Toàn bộ feed</DashboardBadge>}
          </div>
        </div>

        <form method="get" className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)_auto]">
          <label className="block">
            <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Tên event</div>
            <select name="event" defaultValue={filters.event} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-slate-400">
              <option value="">Tất cả event</option>
              {snapshot.eventBreakdown.map((item) => (
                <option key={item.label} value={item.label}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Nguồn</div>
            <select name="source" defaultValue={filters.source} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-slate-400">
              <option value="">Tất cả nguồn</option>
              {Array.from(new Set(snapshot.allEvents.map((event) => event.source))).map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap gap-3 md:items-end">
            <button type="submit" className={dashboardButtonClasses()}>
              Áp dụng
            </button>
            {hasFilters ? (
              <Link href="/dashboard/analytics" className={dashboardButtonClasses("outline")}>
                Xóa lọc
              </Link>
            ) : null}
          </div>
        </form>
      </DashboardSurfaceCard>

      <section className="grid gap-5 2xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] xl:gap-6">
        <DashboardSurfaceCard className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">7 ngày gần đây</h2>
            </div>
          </div>

          <div className="mt-6 space-y-3 sm:hidden">
            {snapshot.leadTrend.map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-slate-600">{item.label}</span>
                  <span className="font-black text-slate-950">{item.value}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#f59e0b_0%,#f97316_100%)]"
                    style={{ width: `${Math.max((item.value / maxTrend) * 100, item.value > 0 ? 12 : 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 hidden overflow-x-auto pb-1 sm:block">
            <div className="grid min-w-[520px] grid-cols-7 gap-3">
              {snapshot.leadTrend.map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-3">
                  <div className="flex h-48 w-full items-end justify-center rounded-xl bg-slate-50 px-3 py-4">
                    <div
                      className="w-full rounded-full bg-[linear-gradient(180deg,#f59e0b_0%,#f97316_100%)] transition-all"
                      style={{ height: `${Math.max((item.value / maxTrend) * 100, item.value > 0 ? 12 : 4)}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-slate-950">{item.value}</div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DashboardSurfaceCard>

        <DashboardSurfaceCard className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Sự kiện nổi bật</h2>
            </div>
            {hasFilters ? <DashboardBadge variant="warning">Đang lọc</DashboardBadge> : null}
          </div>
          <div className={`mt-6 space-y-3 ${dashboardScrollAreaClasses("card")}`}>
            {snapshot.eventBreakdown.slice(0, 8).map((item) => (
              <Link key={item.label} href={buildAnalyticsHref(filters, { event: item.label })} className="block rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 transition hover:border-slate-300 hover:bg-white">
                <div className="mb-2 flex items-start justify-between gap-4 text-sm">
                  <span className="font-semibold text-slate-600">{item.label}</span>
                  <span className="shrink-0 font-black text-slate-950">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-[linear-gradient(90deg,#fbbf24_0%,#f97316_100%)]" style={{ width: `${item.share}%` }} />
                </div>
              </Link>
            ))}

            {snapshot.eventBreakdown.length === 0 ? (
              <DashboardEmptyState message="Chưa có event analytics nào. Khi khách mở chat, bấm quick action hoặc submit form, dữ liệu sẽ hiện ở đây." />
            ) : null}
          </div>
        </DashboardSurfaceCard>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3 xl:gap-6">
        {breakdownCards.map((group) => (
          <DashboardBreakdownCard key={group.title} {...group} />
        ))}
      </section>

      <DashboardSurfaceCard className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Hoạt động gần đây</h2>
          </div>
          {hasFilters ? (
            <Link href="/dashboard/analytics" className={dashboardButtonClasses("outline")}>
              Xóa lọc
            </Link>
          ) : null}
        </div>
        <div className={`mt-6 space-y-3 ${dashboardScrollAreaClasses("card")}`}>
          {filteredEvents.slice(0, 12).map((event) => (
            <Link key={event.id} href={`/dashboard/events/${event.id}`} className="block rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-sm font-black text-slate-950">{event.name}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{event.source}</div>
                </div>
                <div className="shrink-0 text-xs text-slate-500">{formatDateTime(event.createdAt)}</div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{event.summary}</p>
            </Link>
          ))}

          {filteredEvents.length === 0 ? <DashboardEmptyState message="Không có event phù hợp với bộ lọc hiện tại." /> : null}
        </div>
      </DashboardSurfaceCard>
    </div>
  );
}
