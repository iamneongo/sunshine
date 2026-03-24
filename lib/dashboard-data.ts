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

function isValidDate(value: string): boolean {
  return !Number.isNaN(new Date(value).getTime());
}

function countToday<T>(items: T[], getDate: (item: T) => string): number {
  const now = new Date();
  const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

  return items.filter((item) => {
    const date = new Date(getDate(item));
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return key === todayKey;
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

function buildLeadTrend(leads: LeadRecord[], days = 7): TrendItem[] {
  const formatter = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" });
  const buckets = new Map<string, number>();
  const labels: string[] = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - offset);
    const key = date.toISOString().slice(0, 10);
    buckets.set(key, 0);
    labels.push(key);
  }

  for (const lead of leads) {
    if (!isValidDate(lead.createdAt)) {
      continue;
    }

    const key = new Date(lead.createdAt).toISOString().slice(0, 10);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  return labels.map((key) => ({
    label: formatter.format(new Date(`${key}T00:00:00`)),
    value: buckets.get(key) ?? 0
  }));
}

function summarizeEvent(event: AnalyticsEventRecord): string {
  const priorityKeys = ["prompt", "placement", "need", "budget", "source", "product_title"];
  const parts = priorityKeys
    .map((key) => event.metadata[key])
    .filter((value): value is string => typeof value === "string" && Boolean(value))
    .slice(0, 2);

  return parts.join(" | ") || "Không có metadata bổ sung";
}

export async function getDashboardSnapshot() {
  const [leadDataset, eventDataset] = await Promise.all([getLeadDataset(250), getAnalyticsEventDataset(400)]);

  const leads = leadDataset.leads;
  const events = eventDataset.events;
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
    leadTrend: buildLeadTrend(leads),
    recentLeads: leads.slice(0, 12),
    recentEvents: events.slice(0, 12).map((event) => ({
      ...event,
      summary: summarizeEvent(event)
    }))
  };
}
