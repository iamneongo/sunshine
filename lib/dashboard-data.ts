import { getAnalyticsEventDataset, getLeadDataset } from "@/lib/crm-data";
import type { AnalyticsEventRecord } from "@/lib/event-store";
import type { LeadRecord } from "@/lib/lead-store";

type BreakdownItem = {
  label: string;
  count: number;
  share: number;
};

type TrendItem = {
  label: string;
  value: number;
};

type ActivityTrendItem = {
  label: string;
  total: number;
  leadCount: number;
  eventCount: number;
};

type DashboardSnapshotOptions = {
  leadLimit?: number;
  eventLimit?: number;
  recentLeadLimit?: number;
  recentEventLimit?: number;
};

const DASHBOARD_TIME_ZONE = process.env.DASHBOARD_TIME_ZONE?.trim() || "Asia/Ho_Chi_Minh";
const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: DASHBOARD_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});
const trendLabelFormatter = new Intl.DateTimeFormat("vi-VN", {
  timeZone: DASHBOARD_TIME_ZONE,
  day: "2-digit",
  month: "2-digit"
});

function isValidDate(value: string): boolean {
  return !Number.isNaN(new Date(value).getTime());
}

function getDateKeyInTimeZone(value: Date | string): string | null {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const parts = dateKeyFormatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return null;
  }

  return `${year}-${month}-${day}`;
}

function formatTrendLabelFromKey(key: string): string {
  return trendLabelFormatter.format(new Date(`${key}T00:00:00.000Z`));
}

function countToday<T>(items: T[], getDate: (item: T) => string): number {
  const todayKey = getDateKeyInTimeZone(new Date());

  if (!todayKey) {
    return 0;
  }

  return items.filter((item) => {
    const key = getDateKeyInTimeZone(getDate(item));
    return Boolean(key && key === todayKey);
  }).length;
}

