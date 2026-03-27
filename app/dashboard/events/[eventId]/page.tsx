import Link from "next/link";
import { notFound } from "next/navigation";
import { getDashboardEventDetail } from "@/lib/dashboard-data";
import {
  DashboardBadge,
  DashboardEmptyState,
  DashboardPageHeader,
  DashboardSurfaceCard,
  dashboardButtonClasses,
  dashboardScrollAreaClasses,
  formatDateTime,
  getLeadDisplayName,
  getLeadPrimaryContact,
  getLeadSourceLabel,
  getLeadSourceTone,
  getHotnessTone,
  getStatusTone
} from "../../_components/dashboard-ui";

export const dynamic = "force-dynamic";

type DashboardEventDetailPageProps = {
  params: Promise<{ eventId: string }>;
};

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 text-sm font-semibold leading-6 text-slate-700">{value || "Chưa có"}</div>
    </div>
  );
}

export default async function DashboardEventDetailPage({ params }: DashboardEventDetailPageProps) {
  const { eventId } = await params;
  const detail = await getDashboardEventDetail(eventId);

  if (!detail) {
    notFound();
  }

  const { event, relatedLead, similarEvents } = detail;
  const metadataEntries = Object.entries(event.metadata ?? {});

  return (
    <div className="space-y-6 lg:space-y-8">
      <DashboardPageHeader

        title={event.name}

        actions={
          <>
            <Link href="/dashboard/analytics" className={dashboardButtonClasses("outline")}>
              Về analytics
            </Link>
            <Link href="/dashboard/follow-up" className={dashboardButtonClasses()}>
              Mở follow-up
            </Link>
          </>
        }
      />

      <DashboardSurfaceCard className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              <DashboardBadge className="border-slate-200 bg-slate-100 text-slate-700">{event.source}</DashboardBadge>
              {event.path ? <DashboardBadge>{event.path}</DashboardBadge> : null}
              {event.leadId ? <DashboardBadge variant="positive">Có lead liên kết</DashboardBadge> : <DashboardBadge>Chưa gắn lead</DashboardBadge>}
            </div>
            <div className="mt-4 text-3xl font-black tracking-tight text-slate-950">{event.name}</div>
            <p className="mt-3 text-sm leading-7 text-slate-600">{event.summary}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:w-[420px] xl:grid-cols-1">
            <InfoField label="Thời gian" value={formatDateTime(event.createdAt)} />
            <InfoField label="Session" value={event.sessionId || "Chưa có"} />
            <InfoField label="Lead ID" value={event.leadId || "Chưa gắn"} />
          </div>
        </div>
      </DashboardSurfaceCard>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,0.94fr)_minmax(340px,1.06fr)]">
        <div className="space-y-6">
          <DashboardSurfaceCard className="p-5 sm:p-6">
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Thông tin đi kèm event</h2>
            <div className={`mt-6 space-y-3 ${dashboardScrollAreaClasses("card")}`}>
              {metadataEntries.length > 0 ? (
                metadataEntries.map(([key, value]) => (
                  <div key={key} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{key}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-600">{value}</div>
                  </div>
                ))
              ) : (
                <DashboardEmptyState message="Event này chưa có metadata bổ sung." />
              )}
            </div>
          </DashboardSurfaceCard>

          <DashboardSurfaceCard className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Mở nhanh event tương tự</h2>
              </div>
              <Link href="/dashboard/analytics" className={dashboardButtonClasses("outline")}>
                Xem hết analytics
              </Link>
            </div>
            <div className={`mt-6 space-y-3 ${dashboardScrollAreaClasses("card")}`}>
              {similarEvents.length > 0 ? (
                similarEvents.map((item) => (
                  <Link
                    key={item.id}
                    href={`/dashboard/events/${item.id}`}
                    className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-sm font-black text-slate-950">{item.name}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{item.source}</div>
                      </div>
                      <div className="text-xs font-semibold text-slate-500">{formatDateTime(item.createdAt)}</div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
                  </Link>
                ))
              ) : (
                <DashboardEmptyState message="Chưa có event tương tự để so sánh." />
              )}
            </div>
          </DashboardSurfaceCard>
        </div>

        <div className="space-y-6">
          <DashboardSurfaceCard className="p-5 sm:p-6">
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Kết nối với hồ sơ khách</h2>
            {relatedLead ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap gap-2">
                  <DashboardBadge className={getLeadSourceTone(relatedLead.source)}>{getLeadSourceLabel(relatedLead.source)}</DashboardBadge>
                  <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${getHotnessTone(relatedLead.hotness)}`}>
                    {relatedLead.hotness}
                  </span>
                  <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${getStatusTone(relatedLead.status)}`}>
                    {relatedLead.status}
                  </span>
                </div>
                <div className="mt-4 text-xl font-black tracking-tight text-slate-950">{getLeadDisplayName(relatedLead)}</div>
                <p className="mt-2 text-sm leading-7 text-slate-600">{getLeadPrimaryContact(relatedLead)} • {relatedLead.need} • {relatedLead.budget}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href={`/dashboard/leads/${relatedLead.id}`} className={dashboardButtonClasses()}>
                    Xem lead detail
                  </Link>
                  <Link href="/dashboard/leads" className={dashboardButtonClasses("outline")}>
                    Mở bảng lead
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <DashboardEmptyState message="Event này chưa gắn với lead cụ thể. Vẫn có thể dùng metadata và session để rà lại flow tương tác." />
              </div>
            )}
          </DashboardSurfaceCard>
        </div>
      </section>
    </div>
  );
}
