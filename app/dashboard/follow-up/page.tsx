import Link from "next/link";
import { getDashboardSnapshot } from "@/lib/dashboard-data";
import {
  DashboardEmptyState,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardSurfaceCard,
  buildLeadQuickActions,
  dashboardButtonClasses,
  dashboardScrollAreaClasses,
  formatDateTime,
  getHotnessTone,
  getLeadDisplayName,
  getRecommendedFollowUp,
  getStatusTone
} from "../_components/dashboard-ui";

export const dynamic = "force-dynamic";

export default async function DashboardFollowUpPage() {
  const snapshot = await getDashboardSnapshot({
    leadLimit: 500,
    eventLimit: 500,
    recentLeadLimit: 20,
    recentEventLimit: 16
  });
  const priorityLeads = snapshot.allLeads
    .filter((lead) => lead.hotness === "Nóng" || lead.status === "Đặt lịch" || lead.tags.includes("can_goi_ngay"))
    .slice(0, 10);

  const actionBuckets = [
    {
      label: "Cần gọi ngay",
      count: snapshot.allLeads.filter((lead) => lead.tags.includes("can_goi_ngay")).length,
      href: "/dashboard/leads?hotness=N%C3%B3ng"
    },
    {
      label: "Đang chờ lịch xem",
      count: snapshot.allLeads.filter((lead) => lead.status === "Đặt lịch").length,
      href: "/dashboard/leads?status=%C4%90%E1%BA%B7t+l%E1%BB%8Bch"
    },
    {
      label: "Đã gửi thông tin",
      count: snapshot.allLeads.filter((lead) => lead.status === "Đã gửi thông tin").length,
      href: "/dashboard/leads?status=%C4%90%C3%A3+g%E1%BB%ADi+th%C3%B4ng+tin"
    },
    {
      label: "Touchpoint mới",
      count: snapshot.overview.todayEvents,
      href: "/dashboard/analytics"
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <DashboardPageHeader

        title="Follow-up"

        actions={
          <>
            <Link href="/dashboard/leads" className={dashboardButtonClasses("outline")}>
              Xem lead table
            </Link>
            <Link href="/dashboard/analytics" className={dashboardButtonClasses()}>
              Xem analytics
            </Link>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          label="Lead ưu tiên"
          value={priorityLeads.length}
          note="Nhóm nóng, có lịch hoặc nên gọi trước"
          icon="fa-bolt"
          tone="bg-[linear-gradient(135deg,#0f172a_0%,#334155_100%)]"
          href="/dashboard/leads?hotness=N%C3%B3ng"
        />
        <DashboardMetricCard
          label="Đặt lịch"
          value={snapshot.allLeads.filter((lead) => lead.status === "Đặt lịch").length}
          note="Lead cần xác nhận lịch và hành trình đi xem"
          icon="fa-calendar-check"
          tone="bg-[linear-gradient(135deg,#059669_0%,#10b981_100%)]"
          href="/dashboard/leads?status=%C4%90%E1%BA%B7t+l%E1%BB%8Bch"
        />
        <DashboardMetricCard
          label="Đã gửi thông tin"
          value={snapshot.allLeads.filter((lead) => lead.status === "Đã gửi thông tin").length}
          note="Nhóm cần follow-up sau khi đã gửi tài liệu"
          icon="fa-paper-plane"
          tone="bg-[linear-gradient(135deg,#2563eb_0%,#06b6d4_100%)]"
          href="/dashboard/leads?status=%C4%90%C3%A3+g%E1%BB%ADi+th%C3%B4ng+tin"
        />
        <DashboardMetricCard
          label="Event mới hôm nay"
          value={snapshot.overview.todayEvents}
          note="Touchpoint phát sinh trong ngày hiện tại"
          icon="fa-wave-square"
          tone="bg-[linear-gradient(135deg,#f97316_0%,#f59e0b_100%)]"
          href="/dashboard/analytics"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
        <DashboardSurfaceCard className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Lead nên xử lý trước</h2>
            </div>
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600">
              {priorityLeads.length} lead ưu tiên
            </div>
          </div>

          <div className={`mt-6 space-y-4 ${dashboardScrollAreaClasses("card")}`}>
            {priorityLeads.length > 0 ? (
              priorityLeads.map((lead) => {
                const quickActions = buildLeadQuickActions(lead);

                return (
                  <div key={lead.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <Link href={`/dashboard/leads/${lead.id}`} className="text-sm font-black text-slate-950 hover:text-slate-700">
                          {getLeadDisplayName(lead)}
                        </Link>
                        <div className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                          {lead.need} • {lead.budget} • {lead.source}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${getHotnessTone(lead.hotness)}`}>
                          {lead.hotness}
                        </span>
                        <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${getStatusTone(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{getRecommendedFollowUp(lead)}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={`/dashboard/leads/${lead.id}`} className={dashboardButtonClasses()}>
                        Xem detail
                      </Link>
                      {quickActions.map((action) => (
                        <a
                          key={`${lead.id}-${action.label}`}
                          href={action.href}
                          target={action.external ? "_blank" : undefined}
                          rel={action.external ? "noreferrer" : undefined}
                          className={dashboardButtonClasses("outline")}
                        >
                          {action.label}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <DashboardEmptyState message="Chưa có lead đủ nóng để đưa vào queue ưu tiên." />
            )}
          </div>
        </DashboardSurfaceCard>

        <div className="grid gap-6">
          <DashboardSurfaceCard className="p-6">            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Đi tới đúng nhóm việc</h2>
            <div className="mt-6 space-y-3">
              {actionBuckets.map((item) => (
                <Link key={item.label} href={item.href} className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-600">{item.label}</span>
                    <span className="font-black text-slate-950">{item.count}</span>
                  </div>
                </Link>
              ))}
            </div>
          </DashboardSurfaceCard>

          <DashboardSurfaceCard className="p-6">            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Hoạt động gần đây</h2>
            <div className={`mt-6 space-y-4 ${dashboardScrollAreaClasses("card")}`}>
              {snapshot.recentEvents.slice(0, 10).map((event) => (
                <Link key={event.id} href={`/dashboard/events/${event.id}`} className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-sm font-black text-slate-950">{event.name}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{event.source}</div>
                    </div>
                    <div className="text-xs text-slate-500">{formatDateTime(event.createdAt)}</div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{event.summary}</p>
                </Link>
              ))}
            </div>
          </DashboardSurfaceCard>
        </div>
      </section>
    </div>
  );
}
