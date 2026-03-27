import type { AnalyticsEventRecord } from "@/lib/event-store";
import { normalizeLeadBudget, normalizeLeadSource, type LeadRecord } from "@/lib/lead-store";

type SupabaseConfig = {
  url: string;
  key: string;
  leadsTable: string;
  eventsTable: string;
};

type SupabaseLeadRow = {
  id: string;
  created_at: string;
  updated_at: string;
  project_name: string;
  source: string;
  full_name: string;
  phone: string;
  zalo: string;
  email: string;
  need: string;
  budget: string;
  contact_preference: string;
  hotness: string;
  status: string;
  tags: string[];
  notes: string;
  preferred_callback_time: string;
  preferred_visit_time: string;
  travel_party: string;
  last_message: string;
  metadata: Record<string, string>;
};

type SupabaseEventRow = {
  id: string;
  created_at: string;
  name: string;
  source: string;
  lead_id: string;
  session_id: string;
  path: string;
  metadata: Record<string, string>;
};

function getSupabaseConfig(): SupabaseConfig | null {
  const url = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
  ).trim();

  if (!url || !key) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    key,
    leadsTable: (process.env.SUPABASE_LEADS_TABLE ?? "sales_leads").trim(),
    eventsTable: (process.env.SUPABASE_EVENTS_TABLE ?? "sales_events").trim()
  };
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseConfig());
}

