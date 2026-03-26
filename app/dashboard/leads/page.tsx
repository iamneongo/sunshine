import Link from "next/link";
import { getDashboardSnapshot } from "@/lib/dashboard-data";
import {
  DashboardEmptyState,
  DashboardBadge,
  type DashboardLead,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardSurfaceCard,
  dashboardScrollAreaClasses,
  dashboardButtonClasses,
  formatDateTime,
  getHotnessTone,
  getLeadDisplayName,
  getStatusTone
} from "../_components/dashboard-ui";

export const dynamic = "force-dynamic";

const leadSourceLabels = {
  landing_form: "Landing form",
  booking_modal: "Booking modal",
  chatbot: "Chatbot",
  facebook: "Facebook",
  tiktok: "TikTok",
  zalo_oa: "Zalo OA",
  unknown: "Khác"
} satisfies Record<DashboardLead["source"], string>;

function getLeadSourceLabel(source: DashboardLead["source"]): string {
  return leadSourceLabels[source] ?? source;
}

function getLeadSourceTone(source: DashboardLead["source"]): string {
  if (source === "chatbot") {
    return "border-indigo-200 bg-indigo-50 text-indigo-700";
  }

  if (source === "facebook") {
    return "border-sky-200 bg-sky-50 text-sky-700";
  }

  if (source === "tiktok") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (source === "zalo_oa") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

function getLeadPrimaryContact(lead: DashboardLead): string {
  return lead.phone || lead.zalo || lead.email || "Chưa có thông tin liên hệ";
}

function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, "");
}

