import Link from "next/link";
import { Activity, ArrowRight, ChartColumn, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardSnapshot } from "@/lib/dashboard-data";
import { DashboardFormSelect } from "../_components/dashboard-form-select";
import { DashboardStatCard } from "../_components/dashboard-stat-card";
import {
  DashboardEmptyState,
  DashboardPageIntro,
  formatDateTime,
  getDashboardEventLabel,
  getDashboardEventSummary
} from "../_components/dashboard-ui";
import { AnalyticsActivityChart } from "./_components/analytics-activity-chart";

export const dynamic = "force-dynamic";

type DashboardAnalyticsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function buildAnalyticsHref(filters: { event: string; source: string }, overrides: Partial<{ event: string; source: string }>) {
  const next = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (next.event) params.set("event", next.event);
  if (next.source) params.set("source", next.source);

  const query = params.toString();
  return query ? `/dashboard/analytics?${query}` : "/dashboard/analytics";
}

export default async function DashboardAnalyticsPage({ searchParams }: DashboardAnalyticsPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const filters = {
    event: getSingleValue(params?.event).trim(),
    source: getSingleValue(params?.source).trim()
  };

  const snapshot = await getDashboardSnapshot({
    leadLimit: 500,
    eventLimit: 700,
    recentLeadLimit: 20,
    recentEventLimit: 20
  });

  const filteredEvents = snapshot.allEvents.filter((event) => {
    if (filters.event && event.name !== filters.event) return false;
    if (filters.source && event.source !== filters.source) return false;
    return true;
  });

  const activeFilters = [
    filters.event ? `Event: ${getDashboardEventLabel(filters.event)}` : "",
    filters.source ? `Nguồn: ${filters.source}` : ""
  ].filter(Boolean);

  const summaryCards = [
    {
      title: "Sự kiện hôm nay",
      description: "Trong ngày",
      value: snapshot.overview.todayEvents,
      icon: Activity
    },
    {
      title: "Lead hôm nay",
      description: "Lead mới",
      value: snapshot.overview.todayLeads,
      icon: Users
    },
    {
      title: "Sự kiện đang xem",
      description: activeFilters.length > 0 ? "Theo bộ lọc" : "Toàn bộ feed",
      value: filteredEvents.length,
      icon: Sparkles
    },
    {
      title: "Loại sự kiện",
      description: "Danh mục event",
      value: snapshot.eventBreakdown.length,
      icon: ChartColumn
    }
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <DashboardPageIntro
        eyebrow="Phân tích"
        title="Theo dõi activity"
        description="Xem nhịp chat, form và click theo ngày, rồi lọc nhanh để kiểm tra đúng loại event đang cần."
        badges={[
          { label: `${filteredEvents.length} sự kiện đang xem`, variant: "primary-light" },
          { label: `${activeFilters.length} bộ lọc`, variant: activeFilters.length > 0 ? "warning-light" : "info-light" },
          { label: `${snapshot.eventBreakdown.length} loại event`, variant: "success-light" }
        ]}
        actions={
          <>
            {activeFilters.length > 0 ? (
              <Button asChild variant="outline">
                <Link href="/dashboard/analytics">Xóa lọc</Link>
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link href="/dashboard/leads">Mở lead</Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <DashboardStatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            badge={card.description}
            note={
              card.title === "Sự kiện đang xem"
                ? activeFilters.length > 0
                  ? "Danh sách đã được thu hẹp theo bộ lọc hiện tại."
                  : "Đang đọc toàn bộ feed activity."
                : undefined
            }
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc activity</CardTitle>
          <CardDescription>Lọc nhanh theo tên event hoặc nguồn phát sinh.</CardDescription>
          <CardAction className="flex flex-wrap gap-2">
            <Badge variant="outline">{filteredEvents.length} event</Badge>
            {activeFilters.length > 0 ? <Badge variant="secondary">Đang lọc</Badge> : <Badge variant="outline">Toàn bộ feed</Badge>}
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeFilters.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          ) : null}

          <form method="get" className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Tên event</span>
              <DashboardFormSelect
                name="event"
                defaultValue={filters.event}
                emptyOptionLabel="Tất cả event"
                placeholder="Tất cả event"
                triggerClassName="h-9 rounded-md"
                options={snapshot.eventBreakdown.map((item) => ({
                  value: item.label,
                  label: getDashboardEventLabel(item.label)
                }))}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Nguồn</span>
              <DashboardFormSelect
                name="source"
                defaultValue={filters.source}
                emptyOptionLabel="Tất cả nguồn"
                placeholder="Tất cả nguồn"
                triggerClassName="h-9 rounded-md"
                options={Array.from(new Set(snapshot.allEvents.map((event) => event.source))).map((source) => ({
                  value: source,
                  label: source
                }))}
              />
            </label>

            <div className="flex flex-wrap gap-2 self-end">
              <Button type="submit">Áp dụng</Button>
              {filters.event || filters.source ? (
                <Button asChild variant="outline">
                  <Link href="/dashboard/analytics">Xóa lọc</Link>
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>7 ngày gần đây</CardTitle>
            <CardDescription>Tổng hợp activity theo ngày, gồm event và lead mới.</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsActivityChart data={snapshot.activityTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sự kiện nổi bật</CardTitle>
            <CardDescription>Nhóm event xuất hiện nhiều nhất trong feed hiện tại.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.eventBreakdown.slice(0, 8).map((item) => (
              <Link key={item.label} href={buildAnalyticsHref(filters, { event: item.label })} className="block rounded-lg border p-4 transition hover:bg-muted/50">
                <div className="mb-2 flex items-start justify-between gap-3 text-sm">
                  <div>
                    <div className="font-medium">{getDashboardEventLabel(item.label)}</div>
                    <div className="mt-1 text-muted-foreground text-xs leading-5">{getDashboardEventSummary(item.label, "Không có metadata bổ sung")}</div>
                  </div>
                  <span className="tabular-nums">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${item.share}%` }} />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {[
          { title: "Theo nguồn", items: snapshot.sourceBreakdown, hrefKey: "source" as const },
          { title: "Theo nhu cầu", items: snapshot.needBreakdown, hrefKey: null },
          { title: "Theo trạng thái", items: snapshot.statusBreakdown, hrefKey: null }
        ].map((group) => (
          <Card key={group.title}>
            <CardHeader>
              <CardTitle>{group.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {group.items.slice(0, 6).map((item) => {
                const href =
                  group.hrefKey === "source" ? buildAnalyticsHref(filters, { source: item.label }) : `/dashboard/leads?${group.title === "Theo nhu cầu" ? `need=${encodeURIComponent(item.label)}` : `status=${encodeURIComponent(item.label)}`}`;

                return (
                  <Link key={item.label} href={href} className="block rounded-lg border p-4 transition hover:bg-muted/50">
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium">{item.label}</span>
                      <span className="tabular-nums">{item.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${item.share}%` }} />
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity gần đây</CardTitle>
          <CardDescription>Danh sách event gần đây nhất sau khi áp dụng bộ lọc.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredEvents.slice(0, 12).map((event) => (
            <Link key={event.id} href={`/dashboard/events/${event.id}`} className="block rounded-lg border p-4 transition hover:bg-muted/50">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <div className="font-medium">{getDashboardEventLabel(event.name)}</div>
                  <div className="text-muted-foreground text-sm uppercase">{event.source}</div>
                </div>
                <div className="text-muted-foreground text-sm">{formatDateTime(event.createdAt)}</div>
              </div>
              <p className="mt-3 text-muted-foreground text-sm leading-6">{getDashboardEventSummary(event.name, event.summary)}</p>
            </Link>
          ))}

          {filteredEvents.length === 0 ? (
            <DashboardEmptyState
              title="Không có event phù hợp"
              message="Thử xóa bớt điều kiện lọc hoặc chọn lại nguồn để xem thêm activity."
              action={
                activeFilters.length > 0 ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/analytics">Xóa lọc</Link>
                  </Button>
                ) : undefined
              }
              compact
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
