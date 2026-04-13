import Link from "next/link";
import { ArrowRight, CalendarCheck2, PhoneCall, Send, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardSnapshot } from "@/lib/dashboard-data";
import { DashboardStatCard } from "../_components/dashboard-stat-card";
import {
  DashboardEmptyState,
  DashboardPageIntro,
  buildLeadQuickActions,
  formatDateTime,
  getDashboardEventLabel,
  getDashboardEventSummary,
  getHotnessTone,
  getLeadDisplayName,
  getRecommendedFollowUp,
  getStatusTone
} from "../_components/dashboard-ui";

export const dynamic = "force-dynamic";

const summaryCardIcons = [
  { icon: Sparkles, tone: "bg-primary/10 text-primary" },
  { icon: CalendarCheck2, tone: "bg-emerald-500/10 text-emerald-500" },
  { icon: Send, tone: "bg-sky-500/10 text-sky-500" },
  { icon: PhoneCall, tone: "bg-orange-500/10 text-orange-500" }
] as const;

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
      title: "Cần gọi ngay",
      value: snapshot.allLeads.filter((lead) => lead.tags.includes("can_goi_ngay")).length,
      description: "Lead có tag cần chạm sale trong phiên hiện tại.",
      href: "/dashboard/leads?hotness=N%C3%B3ng"
    },
    {
      title: "Đang chờ lịch xem",
      value: snapshot.allLeads.filter((lead) => lead.status === "Đặt lịch").length,
      description: "Nhóm nên xác nhận lại thời gian và vị trí xem dự án.",
      href: "/dashboard/leads?status=%C4%90%E1%BA%B7t+l%E1%BB%8Bch"
    },
    {
      title: "Đã gửi thông tin",
      value: snapshot.allLeads.filter((lead) => lead.status === "Đã gửi thông tin").length,
      description: "Nhóm cần follow-up sau khi đã nhận bảng giá hoặc video.",
      href: "/dashboard/leads?status=%C4%90%C3%A3+g%E1%BB%ADi+th%C3%B4ng+tin"
    },
    {
      title: "Touchpoint hôm nay",
      value: snapshot.overview.todayEvents,
      description: "Event mới tạo ra trong ngày để theo dõi nhịp xử lý.",
      href: "/dashboard/analytics"
    }
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <DashboardPageIntro
        eyebrow="Follow-up"
        title="Ưu tiên lead cần xử lý"
        description="Tập trung vào nhóm lead nóng, lead đã nhận tài liệu và lead đang ở giai đoạn chốt lịch để đội sale thao tác nhanh hơn."
        badges={[
          { label: `${snapshot.allLeads.filter((lead) => lead.tags.includes("can_goi_ngay")).length} cần gọi ngay`, variant: "warning-light" },
          { label: `${snapshot.allLeads.filter((lead) => lead.status === "Đặt lịch").length} đang chờ lịch`, variant: "success-light" },
          { label: `${snapshot.overview.todayEvents} touchpoint hôm nay`, variant: "info-light" }
        ]}
        actions={
          <>
            <Button asChild>
              <Link href="/dashboard/leads?hotness=N%C3%B3ng">Lead nóng</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/leads">Danh sách lead</Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-4">
        {actionBuckets.map((card, index) => {
          const Icon = summaryCardIcons[index]?.icon ?? Sparkles;
          const tone = summaryCardIcons[index]?.tone ?? "bg-primary/10 text-primary";

          return (
            <DashboardStatCard
              key={card.title}
              title={card.title}
              value={card.value}
              icon={Icon}
              iconToneClass={tone}
              note={card.description}
              href={card.href}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Hàng đợi ưu tiên</CardTitle>
            <CardDescription>Nhóm lead nên xử lý trước theo độ nóng, lịch hẹn và tag ưu tiên.</CardDescription>
            <CardAction>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/leads">Danh sách lead</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {priorityLeads.length > 0 ? (
              priorityLeads.map((lead) => {
                const quickActions = buildLeadQuickActions(lead);

                return (
                  <div key={lead.id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <Link href={`/dashboard/leads/${lead.id}`} className="font-medium hover:underline">
                          {getLeadDisplayName(lead)}
                        </Link>
                        <div className="text-muted-foreground text-sm">
                          {lead.need} • {lead.budget}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getHotnessTone(lead.hotness)} variant="outline">
                          {lead.hotness}
                        </Badge>
                        <Badge className={getStatusTone(lead.status)} variant="outline">
                          {lead.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="mt-3 text-muted-foreground text-sm leading-6">{getRecommendedFollowUp(lead)}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button asChild size="sm">
                        <Link href={`/dashboard/leads/${lead.id}`}>Mở lead</Link>
                      </Button>
                      {quickActions.slice(0, 2).map((action) => (
                        <Button key={`${lead.id}-${action.label}`} asChild size="sm" variant="outline">
                          <a href={action.href} target={action.external ? "_blank" : undefined} rel={action.external ? "noreferrer" : undefined}>
                            {action.label}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <DashboardEmptyState
                title="Queue đang trống"
                message="Khi lead nóng, đã xin giá hoặc có lịch hẹn, hệ thống sẽ đẩy vào danh sách này."
                compact
              />
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Checklist nhanh</CardTitle>
              <CardDescription>Ba việc nên làm trước để giữ nhịp sale trong ca hiện tại.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Gọi nhóm lead nóng hoặc lead đã xin giá nhưng chưa phản hồi.",
                "Xác nhận lại lịch hẹn đã tạo để tránh sót vị trí và thời gian.",
                "So sánh touchpoint hôm nay với nhịp lead mới để phát hiện bất thường."
              ].map((item, index) => (
                <div key={item} className="flex gap-3 rounded-lg border p-4 text-sm leading-6">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div>{item}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity gần đây</CardTitle>
              <CardDescription>Dòng event gần nhất để đội sale không bỏ lỡ nhịp tương tác.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {snapshot.recentEvents.length > 0 ? (
                snapshot.recentEvents.slice(0, 8).map((event) => (
                  <Link key={event.id} href={`/dashboard/events/${event.id}`} className="rounded-lg border p-4 transition hover:bg-muted/50">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-1">
                        <div className="font-medium">{getDashboardEventLabel(event.name)}</div>
                        <div className="text-muted-foreground text-sm uppercase">{event.source}</div>
                      </div>
                      <div className="text-muted-foreground text-sm">{formatDateTime(event.createdAt)}</div>
                    </div>
                    <p className="mt-3 text-muted-foreground text-sm leading-6">{getDashboardEventSummary(event.name, event.summary)}</p>
                  </Link>
                ))
              ) : (
                <DashboardEmptyState
                  title="Chưa có activity mới"
                  message="Event mới từ chatbot, form hoặc click sẽ hiện ở đây để đội sale bám theo."
                  compact
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