function buildQuickActions(lead: DashboardLead): Array<{ href: string; label: string; icon: string; external?: boolean }> {
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

function getLeadContextNote(lead: DashboardLead): string {
  return lead.preferredVisitTime || lead.preferredCallbackTime || lead.lastMessage || lead.notes || "Chưa có ghi chú follow-up.";
}

export default async function DashboardLeadsPage() {
  const snapshot = await getDashboardSnapshot();
  const urgentLeads = snapshot.recentLeads.filter((lead) => lead.hotness === "Nóng").slice(0, 5);

  return (
    <div className="space-y-6 lg:space-y-8">
      <DashboardPageHeader
        eyebrow="Leads"
        title="Bảng lead và pipeline xử lý"
        description="Màn hình này ưu tiên cấu trúc table rõ ràng để sale scan nhanh khách mới, nhu cầu, ngân sách, độ nóng và trạng thái follow-up."
        actions={
          <>
            <Link href="/dashboard/overview" className={dashboardButtonClasses("outline")}>
              Về overview
            </Link>
            <Link href="/dashboard/follow-up" className={dashboardButtonClasses()}>
              Queue follow-up
            </Link>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          label="Lead mới nhất"
          value={snapshot.recentLeads.length}
          note="Số lead đang hiển thị trong bảng hiện tại"
          icon="fa-table-list"
          tone="bg-[linear-gradient(135deg,#0f172a_0%,#334155_100%)]"
        />
        <DashboardMetricCard
          label="Lead nóng"
          value={snapshot.overview.hotLeads}
          note="Nhóm có ưu tiên gọi hoặc gửi Zalo trước"
          icon="fa-fire"
          tone="bg-[linear-gradient(135deg,#f97316_0%,#f59e0b_100%)]"
        />
        <DashboardMetricCard
          label="Chưa gọi"
          value={snapshot.overview.pendingCalls}
          note="Lead đang chờ xử lý ở bước đầu tiên"
          icon="fa-phone-volume"
          tone="bg-[linear-gradient(135deg,#0284c7_0%,#22d3ee_100%)]"
        />
        <DashboardMetricCard
          label="Đặt lịch"
          value={snapshot.overview.appointments}
          note="Lead đã đi tới bước hẹn xem dự án"
          icon="fa-calendar-check"
          tone="bg-[linear-gradient(135deg,#065f46_0%,#10b981_100%)]"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.22fr)_340px]">
        <DashboardSurfaceCard className="overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-slate-200/80 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">Lead table</div>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Danh sách lead mới nhất</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <DashboardBadge>{snapshot.connection.leadSource}</DashboardBadge>
              <DashboardBadge>{snapshot.overview.todayLeads} lead hôm nay</DashboardBadge>
              <DashboardBadge className="hidden md:inline-flex">Responsive table</DashboardBadge>
            </div>
          </div>

          {snapshot.recentLeads.length > 0 ? (
            <>
              <div className={`grid gap-4 border-t border-slate-200/80 p-4 md:hidden ${dashboardScrollAreaClasses("card")}`}>
                {snapshot.recentLeads.map((lead) => {
                  const quickActions = buildQuickActions(lead);

                  return (
                    <article key={lead.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="truncate text-base font-black tracking-tight text-slate-950">{getLeadDisplayName(lead)}</div>
                          <div className="mt-1 text-sm text-slate-500">{getLeadPrimaryContact(lead)}</div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Cập nhật</div>
                          <div className="mt-1 text-xs font-semibold text-slate-600">{formatDateTime(lead.updatedAt)}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <DashboardBadge className={getLeadSourceTone(lead.source)}>{getLeadSourceLabel(lead.source)}</DashboardBadge>
                        <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${getHotnessTone(lead.hotness)}`}>
                          {lead.hotness}
                        </span>
                        <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${getStatusTone(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>

                      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-lg bg-slate-50 px-3 py-3">
                          <dt className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Nhu cầu</dt>
                          <dd className="mt-1 font-semibold text-slate-700">{lead.need}</dd>
                        </div>
                        <div className="rounded-lg bg-slate-50 px-3 py-3">
                          <dt className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Ngân sách</dt>
                          <dd className="mt-1 font-semibold text-slate-700">{lead.budget}</dd>
                        </div>
                        <div className="rounded-lg bg-slate-50 px-3 py-3">
                          <dt className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Kênh ưu tiên</dt>
                          <dd className="mt-1 font-semibold text-slate-700">{lead.contactPreference}</dd>
                        </div>
                        <div className="rounded-lg bg-slate-50 px-3 py-3">
                          <dt className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Nguồn</dt>
                          <dd className="mt-1 font-semibold text-slate-700">{getLeadSourceLabel(lead.source)}</dd>
                        </div>
                      </dl>

                      <div className="mt-4 rounded-lg bg-slate-50 px-3 py-3">
                        <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Ghi chú nhanh</div>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{getLeadContextNote(lead)}</p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {quickActions.length > 0 ? (
                          quickActions.map((action) => (
                            <a
                              key={`${lead.id}-${action.label}`}
                              href={action.href}
                              target={action.external ? "_blank" : undefined}
                              rel={action.external ? "noreferrer" : undefined}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                              <i className={`fa-solid ${action.icon}`}></i>
                              {action.label}
                            </a>
                          ))
                        ) : (
                          <span className="text-xs font-semibold text-slate-400">Chưa có kênh liên hệ nhanh</span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className={`hidden md:block ${dashboardScrollAreaClasses("table")}`}>
                <table className="min-w-[1120px] w-full border-separate border-spacing-0 text-left text-sm">
                  <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                    <tr>
                      <th className="sticky left-0 top-0 z-20 bg-slate-50 px-6 py-4 shadow-[1px_0_0_0_rgb(226_232_240)]">Khách</th>
                      <th className="sticky top-0 bg-slate-50 px-6 py-4">Nguồn</th>
                      <th className="sticky top-0 bg-slate-50 px-6 py-4">Nhu cầu</th>
                      <th className="sticky top-0 bg-slate-50 px-6 py-4">Ngân sách</th>
                      <th className="sticky top-0 bg-slate-50 px-6 py-4">Độ nóng</th>
                      <th className="sticky top-0 bg-slate-50 px-6 py-4">Trạng thái</th>
                      <th className="sticky top-0 bg-slate-50 px-6 py-4">Cập nhật</th>
                      <th className="sticky top-0 bg-slate-50 px-6 py-4">Liên hệ nhanh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshot.recentLeads.map((lead) => {
                      const quickActions = buildQuickActions(lead);

                      return (
                        <tr key={lead.id} className="group border-t border-slate-100 align-top transition hover:bg-slate-50/80">
                          <td className="sticky left-0 z-10 bg-white px-6 py-4 transition group-hover:bg-slate-50/80">
                            <div className="font-black text-slate-950">{getLeadDisplayName(lead)}</div>
                            <div className="mt-1 text-xs text-slate-500">{getLeadPrimaryContact(lead)}</div>
                            <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                              {lead.contactPreference}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <DashboardBadge className={getLeadSourceTone(lead.source)}>{getLeadSourceLabel(lead.source)}</DashboardBadge>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{lead.need}</td>
                          <td className="px-6 py-4 text-slate-600">{lead.budget}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${getHotnessTone(lead.hotness)}`}>
                              {lead.hotness}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${getStatusTone(lead.status)}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-slate-500">{formatDateTime(lead.updatedAt)}</div>
                            <div className="mt-2 max-w-[200px] text-xs leading-5 text-slate-400">{getLeadContextNote(lead)}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              {quickActions.length > 0 ? (
                                quickActions.map((action) => (
                                  <a
                                    key={`${lead.id}-${action.label}`}
                                    href={action.href}
                                    target={action.external ? "_blank" : undefined}
                                    rel={action.external ? "noreferrer" : undefined}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                                    aria-label={action.label}
                                    title={action.label}
                                  >
                                    <i className={`fa-solid ${action.icon}`}></i>
                                  </a>
                                ))
                              ) : (
                                <span className="text-xs font-semibold text-slate-400">Chưa có</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="border-t border-slate-200/80 p-5 sm:p-6">
              <DashboardEmptyState message="Chưa có lead nào để hiển thị trong bảng responsive." />
            </div>
          )}
        </DashboardSurfaceCard>

        <div className="grid gap-6">
          <DashboardSurfaceCard className="p-6">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">Ưu tiên gọi</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Lead nóng gần đây</h2>
            <div className={`mt-5 space-y-4 ${dashboardScrollAreaClasses("card")}`}>
              {urgentLeads.length > 0 ? (
                urgentLeads.map((lead) => (
                  <div key={lead.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-black text-slate-950">{getLeadDisplayName(lead)}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{lead.need}</div>
                      </div>
                      <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${getHotnessTone(lead.hotness)}`}>
                        {lead.hotness}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{lead.budget} • {lead.status}</p>
                  </div>
                ))
              ) : (
                <DashboardEmptyState message="Chưa có lead nóng trong danh sách gần nhất." />
              )}
            </div>
          </DashboardSurfaceCard>

          <DashboardSurfaceCard className="p-6">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">Pipeline snapshot</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Trạng thái xử lý</h2>
            <div className={`mt-5 space-y-4 ${dashboardScrollAreaClasses("card")}`}>
              {snapshot.statusBreakdown.slice(0, 6).map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                    <span className="font-semibold text-slate-600">{item.label}</span>
                    <span className="font-black text-slate-950">{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-[linear-gradient(90deg,#0f172a_0%,#475569_100%)]" style={{ width: `${item.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </DashboardSurfaceCard>
        </div>
      </section>
    </div>
  );
}
