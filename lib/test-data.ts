import {
  deleteAnalyticsEventsByIds,
  listAnalyticsEvents,
  type AnalyticsEventRecord
} from "@/lib/event-store";
import {
  deleteLeadsByIds,
  listLeads,
  type LeadRecord
} from "@/lib/lead-store";
import {
  deleteSupabaseEventsByIds,
  deleteSupabaseLeadsByIds,
  isSupabaseConfigured,
  listSupabaseEvents,
  listSupabaseLeads
} from "@/lib/supabase-rest";

export const CLEAR_TEST_DATA_CONFIRM_PHRASE = "XOA DATA TEST";
export const CLEAR_USER_DATA_CONFIRM_PHRASE = "XOA DATA NGUOI DUNG";

const TEST_TOKENS = [
  "qa",
  "test",
  "codex",
  "smoke",
  "dummy",
  "demo",
  "healthcheck",
  "browser",
  "example.com",
  "example.net",
  "sample",
  "fake"
];

const USER_EVENT_SOURCES = new Set<AnalyticsEventRecord["source"]>(["landing", "chatbot"]);

type CleanupAuditItem = {
  id: string;
  label: string;
  source: string;
  createdAt: string;
};

type BaseDataAudit = {
  leadCount: number;
  eventCount: number;
  totalCount: number;
  leadItems: CleanupAuditItem[];
  eventItems: CleanupAuditItem[];
  localLeadIds: string[];
  localEventIds: string[];
  supabaseLeadIds: string[];
  supabaseEventIds: string[];
  supabaseConfigured: boolean;
};

type BaseClearDataResult = {
  leadCount: number;
  eventCount: number;
  totalCount: number;
  localLeadRemoved: number;
  localEventRemoved: number;
  supabaseLeadRemoved: number;
  supabaseEventRemoved: number;
};

export type TestDataAudit = BaseDataAudit;
export type UserDataAudit = BaseDataAudit;
export type ClearTestDataResult = BaseClearDataResult;
export type ClearUserDataResult = BaseClearDataResult;

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function includesTestToken(value: string): boolean {
  const normalized = normalizeText(value);
  return normalized ? TEST_TOKENS.some((token) => normalized.includes(token)) : false;
}

function collectLeadValues(lead: LeadRecord): string[] {
  return [
    lead.fullName,
    lead.phone,
    lead.zalo,
    lead.email,
    lead.notes,
    lead.lastMessage,
    lead.projectName,
    lead.need,
    lead.budget,
    lead.contactPreference,
    ...Object.entries(lead.metadata).flatMap(([key, value]) => [key, value])
  ];
}

function collectEventValues(event: AnalyticsEventRecord): string[] {
  return [
    event.name,
    event.source,
    event.sessionId,
    event.path,
    ...Object.entries(event.metadata).flatMap(([key, value]) => [key, value])
  ];
}

export function isLikelyTestLead(lead: LeadRecord): boolean {
  if (collectLeadValues(lead).some((value) => includesTestToken(value))) {
    return true;
  }

  const email = normalizeText(lead.email);
  if (email.includes("@example.") || email.startsWith("test@") || email.startsWith("demo@")) {
    return true;
  }

  return false;
}

export function isLikelyTestEvent(event: AnalyticsEventRecord): boolean {
  return collectEventValues(event).some((value) => includesTestToken(value));
}

export function isLikelyUserLead(lead: LeadRecord): boolean {
  return !isLikelyTestLead(lead);
}

function createUserEventMatcher(userLeadIds: Set<string>) {
  return (event: AnalyticsEventRecord) => {
    if (isLikelyTestEvent(event)) {
      return false;
    }

    if (event.leadId && userLeadIds.has(event.leadId)) {
      return true;
    }

    return USER_EVENT_SOURCES.has(event.source);
  };
}

function sortByDateDesc<T extends { createdAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const map = new Map<string, T>();

  for (const item of items) {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  }

  return Array.from(map.values());
}

function mapLeadPreview(lead: LeadRecord, fallbackLabel: string): CleanupAuditItem {
  return {
    id: lead.id,
    label: lead.fullName || lead.email || lead.phone || lead.zalo || fallbackLabel,
    source: lead.source,
    createdAt: lead.createdAt
  };
}

function mapEventPreview(event: AnalyticsEventRecord, fallbackLabel: string): CleanupAuditItem {
  return {
    id: event.id,
    label: event.name || fallbackLabel,
    source: event.source,
    createdAt: event.createdAt
  };
}

async function loadAuditSources() {
  const supabaseConfigured = isSupabaseConfigured();
  const localLeads = await listLeads(5000);
  const localEvents = await listAnalyticsEvents(5000);

  let supabaseLeads: LeadRecord[] = [];
  let supabaseEvents: AnalyticsEventRecord[] = [];

  if (supabaseConfigured) {
    try {
      [supabaseLeads, supabaseEvents] = await Promise.all([listSupabaseLeads(5000), listSupabaseEvents(5000)]);
    } catch (error) {
      console.error("Unable to read Supabase records for maintenance audit", error);
    }
  }

  return {
    supabaseConfigured,
    localLeads,
    localEvents,
    supabaseLeads,
    supabaseEvents
  };
}

