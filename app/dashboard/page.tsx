import Link from "next/link";
import { getDashboardSnapshot } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type DashboardSnapshot = Awaited<ReturnType<typeof getDashboardSnapshot>>;
type DashboardLead = DashboardSnapshot["recentLeads"][number];

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function getHotnessTone(hotness: string): string {
  if (hotness === "Nóng") {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  if (hotness === "Ấm") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  return "bg-slate-100 text-slate-600 border-slate-200";
}

function getStatusTone(status: string): string {
  if (status === "Đặt lịch" || status === "Đang chốt") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (status === "Đã gửi thông tin" || status === "Đã gọi") {
    return "bg-sky-50 text-sky-700 border-sky-200";
  }

  return "bg-slate-100 text-slate-600 border-slate-200";
}

function getRecommendedFollowUp(lead: DashboardLead): string {
  if (lead.status === "Đặt lịch") {
    return "Xác nhận lịch xem dự án và gửi vị trí ngay trong hôm nay.";
  }

  if (lead.need === "Xem pháp lý") {
    return "Ưu tiên gửi pháp lý và chốt thêm cuộc gọi xác minh nhu cầu.";
  }

  if (lead.hotness === "Nóng") {
    return "Gọi nhanh 2 phút hoặc gửi Zalo trước để giữ nhịp chốt sale.";
  }

  if (lead.need === "Đầu tư") {
    return "Gửi danh sách căn giá tốt, nhấn mạnh biên độ tăng giá và khả năng cho thuê.";
  }

  return "Gửi bảng giá nội bộ trước, rồi chốt lại tài chính và nhu cầu cụ thể.";
}

export default async function DashboardPage() {
  const snapshot = await getDashboardSnapshot();
  const maxTrend = Math.max(...snapshot.leadTrend.map((item) => item.value), 1);
  const isUsingFallback = snapshot.connection.leadSource !== "supabase" || snapshot.connection.eventSource !== "supabase";
  const priorityLeads = snapshot.recentLeads
    .filter((lead) => lead.hotness === "Nóng" || lead.status === "Đặt lịch" || lead.tags.includes("can_goi_ngay"))
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef4ff_45%,#f8fafc_100%)] px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-amber-700">
                Dashboard Ban Hang
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 md:text-5xl">
                Lead Dashboard Cho <span className="text-amber-600">Sunshine Bay Retreat</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                Theo dõi lead, touchpoint và tín hiệu chốt sale ngay trong Next.js. Dashboard ưu tiên đọc Supabase khi môi trường đã
                sẵn sàng, đồng thời vẫn giữ local fallback an toàn để đội sale không bị gián đoạn lúc triển khai.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:min-w-[360px]">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Lead Source</div>
                <div className="mt-2 text-lg font-black text-slate-900">{snapshot.connection.leadSource === "supabase" ? "Supabase" : "Local JSON"}</div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Event Source</div>
                <div className="mt-2 text-lg font-black text-slate-900">{snapshot.connection.eventSource === "supabase" ? "Supabase" : "Local JSON"}</div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 sm:col-span-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Last Refresh</div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">{formatDateTime(snapshot.generatedAt)}</div>
                  </div>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                  >
                    Ve Landing
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {!snapshot.connection.supabaseConfigured ? (
            <div className="mt-6 rounded-[1.5rem] border border-sky-200 bg-sky-50/80 px-5 py-4 text-sm leading-6 text-sky-900">
              Supabase chưa được cấu hình nên dashboard đang chạy ở chế độ local fallback. Chỉ cần thêm `SUPABASE_URL` và
              `SUPABASE_SERVICE_ROLE_KEY`, rồi chạy schema trong `supabase/schema.sql` là dữ liệu sẽ đồng bộ sang Supabase.
            </div>
          ) : null}

          {snapshot.connection.supabaseConfigured && isUsingFallback ? (
            <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50/80 px-5 py-4 text-sm leading-6 text-amber-900">
              Supabase đã được cấu hình nhưng hiện có ít nhất một nguồn dữ liệu đang fallback về local JSON. Nên kiểm tra lại bảng,
              quyền truy cập hoặc REST response để tránh dashboard đọc lệch dữ liệu live.
            </div>
          ) : null}

          {snapshot.connection.supabaseConfigured && !isUsingFallback ? (
            <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50/80 px-5 py-4 text-sm leading-6 text-emerald-900">
              Dashboard đang đọc live từ Supabase cho cả lead và event. Có thể dùng trực tiếp cho team sale theo dõi follow-up và
              lịch hẹn.
            </div>
          ) : null}
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Tong Lead",
              value: snapshot.overview.totalLeads,
              note: `${snapshot.overview.todayLeads} lead moi hom nay`
            },
            {
              label: "Lead Nong",
              value: snapshot.overview.hotLeads,
              note: `${snapshot.overview.warmLeads} lead am dang follow`
            },
            {
              label: "Cho Goi Lai",
              value: snapshot.overview.pendingCalls,
              note: `${snapshot.overview.qualifiedLeads} lead da du thong tin`
            },
            {
              label: "Dat Lich / Touchpoint",
              value: snapshot.overview.appointments,
              note: `${snapshot.overview.todayEvents} touchpoint hom nay`
            }
          ].map((card) => (
            <article
              key={card.label}
              className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
            >
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">{card.label}</div>
              <div className="mt-3 text-4xl font-black text-slate-900">{card.value}</div>
              <p className="mt-2 text-sm text-slate-600">{card.note}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">Lead Trend</div>
                <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-slate-900">7 Ngay Gan Day</h2>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600">
                Nguon lead: {snapshot.connection.leadSource}
              </div>
            </div>
            <div className="mt-8 grid grid-cols-7 gap-3">
              {snapshot.leadTrend.map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-3">
                  <div className="flex h-44 w-full items-end justify-center rounded-[1.5rem] bg-slate-50 px-3 py-4">
                    <div
                      className="w-full rounded-full bg-[linear-gradient(180deg,#f59e0b_0%,#d97706_100%)] transition-all"
                      style={{ height: `${Math.max((item.value / maxTrend) * 100, item.value > 0 ? 12 : 4)}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-slate-900">{item.value}</div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200/70 bg-slate-950 p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-300">Touchpoint Analytics</div>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight">Su Kien Noi Bat</h2>
            <div className="mt-6 space-y-4">
              {snapshot.eventBreakdown.slice(0, 6).map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                    <span className="font-semibold text-white/78">{item.label}</span>
                    <span className="font-black text-amber-300">{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[linear-gradient(90deg,#fbbf24_0%,#f97316_100%)]" style={{ width: `${item.share}%` }} />
                  </div>
                </div>
              ))}
              {snapshot.eventBreakdown.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-sm text-white/70">
                  Chưa có event analytics nào. Khi khách mở chat, bấm quick action hoặc submit form, dữ liệu sẽ hiện ở đây.
                </div>
              ) : null}
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Theo Nguon", items: snapshot.sourceBreakdown },
            { title: "Theo Nhu Cau", items: snapshot.needBreakdown },
            { title: "Theo Ngan Sach", items: snapshot.budgetBreakdown },
            { title: "Theo Trang Thai", items: snapshot.statusBreakdown }
          ].map((group) => (
            <article
              key={group.title}
              className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
            >
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">Breakdown</div>
              <h2 className="mt-2 text-xl font-black uppercase tracking-tight text-slate-900">{group.title}</h2>
              <div className="mt-5 space-y-4">
                {group.items.slice(0, 6).map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                      <span className="font-semibold text-slate-600">{item.label}</span>
                      <span className="font-black text-slate-900">{item.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-[linear-gradient(90deg,#0f172a_0%,#475569_100%)]" style={{ width: `${item.share}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="border-b border-slate-200/70 px-6 py-5">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">Recent Leads</div>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-slate-900">Lead Moi Nhat</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Khach</th>
                    <th className="px-6 py-4">Nhu cau</th>
                    <th className="px-6 py-4">Do nong</th>
                    <th className="px-6 py-4">Trang thai</th>
                    <th className="px-6 py-4">Cap nhat</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.recentLeads.map((lead) => (
                    <tr key={lead.id} className="border-t border-slate-100 align-top">
                      <td className="px-6 py-4">
                        <div className="font-black text-slate-900">{lead.fullName || lead.phone || lead.zalo || "Lead mới"}</div>
                        <div className="mt-1 text-xs text-slate-500">{lead.source} • {lead.budget}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{lead.need}</td>
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
                      <td className="px-6 py-4 text-slate-500">{formatDateTime(lead.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">Recent Events</div>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-slate-900">Hoat Dong Gan Day</h2>
            <div className="mt-6 space-y-4">
              {snapshot.recentEvents.map((event) => (
                <div key={event.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-black text-slate-900">{event.name}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{event.source}</div>
                    </div>
                    <div className="text-xs text-slate-500">{formatDateTime(event.createdAt)}</div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{event.summary}</p>
                </div>
              ))}
              {snapshot.recentEvents.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500">
                  Chưa có event để hiển thị. Hãy mở landing, bấm chat hoặc submit form để tạo dữ liệu analytics đầu tiên.
                </div>
              ) : null}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">Action Queue</div>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-slate-900">Uu Tien Follow-Up</h2>
            <div className="mt-6 space-y-4">
              {priorityLeads.map((lead) => (
                <div key={lead.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-black text-slate-900">{lead.fullName || lead.phone || lead.zalo || "Lead mới"}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{lead.need} • {lead.budget}</div>
                    </div>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${getHotnessTone(lead.hotness)}`}>
                      {lead.hotness}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{getRecommendedFollowUp(lead)}</p>
                </div>
              ))}
              {priorityLeads.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500">
                  Chưa có lead đủ nóng để ưu tiên follow-up. Khi chatbot, form hoặc booking modal tạo lead mới, danh sách này sẽ tự cập nhật.
                </div>
              ) : null}
            </div>
          </article>

          <div className="grid gap-6">
            <article className="rounded-[1.75rem] border border-slate-200/70 bg-slate-950 p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-300">Sales Script</div>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-tight">Kich Ban Goi Nhanh</h2>
              <div className="mt-6 space-y-4 text-sm leading-6 text-white/78">
                <p>Em chào anh/chị, em bên dự án căn hộ biển mình đang quan tâm. Em thấy anh/chị đang xem dòng căn từ 1,2 tỷ nên em gọi để gửi đúng căn phù hợp nhất.</p>
                <p>Hiện bên em có 2 nhóm dễ chốt là nhóm đầu tư dễ vào tiền và nhóm view đẹp nghỉ dưỡng. Em xin hỏi nhanh mình đang nghiêng về hướng nào ạ?</p>
                <p>Sau đó chốt tiếp 3 ý: tài chính khoảng bao nhiêu, muốn xem bảng giá hay pháp lý trước, và có tiện nhận Zalo hay nghe máy nhanh 2 phút không.</p>
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">Follow-Up</div>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-slate-900">Mau Nhac Lai</h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Sau 10 phút</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Dạ em vẫn giữ sẵn bảng giá và video căn đẹp cho anh/chị ạ. Khi cần, anh/chị chỉ cần nhắn GỬI GIÁ là em gửi ngay.</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Sau 1 ngày</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Chào anh/chị, em vẫn giữ sẵn nhóm căn phù hợp tài chính 1,2 tỷ cùng bảng giá nội bộ mới nhất. Nếu cần, em gửi lại ngay qua Zalo cho mình ạ.</p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}

