import Link from "next/link";
import { getDashboardSnapshot } from "@/lib/dashboard-data";
import {
  DashboardEmptyState,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardSurfaceCard,
  dashboardButtonClasses,
  dashboardScrollAreaClasses,
  formatDateTime,
  getHotnessTone,
  getLeadDisplayName,
  getRecommendedFollowUp
} from "../_components/dashboard-ui";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const snapshot = await getDashboardSnapshot({
    leadLimit: 500,
    eventLimit: 500,
    recentLeadLimit: 20,
    recentEventLimit: 10
  });

  const priorityLeads = snapshot.allLeads
    .filter((lead) => lead.hotness === "Nóng" || lead.status === "Đặt lịch" || lead.tags.includes("can_goi_ngay"))
    .slice(0, 5);

  const metricCards = [
    {
      label: "Tổng lead",
      value: snapshot.overview.totalLeads,
      icon: "fa-users",
      tone: "bg-[linear-gradient(135deg,#0f172a_0%,#334155_100%)]",
      href: "/dashboard/leads"
    },
    {
      label: "Lead nóng",
      value: snapshot.overview.hotLeads,
      icon: "fa-fire",
      tone: "bg-[linear-gradient(135deg,#f97316_0%,#f59e0b_100%)]",
      href: "/dashboard/leads?hotness=N%C3%B3ng"
    },
    {
      label: "Chưa gọi",
      value: snapshot.overview.pendingCalls,
      icon: "fa-phone-volume",
      tone: "bg-[linear-gradient(135deg,#0284c7_0%,#22d3ee_100%)]",
      href: "/dashboard/leads?status=Ch%C6%B0a+g%E1%BB%8Di"
    },
    {
      label: "Đặt lịch",
      value: snapshot.overview.appointments,
      icon: "fa-calendar-check",
      tone: "bg-[linear-gradient(135deg,#065f46_0%,#10b981_100%)]",
      href: "/dashboard/follow-up"
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <DashboardPageHeader
        title="Tổng quan"
        actions={
          <>
            <Link href="/dashboard/leads" className={dashboardButtonClasses()}>
              Leads
            </Link>
            <Link href="/dashboard/maintenance" className={dashboardButtonClasses("outline")}>
              Maintenance
            </Link>
          </>
        }
      />

      <section className="grid gap-4 min-[460px]:grid-cols-2 2xl:grid-cols-4">
        {metricCards.map((card) => (
          <DashboardMetricCard key={card.label} {...card} />
        ))}
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.98fr)]">
        <DashboardSurfaceCard className="self-start p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Lead nên xử lý trước</h2>
            <Link href="/dashboard/follow-up" className={dashboardButtonClasses("outline")}>
              Follow-up
            </Link>
          </div>
          <div className={`mt-6 space-y-4 ${dashboardScrollAreaClasses("card")}`}>
            {priorityLeads.length > 0 ? (
              priorityLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/dashboard/leads/${lead.id}`}
                  className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-sm font-black text-slate-950">{getLeadDisplayName(lead)}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                        {lead.need} • {lead.budget}
                      </div>
                    </div>
                    <div className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${getHotnessTone(lead.hotness)}`}>
                      {lead.status}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{getRecommendedFollowUp(lead)}</p>
                </Link>
              ))
            ) : (
              <DashboardEmptyState message="Không có lead ưu tiên." />
            )}
          </div>
        </DashboardSurfaceCard>

        <DashboardSurfaceCard className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Event mới nhất</h2>
            <Link href="/dashboard/analytics" className={dashboardButtonClasses("outline")}>
              Analytics
            </Link>
          </div>
          <div className={`mt-6 space-y-3 ${dashboardScrollAreaClasses("card")}`}>
            {snapshot.recentEvents.length > 0 ? (
              snapshot.recentEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/dashboard/events/${event.id}`}
                  className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-sm font-black text-slate-950">{event.name}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{event.source}</div>
                    </div>
                    <div className="text-xs font-semibold text-slate-500">{formatDateTime(event.createdAt)}</div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{event.summary}</p>
                </Link>
              ))
            ) : (
              <DashboardEmptyState message="Không có event." />
            )}
          </div>
        </DashboardSurfaceCard>
      </section>
    </div>
  );
}
