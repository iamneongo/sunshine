import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarCheck2,
  Flame,
  PhoneCall,
  Sparkles,
  UserCheck,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardSnapshot } from "@/lib/dashboard-data";
import { DashboardStatCard } from "../_components/dashboard-stat-card";
import {
  DashboardEmptyState,
  DashboardPageIntro,
  formatDateTime,
  getDashboardEventLabel,
  getDashboardEventSummary,
  getLeadDisplayName,
  getRecommendedFollowUp
} from "../_components/dashboard-ui";
import { OverviewActivityChart } from "./_components/overview-activity-chart";
import { OverviewBreakdownChart } from "./_components/overview-breakdown-chart";

export const dynamic = "force-dynamic";

const metricIconTone = [
  "bg-primary/10 text-primary",
  "bg-orange-500/10 text-orange-500",
  "bg-sky-500/10 text-sky-500",
  "bg-emerald-500/10 text-emerald-500",
  "bg-violet-500/10 text-violet-500",
  "bg-amber-500/10 text-amber-500"
] as const;

export default async function DashboardOverviewPage() {
  const snapshot = await getDashboardSnapshot({
    leadLimit: 500,
    eventLimit: 500,
    recentLeadLimit: 20,
    recentEventLimit: 12
  });

  const priorityLeads = snapshot.allLeads
    .filter((lead) => lead.hotness === "Nóng" || lead.status === "Đặt lịch" || lead.tags.includes("can_goi_ngay"))
    .slice(0, 6);

  const overviewCards = [
    {
      title: "Tổng lead",
      description: "Toàn hệ thống",
      value: snapshot.overview.totalLeads,
      note: "Toàn bộ lead từ form và chatbot",
      icon: Users,
      tone: metricIconTone[0],
      href: "/dashboard/leads"
    },
    {
      title: "Lead nóng",
      description: "Ưu tiên",
      value: snapshot.overview.hotLeads,
      note: "Nhóm cần gọi hoặc nhắn trước",
      icon: Flame,
      tone: metricIconTone[1],
      href: "/dashboard/leads?hotness=N%C3%B3ng"
    },
    {
      title: "Chưa gọi",
      description: "Bước đầu",
      value: snapshot.overview.pendingCalls,
      note: "Lead chưa được chạm ở vòng đầu",
      icon: PhoneCall,
      tone: metricIconTone[2],
      href: "/dashboard/leads?status=Ch%C6%B0a+g%E1%BB%8Di"
    },
    {
      title: "Lịch hẹn",
      description: "Xem dự án",
      value: snapshot.overview.appointments,
      note: "Lead đã vào giai đoạn hẹn xem",
      icon: CalendarCheck2,
      tone: metricIconTone[3],
      href: "/dashboard/follow-up"
    },
    {
      title: "Đủ thông tin",
      description: "Đã rõ nhu cầu",
      value: snapshot.overview.qualifiedLeads,
      note: "Đã rõ nhu cầu và ngân sách",
      icon: UserCheck,
      tone: metricIconTone[4],
      href: "/dashboard/leads"
    },
    {
      title: "Touchpoint hôm nay",
      description: "Trong ngày",
      value: snapshot.overview.todayEvents,
      note: "Gồm chat, click và form",
      icon: ArrowRight,
      tone: metricIconTone[5],
      href: "/dashboard/analytics"
    }
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <DashboardPageIntro
        eyebrow="Dashboard"
        title="Tổng quan vận hành"
        description="Ưu tiên nhìn card và chart trước để nắm nhịp lead, trạng thái xử lý và activity mới trong vài giây."
        badges={[
          { label: `${snapshot.overview.todayLeads} lead hôm nay`, variant: "primary-light" },
          { label: `${snapshot.overview.todayEvents} touchpoint hôm nay`, variant: "info-light" },
          { label: `${snapshot.overview.hotLeads} lead nóng`, variant: "warning-light" }
        ]}
        actions={
          <>
            <Button asChild>
              <Link href="/dashboard/leads">Mở lead</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/follow-up">Follow-up</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/analytics">Analytics</Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {overviewCards.map((card) => (
          <DashboardStatCard
            key={card.title}
            className="xl:col-span-2"
            title={card.title}
            value={card.value}
            icon={card.icon}
            iconToneClass={card.tone}
            badge={card.description}
            badgeVariant="primary-light"
            note={card.note}
            href={card.href}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)]">
        <Card className="border-border/80">
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-[0.22em]">
              <Activity className="size-3.5" />
              Activity
            </div>
            <CardTitle>Nhịp lead và touchpoint 7 ngày</CardTitle>
            <CardDescription>Xu hướng lead mới và touchpoint phát sinh theo ngày.</CardDescription>
            <CardAction>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/analytics">Mở analytics</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <OverviewActivityChart data={snapshot.activityTrend} />
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-[0.22em]">
              <Sparkles className="size-3.5" />
              Breakdown
            </div>
            <CardTitle>Nguồn lead</CardTitle>
            <CardDescription>Nhìn nhanh lead đang đến từ kênh nào để ưu tiên xử lý.</CardDescription>
            <CardAction>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/leads">Xem lead</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <OverviewBreakdownChart items={snapshot.sourceBreakdown} variant="donut" centerLabel="Nguồn" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle>Trạng thái xử lý lead</CardTitle>
            <CardDescription>Nhìn nhanh bottleneck trước khi mở danh sách chi tiết.</CardDescription>
          </CardHeader>
          <CardContent>
            <OverviewBreakdownChart items={snapshot.statusBreakdown} variant="bar" />
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle>Độ nóng lead</CardTitle>
            <CardDescription>Tỷ trọng lead nóng, ấm và lạnh để chia nhịp xử lý.</CardDescription>
          </CardHeader>
          <CardContent>
            <OverviewBreakdownChart items={snapshot.hotnessBreakdown} variant="donut" centerLabel="Hotness" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle>Lead nên xử lý trước</CardTitle>
            <CardDescription>Mở nhanh nhóm lead ưu tiên sau khi đọc card và chart.</CardDescription>
            <CardAction>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/follow-up">Follow-up</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {priorityLeads.length > 0 ? (
              priorityLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/dashboard/leads/${lead.id}`}
                  className="rounded-[1.15rem] border border-border/70 p-4 transition hover:bg-muted/40"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{getLeadDisplayName(lead)}</div>
                      <div className="text-muted-foreground text-sm">
                        {lead.need} • {lead.budget}
                      </div>
                    </div>
                    <div className="text-muted-foreground text-sm">{lead.status}</div>
                  </div>
                  <p className="mt-3 text-muted-foreground text-sm leading-6">{getRecommendedFollowUp(lead)}</p>
                </Link>
              ))
            ) : (
              <DashboardEmptyState
                title="Chưa có lead ưu tiên"
                message="Khi lead đạt độ nóng cao hoặc có lịch hẹn, danh sách này sẽ hiện ngay tại đây."
                compact
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle>Activity gần đây</CardTitle>
            <CardDescription>Dòng event mới nhất để kiểm tra nhịp tương tác thực tế.</CardDescription>
            <CardAction>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/analytics">Analytics</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {snapshot.recentEvents.length > 0 ? (
              snapshot.recentEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/dashboard/events/${event.id}`}
                  className="rounded-[1.15rem] border border-border/70 p-4 transition hover:bg-muted/40"
                >
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
                message="Khi form, chatbot hoặc click phát sinh event, danh sách này sẽ cập nhật ngay."
                compact
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