async function supabaseRequest(pathname: string, init: RequestInit = {}): Promise<Response> {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error("Supabase is not configured");
  }

  const headers = new Headers(init.headers);
  headers.set("apikey", config.key);
  headers.set("Authorization", `Bearer ${config.key}`);

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${config.url}${pathname}`, {
    ...init,
    headers,
    cache: "no-store"
  });
}

function toSupabaseLeadRow(lead: LeadRecord): SupabaseLeadRow {
  return {
    id: lead.id,
    created_at: lead.createdAt,
    updated_at: lead.updatedAt,
    project_name: lead.projectName,
    source: lead.source,
    full_name: lead.fullName,
    phone: lead.phone,
    zalo: lead.zalo,
    email: lead.email,
    need: lead.need,
    budget: lead.budget,
    contact_preference: lead.contactPreference,
    hotness: lead.hotness,
    status: lead.status,
    tags: lead.tags,
    notes: lead.notes,
    preferred_callback_time: lead.preferredCallbackTime,
    preferred_visit_time: lead.preferredVisitTime,
    travel_party: lead.travelParty,
    last_message: lead.lastMessage,
    metadata: lead.metadata
  };
}

function fromSupabaseLeadRow(row: SupabaseLeadRow): LeadRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    projectName: row.project_name,
    source: normalizeLeadSource(row.source),
    fullName: row.full_name,
    phone: row.phone,
    zalo: row.zalo,
    email: row.email,
    need: row.need as LeadRecord["need"],
    budget: normalizeLeadBudget(row.budget),
    contactPreference: row.contact_preference as LeadRecord["contactPreference"],
    hotness: row.hotness as LeadRecord["hotness"],
    status: row.status as LeadRecord["status"],
    tags: Array.isArray(row.tags) ? (row.tags as LeadRecord["tags"]) : [],
    notes: row.notes,
    preferredCallbackTime: row.preferred_callback_time,
    preferredVisitTime: row.preferred_visit_time,
    travelParty: row.travel_party,
    lastMessage: row.last_message,
    metadata: row.metadata ?? {}
  };
}

function toSupabaseEventRow(event: AnalyticsEventRecord): SupabaseEventRow {
  return {
    id: event.id,
    created_at: event.createdAt,
    name: event.name,
    source: event.source,
    lead_id: event.leadId,
    session_id: event.sessionId,
    path: event.path,
    metadata: event.metadata
  };
}

function fromSupabaseEventRow(row: SupabaseEventRow): AnalyticsEventRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    source: row.source as AnalyticsEventRecord["source"],
    leadId: row.lead_id,
    sessionId: row.session_id,
    path: row.path,
    metadata: row.metadata ?? {}
  };
}

export async function syncLeadToSupabase(lead: LeadRecord): Promise<void> {
  const config = getSupabaseConfig();

  if (!config) {
    return;
  }

  const response = await supabaseRequest(`/rest/v1/${config.leadsTable}?on_conflict=id`, {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify([toSupabaseLeadRow(lead)])
  });

  if (!response.ok) {
    throw new Error(`Supabase lead sync failed with status ${response.status}`);
  }
}

export async function listSupabaseLeads(limit = 100): Promise<LeadRecord[]> {
  const config = getSupabaseConfig();

  if (!config) {
    return [];
  }

  const response = await supabaseRequest(
    `/rest/v1/${config.leadsTable}?select=*&order=updated_at.desc&limit=${encodeURIComponent(String(limit))}`,
    {
      method: "GET"
    }
  );

  if (!response.ok) {
    throw new Error(`Supabase lead list failed with status ${response.status}`);
  }

  const rows = (await response.json()) as SupabaseLeadRow[];
  return Array.isArray(rows) ? rows.map(fromSupabaseLeadRow) : [];
}

export async function getSupabaseLeadById(leadId: string): Promise<LeadRecord | null> {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const response = await supabaseRequest(
    `/rest/v1/${config.leadsTable}?select=*&id=eq.${encodeURIComponent(leadId)}&limit=1`,
    {
      method: "GET"
    }
  );

  if (!response.ok) {
    throw new Error(`Supabase lead get failed with status ${response.status}`);
  }

  const rows = (await response.json()) as SupabaseLeadRow[];
  return Array.isArray(rows) && rows[0] ? fromSupabaseLeadRow(rows[0]) : null;
}

export async function syncAnalyticsEventToSupabase(event: AnalyticsEventRecord): Promise<void> {
  const config = getSupabaseConfig();

  if (!config) {
    return;
  }

  const response = await supabaseRequest(`/rest/v1/${config.eventsTable}?on_conflict=id`, {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify([toSupabaseEventRow(event)])
  });

  if (!response.ok) {
    throw new Error(`Supabase event sync failed with status ${response.status}`);
  }
}

export async function listSupabaseEvents(limit = 200): Promise<AnalyticsEventRecord[]> {
  const config = getSupabaseConfig();

  if (!config) {
    return [];
  }

  const response = await supabaseRequest(
    `/rest/v1/${config.eventsTable}?select=*&order=created_at.desc&limit=${encodeURIComponent(String(limit))}`,
    {
      method: "GET"
    }
  );

  if (!response.ok) {
    throw new Error(`Supabase event list failed with status ${response.status}`);
  }

  const rows = (await response.json()) as SupabaseEventRow[];
  return Array.isArray(rows) ? rows.map(fromSupabaseEventRow) : [];
}


function chunkIds(ids: string[], size = 100): string[][] {
  const result: string[][] = [];
  for (let index = 0; index < ids.length; index += size) {
    result.push(ids.slice(index, index + size));
  }
  return result;
}

async function deleteSupabaseRowsByIds(table: string, ids: string[]): Promise<number> {
  const normalizedIds = Array.from(new Set(ids.map((id) => id.trim()).filter(Boolean)));

  if (normalizedIds.length === 0) {
    return 0;
  }

  let removed = 0;

  for (const group of chunkIds(normalizedIds)) {
    const response = await supabaseRequest(
      `/rest/v1/${table}?id=in.(${group.map((id) => encodeURIComponent(id)).join(",")})`,
      {
        method: "DELETE",
        headers: {
          Prefer: "return=minimal"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Supabase delete failed with status ${response.status}`);
    }

    removed += group.length;
  }

  return removed;
}

export async function deleteSupabaseLeadsByIds(ids: string[]): Promise<number> {
  const config = getSupabaseConfig();

  if (!config) {
    return 0;
  }

  return deleteSupabaseRowsByIds(config.leadsTable, ids);
}

export async function deleteSupabaseEventsByIds(ids: string[]): Promise<number> {
  const config = getSupabaseConfig();

  if (!config) {
    return 0;
  }

  return deleteSupabaseRowsByIds(config.eventsTable, ids);
}
