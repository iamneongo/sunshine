import Link from "next/link";
import { getDashboardSnapshot } from "@/lib/dashboard-data";
import {
  DashboardBreakdownCard,
  DashboardEmptyState,
  DashboardPageHeader,
  DashboardSurfaceCard,
  dashboardScrollAreaClasses,
  dashboardButtonClasses
} from "../_components/dashboard-ui";

export const dynamic = "force-dynamic";

export default async function DashboardAnalyticsPage() {
  const snapshot = await getDashboardSnapshot();
  const maxTrend = Math.max(...snapshot.leadTrend.map((item) => item.value), 1);

  const breakdownCards = [
    {
      eyebrow: "Kênh vào lead",
      title: "Theo nguồn",
      items: snapshot.sourceBreakdown,
      barClassName: "bg-[linear-gradient(90deg,#f59e0b_0%,#f97316_100%)]"
    },
    {
      eyebrow: "Ý định chính",
      title: "Theo nhu cầu",
      items: snapshot.needBreakdown,
      barClassName: "bg-[linear-gradient(90deg,#0f172a_0%,#475569_100%)]"
    },
    {
      eyebrow: "Khả năng tài chính",
      title: "Theo ngân sách",
      items: snapshot.budgetBreakdown,
      barClassName: "bg-[linear-gradient(90deg,#2563eb_0%,#06b6d4_100%)]"
    },
    {
      eyebrow: "Nhiệt độ lead",
      title: "Theo độ nóng",
      items: snapshot.hotnessBreakdown,
      barClassName: "bg-[linear-gradient(90deg,#dc2626_0%,#f59e0b_100%)]"
    },
    {
      eyebrow: "Mức độ xử lý",
      title: "Theo trạng thái",
      items: snapshot.statusBreakdown,
      barClassName: "bg-[linear-gradient(90deg,#059669_0%,#84cc16_100%)]"
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <DashboardPageHeader
        eyebrow="Analytics"
        title="Trend và phân tích hành vi lead"
        description="Trang này gom toàn bộ góc nhìn phân tích: lead trend, touchpoint analytics và breakdown theo nguồn, nhu cầu, ngân sách, độ nóng."
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

      <section className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr] xl:gap-6">
        <DashboardSurfaceCard className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">Lead trend</div>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">7 ngày gần đây</h2>
            </div>
            <div className="inline-flex items-center self-start rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 md:self-auto">
              Nguồn lead: {snapshot.connection.leadSource}
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
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">Touchpoint analytics</div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Sự kiện nổi bật</h2>
          <div className={`mt-6 space-y-3 ${dashboardScrollAreaClasses("card")}`}>
            {snapshot.eventBreakdown.slice(0, 6).map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                <div className="mb-2 flex items-start justify-between gap-4 text-sm">
                  <span className="font-semibold text-slate-600">{item.label}</span>
                  <span className="shrink-0 font-black text-slate-950">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-[linear-gradient(90deg,#fbbf24_0%,#f97316_100%)]" style={{ width: `${item.share}%` }} />
                </div>
              </div>
            ))}

            {snapshot.eventBreakdown.length === 0 ? (
              <DashboardEmptyState message="Chưa có event analytics nào. Khi khách mở chat, bấm quick action hoặc submit form, dữ liệu sẽ hiện ở đây." />
            ) : null}
          </div>
        </DashboardSurfaceCard>
      </section>

      <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3 xl:gap-6">
        {breakdownCards.map((group) => (
          <DashboardBreakdownCard key={group.title} {...group} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.94fr_1.06fr] xl:gap-6">
        <DashboardSurfaceCard className="p-5 sm:p-6">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">Event feed</div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Hoạt động gần đây</h2>
          <div className={`mt-6 space-y-3 ${dashboardScrollAreaClasses("card")}`}>
            {snapshot.recentEvents.slice(0, 6).map((event) => (
              <div key={event.id} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-sm font-black text-slate-950">{event.name}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{event.source}</div>
                  </div>
                  <div className="shrink-0 text-xs text-slate-500">
                    {new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(event.createdAt))}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{event.summary}</p>
              </div>
            ))}
          </div>
        </DashboardSurfaceCard>

        <DashboardSurfaceCard className="p-5 sm:p-6">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">Insights</div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Gợi ý đọc số liệu</h2>
          <div className={`mt-6 space-y-3 ${dashboardScrollAreaClasses("card")}`}>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="text-sm font-black text-slate-950">Nếu nguồn lead bị lệch mạnh</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">Ưu tiên kiểm tra placement, traffic source và logic submit để tránh hụt lead ở một kênh cụ thể.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="text-sm font-black text-slate-950">Nếu nhu cầu pháp lý tăng</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">Nên đẩy tài liệu pháp lý và CTA nhận hồ sơ lên sớm hơn trong các kịch bản chat và follow-up.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="text-sm font-black text-slate-950">Nếu lead nóng ít nhưng event cao</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">Có thể khách đang tương tác tốt nhưng CTA chốt còn yếu. Nên kiểm tra quick actions, wording giá và flow chatbot.</p>
            </div>
          </div>
        </DashboardSurfaceCard>
      </section>
    </div>
  );
}
