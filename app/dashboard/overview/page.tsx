import Link from "next/link";
import { getDashboardSnapshot } from "@/lib/dashboard-data";
import {
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardSurfaceCard,
  dashboardScrollAreaClasses,
  dashboardButtonClasses,
  getLeadDisplayName,
  getRecommendedFollowUp
} from "../_components/dashboard-ui";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const snapshot = await getDashboardSnapshot();
  const priorityLeads = snapshot.recentLeads
    .filter((lead) => lead.hotness === "Nóng" || lead.status === "Đặt lịch" || lead.tags.includes("can_goi_ngay"))
    .slice(0, 4);

  const metricCards = [
    {
      label: "Tổng lead",
      value: snapshot.overview.totalLeads,
      note: `${snapshot.overview.todayLeads} lead mới trong ngày`,
      icon: "fa-users",
      tone: "bg-[linear-gradient(135deg,#0f172a_0%,#334155_100%)]"
    },
    {
      label: "Lead nóng",
      value: snapshot.overview.hotLeads,
      note: `${snapshot.overview.warmLeads} lead ấm đang theo dõi`,
      icon: "fa-fire",
      tone: "bg-[linear-gradient(135deg,#f97316_0%,#f59e0b_100%)]"
    },
    {
      label: "Chờ gọi lại",
      value: snapshot.overview.pendingCalls,
      note: `${snapshot.overview.qualifiedLeads} lead đã đủ thông tin`,
      icon: "fa-phone-volume",
      tone: "bg-[linear-gradient(135deg,#0284c7_0%,#22d3ee_100%)]"
    },
    {
      label: "Lịch hẹn / touchpoint",
      value: snapshot.overview.appointments,
      note: `${snapshot.overview.todayEvents} sự kiện mới hôm nay`,
      icon: "fa-calendar-check",
      tone: "bg-[linear-gradient(135deg,#065f46_0%,#10b981_100%)]"
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <DashboardPageHeader
        eyebrow="Tổng quan vận hành"
        title={
          <>
            Dashboard overview cho <span className="text-amber-600">Sunshine Bay Retreat</span>
          </>
        }
        description="Trang tổng quan tập trung vào KPI chính, lead ưu tiên và nhịp follow-up trong ngày để đội sale nhìn nhanh là nắm được việc cần làm."
        actions={
          <>
            <Link href="/dashboard/leads" className={dashboardButtonClasses()}>
              Xem bảng lead
            </Link>
            <Link href="/dashboard/follow-up" className={dashboardButtonClasses("outline")}>
              Queue follow-up
            </Link>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {metricCards.map((card) => (
          <DashboardMetricCard key={card.label} {...card} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.92fr]">
        <DashboardSurfaceCard className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">Queue nhanh</div>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Lead nên xử lý trước</h2>
            </div>
            <Link href="/dashboard/follow-up" className={dashboardButtonClasses("outline")}>
              Mở follow-up
            </Link>
          </div>
          <div className={`mt-6 space-y-4 ${dashboardScrollAreaClasses("card")}`}>
            {priorityLeads.length > 0 ? (
              priorityLeads.map((lead) => (
                <div key={lead.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-sm font-black text-slate-950">{getLeadDisplayName(lead)}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                        {lead.need} • {lead.budget}
                      </div>
                    </div>
                    <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-slate-600">
                      {lead.status}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{getRecommendedFollowUp(lead)}</p>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-4 text-sm leading-6 text-slate-500">
                Chưa có lead ưu tiên trong danh sách hiện tại.
              </div>
            )}
          </div>
        </DashboardSurfaceCard>

        <DashboardSurfaceCard className="p-6">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">Nhịp dữ liệu</div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Tóm tắt kênh và hoạt động</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-slate-600">Lead source</span>
                <span className="font-black text-slate-950">{snapshot.connection.leadSource}</span>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-slate-600">Event source</span>
                <span className="font-black text-slate-950">{snapshot.connection.eventSource}</span>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-slate-600">Lead đủ thông tin</span>
                <span className="font-black text-slate-950">{snapshot.overview.qualifiedLeads}</span>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-slate-600">Touchpoint hôm nay</span>
                <span className="font-black text-slate-950">{snapshot.overview.todayEvents}</span>
              </div>
            </div>
          </div>
        </DashboardSurfaceCard>
      </section>
    </div>
  );
}
