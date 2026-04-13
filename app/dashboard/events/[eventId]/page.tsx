import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDashboardEventDetail } from "@/lib/dashboard-data";
import {
  formatDateTime,
  getDashboardEventLabel,
  getDashboardEventSummary,
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
    <div className="rounded-lg border p-4">
      <div className="text-muted-foreground text-xs uppercase tracking-wide">{label}</div>
      <div className="mt-2 text-sm font-medium leading-6">{value || "Chưa có"}</div>
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
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{event.source}</Badge>
            {event.path ? <Badge variant="outline">{event.path}</Badge> : null}
            <Badge variant="outline">{event.leadId ? "Có lead liên kết" : "Chưa gắn lead"}</Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{getDashboardEventLabel(event.name)}</h1>
          <p className="text-muted-foreground text-sm leading-6">{getDashboardEventSummary(event.name, event.summary)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/analytics">Về analytics</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/follow-up">Mở follow-up</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <InfoField label="Thời gian" value={formatDateTime(event.createdAt)} />
        <InfoField label="Loại event" value={getDashboardEventLabel(event.name)} />
        <InfoField label="Session" value={event.sessionId || "Chưa có"} />
        <InfoField label="Lead ID" value={event.leadId || "Chưa gắn"} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.94fr_1.06fr]">
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đi kèm event</CardTitle>
              <CardDescription>Metadata được lưu lại từ website, chatbot hoặc dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[420px] space-y-3 overflow-y-auto">
              {metadataEntries.length > 0 ? (
                metadataEntries.map(([key, value]) => (
                  <div key={key} className="rounded-lg border p-4">
                    <div className="text-muted-foreground text-xs uppercase tracking-wide">{key}</div>
                    <div className="mt-2 text-sm leading-6">{value}</div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-dashed p-5 text-muted-foreground text-sm">
                  Event này chưa có metadata bổ sung.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mở nhanh event tương tự</CardTitle>
              <CardAction>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/analytics">Xem hết analytics</Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="max-h-[420px] space-y-3 overflow-y-auto">
              {similarEvents.length > 0 ? (
                similarEvents.map((item) => (
                  <Link key={item.id} href={`/dashboard/events/${item.id}`} className="block rounded-lg border p-4 transition hover:bg-muted/50">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="font-medium">{getDashboardEventLabel(item.name)}</div>
                        <div className="mt-1 text-muted-foreground text-sm uppercase">{item.source}</div>
                      </div>
                      <div className="text-muted-foreground text-sm">{formatDateTime(item.createdAt)}</div>
                    </div>
                    <p className="mt-3 text-muted-foreground text-sm leading-6">{getDashboardEventSummary(item.name, item.summary)}</p>
                  </Link>
                ))
              ) : (
                <div className="rounded-lg border border-dashed p-5 text-muted-foreground text-sm">
                  Chưa có event tương tự để so sánh.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Kết nối với hồ sơ khách</CardTitle>
              <CardDescription>Đi sang lead tương ứng để xem lịch sử xử lý và hành động tiếp theo.</CardDescription>
            </CardHeader>
            <CardContent>
            {relatedLead ? (
              <div className="rounded-lg border p-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getLeadSourceTone(relatedLead.source)} variant="outline">
                    {getLeadSourceLabel(relatedLead.source)}
                  </Badge>
                  <Badge className={getHotnessTone(relatedLead.hotness)} variant="outline">
                    {relatedLead.hotness}
                  </Badge>
                  <Badge className={getStatusTone(relatedLead.status)} variant="outline">
                    {relatedLead.status}
                  </Badge>
                </div>
                <div className="mt-4 text-xl font-semibold tracking-tight">{getLeadDisplayName(relatedLead)}</div>
                <p className="mt-2 text-muted-foreground text-sm leading-7">
                  {getLeadPrimaryContact(relatedLead)} • {relatedLead.need} • {relatedLead.budget}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href={`/dashboard/leads/${relatedLead.id}`}>Xem lead detail</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/dashboard/leads">Mở bảng lead</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-5 text-muted-foreground text-sm">
                Event này chưa gắn với lead cụ thể. Vẫn có thể dùng metadata và session để rà lại flow tương tác.
              </div>
            )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
