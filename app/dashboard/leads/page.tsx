import Link from "next/link";
import { getDashboardSnapshot } from "@/lib/dashboard-data";
import {
  DashboardBadge,
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
  getLeadPrimaryContact,
  getLeadSourceLabel,
  getLeadSourceTone,
  getStatusTone
} from "../_components/dashboard-ui";

export const dynamic = "force-dynamic";

type DashboardLeadsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type LeadFilters = {
  q: string;
  source: string;
  hotness: string;
  status: string;
  need: string;
  budget: string;
};

function getSingleValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getLeadContextNote(lead: Awaited<ReturnType<typeof getDashboardSnapshot>>["allLeads"][number]): string {
  return lead.preferredVisitTime || lead.preferredCallbackTime || lead.lastMessage || lead.notes || "Chưa có ghi chú follow-up.";
}

function normalizeForSearch(value: string): string {
  return value.toLowerCase().trim();
}

function matchesLeadFilter(lead: Awaited<ReturnType<typeof getDashboardSnapshot>>["allLeads"][number], filters: LeadFilters): boolean {
  const query = normalizeForSearch(filters.q);
  const haystack = normalizeForSearch(
    [
      lead.fullName,
      lead.phone,
      lead.zalo,
      lead.email,
      lead.need,
      lead.budget,
      lead.status,
      lead.hotness,
      lead.notes,
      lead.lastMessage,
      lead.contactPreference,
      lead.projectName
    ]
      .filter(Boolean)
      .join(" ")
  );

  if (query && !haystack.includes(query)) {
    return false;
  }

  if (filters.source && lead.source !== filters.source) {
    return false;
  }

  if (filters.hotness && lead.hotness !== filters.hotness) {
    return false;
  }

  if (filters.status && lead.status !== filters.status) {
    return false;
  }

  if (filters.need && lead.need !== filters.need) {
    return false;
  }

  if (filters.budget && lead.budget !== filters.budget) {
    return false;
  }

  return true;
}

function buildLeadFilterHref(filters: LeadFilters, overrides: Partial<LeadFilters> = {}): string {
  const nextFilters = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (nextFilters.q) {
    params.set("q", nextFilters.q);
  }

  if (nextFilters.source) {
    params.set("source", nextFilters.source);
  }

  if (nextFilters.hotness) {
    params.set("hotness", nextFilters.hotness);
  }

  if (nextFilters.status) {
    params.set("status", nextFilters.status);
  }

  if (nextFilters.need) {
    params.set("need", nextFilters.need);
  }

  if (nextFilters.budget) {
    params.set("budget", nextFilters.budget);
  }

  const query = params.toString();
  return query ? `/dashboard/leads?${query}` : "/dashboard/leads";
}