function buildBreakdown(items: string[]): BreakdownItem[] {
  const total = items.length || 1;
  const counts = items.reduce<Map<string, number>>((acc, item) => {
    const label = item.trim() || "Chưa rõ";
    acc.set(label, (acc.get(label) ?? 0) + 1);
    return acc;
  }, new Map());

  return Array.from(counts.entries())
    .map(([label, count]) => ({
      label,
      count,
      share: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);
}

function buildTrendByDate<T>(items: T[], getDate: (item: T) => string, days = 7): TrendItem[] {
  const buckets = new Map<string, number>();
  const labels: string[] = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const key = getDateKeyInTimeZone(date);

    if (!key) {
      continue;
    }

    buckets.set(key, 0);
    labels.push(key);
  }

  for (const item of items) {
    const rawDate = getDate(item);

    if (!isValidDate(rawDate)) {
      continue;
    }

    const key = getDateKeyInTimeZone(rawDate);

    if (key && buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  return labels.map((key) => ({
    label: formatTrendLabelFromKey(key),
    value: buckets.get(key) ?? 0
  }));
}

function buildActivityTrend(leads: LeadRecord[], events: AnalyticsEventRecord[], days = 7): ActivityTrendItem[] {
  const keys: string[] = [];
  const buckets = new Map<
    string,
    {
      leadCount: number;
      eventCount: number;
    }
  >();

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const key = getDateKeyInTimeZone(date);

    if (!key) {
      continue;
    }

    keys.push(key);
    buckets.set(key, { leadCount: 0, eventCount: 0 });
  }

  for (const lead of leads) {
    if (!isValidDate(lead.createdAt)) {
      continue;
    }

    const key = getDateKeyInTimeZone(lead.createdAt);
    const bucket = key ? buckets.get(key) : null;

    if (bucket) {
      bucket.leadCount += 1;
    }
  }

  for (const event of events) {
    if (!isValidDate(event.createdAt)) {
      continue;
    }

    const key = getDateKeyInTimeZone(event.createdAt);
    const bucket = key ? buckets.get(key) : null;

    if (bucket) {
      bucket.eventCount += 1;
    }
  }

  return keys.map((key) => {
    const bucket = buckets.get(key) ?? { leadCount: 0, eventCount: 0 };

    return {
      label: formatTrendLabelFromKey(key),
      total: bucket.leadCount + bucket.eventCount,
      leadCount: bucket.leadCount,
      eventCount: bucket.eventCount
    };
  });
}

function summarizeEvent(event: AnalyticsEventRecord): string {
  const priorityKeys = ["prompt", "placement", "need", "budget", "source", "product_title"];
  const parts = priorityKeys
    .map((key) => event.metadata[key])
    .filter((value): value is string => typeof value === "string" && Boolean(value))
    .slice(0, 2);

  return parts.join(" | ") || "Không có metadata bổ sung";
}

async function buildDashboardSnapshot(options: DashboardSnapshotOptions = {}) {
  const {
    leadLimit = 250,
    eventLimit = 400,
    recentLeadLimit = 12,
    recentEventLimit = 12
  } = options;

  const [leadDataset, eventDataset] = await Promise.all([getLeadDataset(leadLimit), getAnalyticsEventDataset(eventLimit)]);

  const leads = leadDataset.leads;
  const events = eventDataset.events;
  const summarizedEvents = events.map((event) => ({
    ...event,
    summary: summarizeEvent(event)
  }));
  const hotLeads = leads.filter((lead) => lead.hotness === "Nóng").length;
  const warmLeads = leads.filter((lead) => lead.hotness === "Ấm").length;
  const appointments = leads.filter((lead) => lead.status === "Đặt lịch").length;
  const pendingCalls = leads.filter((lead) => lead.status === "Chưa gọi").length;
  const qualifiedLeads = leads.filter((lead) => lead.need !== "Chưa rõ" && lead.budget !== "Chưa rõ").length;

  return {
    generatedAt: new Date().toISOString(),
    connection: {
      supabaseConfigured: leadDataset.supabaseConfigured || eventDataset.supabaseConfigured,
      leadSource: leadDataset.source,
      eventSource: eventDataset.source
    },
    overview: {
      totalLeads: leads.length,
      hotLeads,
      warmLeads,
      appointments,
      pendingCalls,
      qualifiedLeads,
      todayLeads: countToday(leads, (lead) => lead.createdAt),
      todayEvents: countToday(events, (event) => event.createdAt)
    },
    sourceBreakdown: buildBreakdown(leads.map((lead) => lead.source)),
    hotnessBreakdown: buildBreakdown(leads.map((lead) => lead.hotness)),
    statusBreakdown: buildBreakdown(leads.map((lead) => lead.status)),
    budgetBreakdown: buildBreakdown(leads.map((lead) => lead.budget || "Chưa rõ")),
    needBreakdown: buildBreakdown(leads.map((lead) => lead.need)),
    eventBreakdown: buildBreakdown(events.map((event) => event.name)),
    leadTrend: buildTrendByDate(leads, (lead) => lead.createdAt),
    eventTrend: buildTrendByDate(events, (event) => event.createdAt),
    activityTrend: buildActivityTrend(leads, events),
    allLeads: leads,
    allEvents: summarizedEvents,
    recentLeads: leads.slice(0, recentLeadLimit),
    recentEvents: summarizedEvents.slice(0, recentEventLimit)
  };
}

export async function getDashboardSnapshot(options?: DashboardSnapshotOptions) {
  return buildDashboardSnapshot(options);
}

export async function getDashboardLeadDetail(leadId: string) {
  const snapshot = await buildDashboardSnapshot({
    leadLimit: 500,
    eventLimit: 700,
    recentLeadLimit: 16,
    recentEventLimit: 16
  });
  const lead = snapshot.allLeads.find((item) => item.id === leadId);

  if (!lead) {
    return null;
  }

  const relatedEvents = snapshot.allEvents.filter((event) => event.leadId === lead.id).slice(0, 12);
  const similarLeads = snapshot.allLeads
    .filter(
      (item) =>
        item.id !== lead.id &&
        (item.need === lead.need || item.budget === lead.budget || item.hotness === lead.hotness || item.status === lead.status)
    )
    .slice(0, 6);

  return {
    snapshot,
    lead,
    relatedEvents,
    similarLeads
  };
}

export async function getDashboardEventDetail(eventId: string) {
  const snapshot = await buildDashboardSnapshot({
    leadLimit: 500,
    eventLimit: 700,
    recentLeadLimit: 16,
    recentEventLimit: 16
  });
  const event = snapshot.allEvents.find((item) => item.id === eventId);

  if (!event) {
    return null;
  }

  const relatedLead = event.leadId ? snapshot.allLeads.find((lead) => lead.id === event.leadId) ?? null : null;
  const similarEvents = snapshot.allEvents
    .filter(
      (item) =>
        item.id !== event.id &&
        (item.name === event.name || (event.sessionId && item.sessionId === event.sessionId) || item.source === event.source)
    )
    .slice(0, 8);

  return {
    snapshot,
    event,
    relatedLead,
    similarEvents
  };
}
