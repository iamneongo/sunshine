import Link from "next/link";
import { getDashboardSnapshot } from "@/lib/dashboard-data";
import {
  DashboardEmptyState,
  DashboardPageHeader,
  DashboardSurfaceCard,
  dashboardScrollAreaClasses,
  dashboardButtonClasses,
  formatDateTime,
  getHotnessTone,
  getLeadDisplayName,
  getRecommendedFollowUp
} from "../_components/dashboard-ui";

export const dynamic = "force-dynamic";

export default async function DashboardFollowUpPage() {
  const snapshot = await getDashboardSnapshot();
  const priorityLeads = snapshot.recentLeads
    .filter((lead) => lead.hotness === "Nóng" || lead.status === "Đặt lịch" || lead.tags.includes("can_goi_ngay"))
    .slice(0, 8);

  return (
    <div className="space-y-6 lg:space-y-8">
      <DashboardPageHeader
        eyebrow="Follow-up"
        title="Queue ưu tiên và hoạt động follow-up"
        description="Trang này tập trung vào danh sách lead cần xử lý trước và các hoạt động gần đây để đội sale bám nhịp follow-up trong ngày."
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

      <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <DashboardSurfaceCard className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">Action queue</div>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Lead nên xử lý trước</h2>
            </div>
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600">
              {priorityLeads.length} lead ưu tiên
            </div>
          </div>

          <div className={`mt-6 space-y-4 ${dashboardScrollAreaClasses("card")}`}>
            {priorityLeads.length > 0 ? (
              priorityLeads.map((lead) => (
                <div key={lead.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-sm font-black text-slate-950">{getLeadDisplayName(lead)}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                        {lead.need} • {lead.budget} • {lead.source}
                      </div>
                    </div>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${getHotnessTone(lead.hotness)}`}>
                      {lead.hotness}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{getRecommendedFollowUp(lead)}</p>
                </div>
              ))
            ) : (
              <DashboardEmptyState message="Chưa có lead đủ nóng để đưa vào queue ưu tiên." />
            )}
          </div>
        </DashboardSurfaceCard>

        <DashboardSurfaceCard className="p-6">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">Recent activity</div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Hoạt động gần đây</h2>
          <div className={`mt-6 space-y-4 ${dashboardScrollAreaClasses("card")}`}>
            {snapshot.recentEvents.slice(0, 8).map((event) => (
              <div key={event.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-sm font-black text-slate-950">{event.name}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{event.source}</div>
                  </div>
                  <div className="text-xs text-slate-500">{formatDateTime(event.createdAt)}</div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{event.summary}</p>
              </div>
            ))}
          </div>
        </DashboardSurfaceCard>
      </section>
    </div>
  );
}