export default async function DashboardLeadsPage({ searchParams }: DashboardLeadsPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const filters: LeadFilters = {
    q: getSingleValue(params?.q).trim(),
    source: getSingleValue(params?.source).trim(),
    hotness: getSingleValue(params?.hotness).trim(),
    status: getSingleValue(params?.status).trim(),
    need: getSingleValue(params?.need).trim(),
    budget: getSingleValue(params?.budget).trim()
  };

  const snapshot = await getDashboardSnapshot({
    leadLimit: 500,
    eventLimit: 500,
    recentLeadLimit: 24,
    recentEventLimit: 16
  });

  const filteredLeads = snapshot.allLeads.filter((lead) => matchesLeadFilter(lead, filters));
  const urgentLeads = filteredLeads.filter((lead) => lead.hotness === "Nóng").slice(0, 6);
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-6 lg:space-y-8">
      <DashboardPageHeader

        title="Leads"

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

      <section className="grid gap-4 min-[460px]:grid-cols-2 2xl:grid-cols-4">
        <DashboardMetricCard
          label="Lead đang hiển thị"
          value={filteredLeads.length}
          note={hasFilters ? "Kết quả sau khi áp dụng bộ lọc hiện tại" : "Tổng số lead đang lấy từ dataset dashboard"}
          icon="fa-table-list"
          tone="bg-[linear-gradient(135deg,#0f172a_0%,#334155_100%)]"
          href={hasFilters ? "/dashboard/leads" : undefined}
          actionLabel={hasFilters ? "Xóa bộ lọc" : "Xem chi tiết"}
        />
        <DashboardMetricCard
          label="Lead nóng"
          value={filteredLeads.filter((lead) => lead.hotness === "Nóng").length}
          note="Nhóm ưu tiên gọi hoặc chốt Zalo trước"
          icon="fa-fire"
          tone="bg-[linear-gradient(135deg,#f97316_0%,#f59e0b_100%)]"
          href={buildLeadFilterHref(filters, { hotness: "Nóng" })}
        />
        <DashboardMetricCard
          label="Chưa gọi"
          value={filteredLeads.filter((lead) => lead.status === "Chưa gọi").length}
          note="Lead đang chờ xử lý bước đầu tiên"
          icon="fa-phone-volume"
          tone="bg-[linear-gradient(135deg,#0284c7_0%,#22d3ee_100%)]"
          href={buildLeadFilterHref(filters, { status: "Chưa gọi" })}
        />
        <DashboardMetricCard
          label="Đặt lịch"
          value={filteredLeads.filter((lead) => lead.status === "Đặt lịch").length}
          note="Lead đã đi tới bước hẹn xem dự án"
          icon="fa-calendar-check"
          tone="bg-[linear-gradient(135deg,#065f46_0%,#10b981_100%)]"
          href={buildLeadFilterHref(filters, { status: "Đặt lịch" })}
        />
      </section>

      <DashboardSurfaceCard className="p-4 sm:p-5 xl:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Tìm đúng nhóm khách cần xử lý</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <DashboardBadge>{filteredLeads.length} lead</DashboardBadge>
            {hasFilters ? <DashboardBadge variant="warning">Đang dùng bộ lọc</DashboardBadge> : <DashboardBadge>Chưa lọc</DashboardBadge>}
          </div>
        </div>

        <form method="get" className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-12">
          <label className="block sm:col-span-2 xl:col-span-4">
            <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Tìm kiếm</div>
            <input
              type="text"
              name="q"
              defaultValue={filters.q}
              placeholder="Tên, SĐT, email, note, nhu cầu..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
            />
          </label>

          <label className="block xl:col-span-2">
            <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Nguồn</div>
            <select name="source" defaultValue={filters.source} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-slate-400">
              <option value="">Tất cả</option>
              {snapshot.sourceBreakdown.map((item) => (
                <option key={item.label} value={item.label}>
                  {getLeadSourceLabel(item.label as typeof snapshot.allLeads[number]["source"])}
                </option>
              ))}
            </select>
          </label>

          <label className="block xl:col-span-2">
            <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Độ nóng</div>
            <select name="hotness" defaultValue={filters.hotness} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-slate-400">
              <option value="">Tất cả</option>
              {snapshot.hotnessBreakdown.map((item) => (
                <option key={item.label} value={item.label}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block xl:col-span-2">
            <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Trạng thái</div>
            <select name="status" defaultValue={filters.status} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-slate-400">
              <option value="">Tất cả</option>
              {snapshot.statusBreakdown.map((item) => (
                <option key={item.label} value={item.label}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block xl:col-span-2">
            <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Nhu cầu</div>
            <select name="need" defaultValue={filters.need} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-slate-400">
              <option value="">Tất cả</option>
              {snapshot.needBreakdown.map((item) => (
                <option key={item.label} value={item.label}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block sm:col-span-2 xl:col-span-4">
            <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Ngân sách</div>
            <select name="budget" defaultValue={filters.budget} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-slate-400">
              <option value="">Tất cả</option>
              {snapshot.budgetBreakdown.map((item) => (
                <option key={item.label} value={item.label}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap gap-3 sm:col-span-2 xl:col-span-12 xl:items-end">
            <button type="submit" className={dashboardButtonClasses()}>
              Áp dụng bộ lọc
            </button>
            {hasFilters ? (
              <Link href="/dashboard/leads" className={dashboardButtonClasses("outline")}>
                Xóa bộ lọc
              </Link>
            ) : null}
          </div>
        </form>
      </DashboardSurfaceCard>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)]">
        <DashboardSurfaceCard className="overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-slate-200/80 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-5 xl:px-6">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Danh sách lead</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <DashboardBadge>{snapshot.connection.leadSource}</DashboardBadge>
              <DashboardBadge>{snapshot.overview.todayLeads} lead hôm nay</DashboardBadge>
              {hasFilters ? <DashboardBadge variant="warning">Đã lọc</DashboardBadge> : <DashboardBadge>Toàn bộ dataset</DashboardBadge>}
            </div>
          </div>

          {filteredLeads.length > 0 ? (
            <>
              <div className={`grid gap-4 border-t border-slate-200/80 p-4 sm:grid-cols-2 md:hidden ${dashboardScrollAreaClasses("card")}`}>
                {filteredLeads.map((lead) => {
                  const quickActions = buildLeadQuickActions(lead);

                  return (
                    <article key={lead.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <Link href={`/dashboard/leads/${lead.id}`} className="truncate text-base font-black tracking-tight text-slate-950 hover:text-slate-700">
                            {getLeadDisplayName(lead)}
                          </Link>
                          <div className="mt-1 text-sm text-slate-500">{getLeadPrimaryContact(lead)}</div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Cập nhật</div>
                          <div className="mt-1 text-xs font-semibold text-slate-600">{formatDateTime(lead.updatedAt)}</div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 min-[480px]:flex min-[480px]:flex-wrap">
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
                        <Link href={`/dashboard/leads/${lead.id}`} className={dashboardButtonClasses()}>
                          Xem detail
                        </Link>
                        {quickActions.map((action) => (
                          <a
                            key={`${lead.id}-${action.label}`}
                            href={action.href}
                            target={action.external ? "_blank" : undefined}
                            rel={action.external ? "noreferrer" : undefined}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:text-xs"
                          >
                            <i className={`fa-solid ${action.icon}`}></i>
                            {action.label}
                          </a>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className={`hidden md:block ${dashboardScrollAreaClasses("table")}`}>
                <table className="min-w-[1040px] w-full border-separate border-spacing-0 text-left text-sm xl:min-w-[1200px]">
                  <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                    <tr>
                      <th className="sticky left-0 top-0 z-20 bg-slate-50 px-6 py-4 shadow-[1px_0_0_0_rgb(226_232_240)]">Khách</th>
                      <th className="sticky top-0 bg-slate-50 px-6 py-4">Nguồn</th>
                      <th className="sticky top-0 bg-slate-50 px-6 py-4">Nhu cầu</th>
                      <th className="sticky top-0 bg-slate-50 px-6 py-4">Ngân sách</th>
                      <th className="sticky top-0 bg-slate-50 px-6 py-4">Độ nóng</th>
                      <th className="sticky top-0 bg-slate-50 px-6 py-4">Trạng thái</th>
                      <th className="sticky top-0 bg-slate-50 px-6 py-4">Cập nhật</th>
                      <th className="sticky top-0 bg-slate-50 px-6 py-4">Chi tiết</th>
                      <th className="sticky top-0 bg-slate-50 px-6 py-4">Liên hệ nhanh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => {
                      const quickActions = buildLeadQuickActions(lead);

                      return (
                        <tr key={lead.id} className="group border-t border-slate-100 align-top transition hover:bg-slate-50/80">
                          <td className="sticky left-0 z-10 bg-white px-6 py-4 transition group-hover:bg-slate-50/80">
                            <Link href={`/dashboard/leads/${lead.id}`} className="font-black text-slate-950 hover:text-slate-700">
                              {getLeadDisplayName(lead)}
                            </Link>
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
                            <div className="mt-2 max-w-[220px] text-xs leading-5 text-slate-400">{getLeadContextNote(lead)}</div>
                          </td>
                          <td className="px-6 py-4">
                            <Link href={`/dashboard/leads/${lead.id}`} className={dashboardButtonClasses("outline")}>
                              Detail
                            </Link>
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
              <DashboardEmptyState message="Không có lead phù hợp với bộ lọc hiện tại. Thử mở rộng điều kiện hoặc xóa bộ lọc để xem lại toàn bộ danh sách." />
            </div>
          )}
        </DashboardSurfaceCard>

        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-1">
          <DashboardSurfaceCard className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Lead nóng gần đây</h2>
              </div>
              <Link href={buildLeadFilterHref(filters, { hotness: "Nóng" })} className={dashboardButtonClasses("outline")}>
                Mở nhóm nóng
              </Link>
            </div>
            <div className={`mt-5 space-y-4 ${dashboardScrollAreaClasses("card")}`}>
              {urgentLeads.length > 0 ? (
                urgentLeads.map((lead) => (
                  <Link key={lead.id} href={`/dashboard/leads/${lead.id}`} className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white">
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
                  </Link>
                ))
              ) : (
                <DashboardEmptyState message="Chưa có lead nóng theo bộ lọc hiện tại." />
              )}
            </div>
          </DashboardSurfaceCard>

          <DashboardSurfaceCard className="p-5 sm:p-6">
            <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Trạng thái xử lý</h2>
            <div className={`mt-5 space-y-4 ${dashboardScrollAreaClasses("card")}`}>
              {snapshot.statusBreakdown.slice(0, 6).map((item) => (
                <Link key={item.label} href={buildLeadFilterHref(filters, { status: item.label })} className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white">
                  <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                    <span className="font-semibold text-slate-600">{item.label}</span>
                    <span className="font-black text-slate-950">{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white">
                    <div className="h-full rounded-full bg-[linear-gradient(90deg,#0f172a_0%,#475569_100%)]" style={{ width: `${item.share}%` }} />
                  </div>
                </Link>
              ))}
            </div>
          </DashboardSurfaceCard>
        </div>
      </section>
    </div>
  );
}