function buildAuditResult({
  localLeads,
  localEvents,
  supabaseLeads,
  supabaseEvents,
  supabaseConfigured,
  leadFallbackLabel,
  eventFallbackLabel
}: {
  localLeads: LeadRecord[];
  localEvents: AnalyticsEventRecord[];
  supabaseLeads: LeadRecord[];
  supabaseEvents: AnalyticsEventRecord[];
  supabaseConfigured: boolean;
  leadFallbackLabel: string;
  eventFallbackLabel: string;
}): BaseDataAudit {
  const uniqueLeads = dedupeById([...supabaseLeads, ...localLeads]);
  const uniqueEvents = dedupeById([...supabaseEvents, ...localEvents]);

  return {
    leadCount: uniqueLeads.length,
    eventCount: uniqueEvents.length,
    totalCount: uniqueLeads.length + uniqueEvents.length,
    leadItems: uniqueLeads.slice(0, 8).map((lead) => mapLeadPreview(lead, leadFallbackLabel)),
    eventItems: uniqueEvents.slice(0, 8).map((event) => mapEventPreview(event, eventFallbackLabel)),
    localLeadIds: localLeads.map((item) => item.id),
    localEventIds: localEvents.map((item) => item.id),
    supabaseLeadIds: supabaseLeads.map((item) => item.id),
    supabaseEventIds: supabaseEvents.map((item) => item.id),
    supabaseConfigured
  };
}

async function clearAuditData(currentAudit: BaseDataAudit): Promise<BaseClearDataResult> {
  const [localLeadRemoved, localEventRemoved] = await Promise.all([
    deleteLeadsByIds(currentAudit.localLeadIds),
    deleteAnalyticsEventsByIds(currentAudit.localEventIds)
  ]);

  let supabaseLeadRemoved = 0;
  let supabaseEventRemoved = 0;

  if (currentAudit.supabaseConfigured) {
    [supabaseLeadRemoved, supabaseEventRemoved] = await Promise.all([
      deleteSupabaseLeadsByIds(currentAudit.supabaseLeadIds),
      deleteSupabaseEventsByIds(currentAudit.supabaseEventIds)
    ]);
  }

  return {
    leadCount: currentAudit.leadCount,
    eventCount: currentAudit.eventCount,
    totalCount: currentAudit.totalCount,
    localLeadRemoved,
    localEventRemoved,
    supabaseLeadRemoved,
    supabaseEventRemoved
  };
}

export async function getTestDataAudit(): Promise<TestDataAudit> {
  const { supabaseConfigured, localLeads, localEvents, supabaseLeads, supabaseEvents } = await loadAuditSources();

  const localTestLeads = sortByDateDesc(localLeads.filter(isLikelyTestLead));
  const localTestEvents = sortByDateDesc(localEvents.filter(isLikelyTestEvent));
  const supabaseTestLeads = sortByDateDesc(supabaseLeads.filter(isLikelyTestLead));
  const supabaseTestEvents = sortByDateDesc(supabaseEvents.filter(isLikelyTestEvent));

  return buildAuditResult({
    localLeads: localTestLeads,
    localEvents: localTestEvents,
    supabaseLeads: supabaseTestLeads,
    supabaseEvents: supabaseTestEvents,
    supabaseConfigured,
    leadFallbackLabel: "Lead test",
    eventFallbackLabel: "Event test"
  });
}

export async function clearTestData(audit?: TestDataAudit): Promise<ClearTestDataResult> {
  const currentAudit = audit ?? (await getTestDataAudit());
  return clearAuditData(currentAudit);
}

export async function getUserDataAudit(): Promise<UserDataAudit> {
  const { supabaseConfigured, localLeads, localEvents, supabaseLeads, supabaseEvents } = await loadAuditSources();

  const localUserLeads = sortByDateDesc(localLeads.filter(isLikelyUserLead));
  const supabaseUserLeads = sortByDateDesc(supabaseLeads.filter(isLikelyUserLead));
  const localUserLeadIds = new Set(localUserLeads.map((lead) => lead.id));
  const supabaseUserLeadIds = new Set(supabaseUserLeads.map((lead) => lead.id));
  const localUserEvents = sortByDateDesc(localEvents.filter(createUserEventMatcher(localUserLeadIds)));
  const supabaseUserEvents = sortByDateDesc(supabaseEvents.filter(createUserEventMatcher(supabaseUserLeadIds)));

  return buildAuditResult({
    localLeads: localUserLeads,
    localEvents: localUserEvents,
    supabaseLeads: supabaseUserLeads,
    supabaseEvents: supabaseUserEvents,
    supabaseConfigured,
    leadFallbackLabel: "Lead người dùng",
    eventFallbackLabel: "Event người dùng"
  });
}

export async function clearUserData(audit?: UserDataAudit): Promise<ClearUserDataResult> {
  const currentAudit = audit ?? (await getUserDataAudit());
  return clearAuditData(currentAudit);
}
