import {
  listAnalyticsEvents,
  saveAnalyticsEvent,
  type AnalyticsEventInput,
  type AnalyticsEventRecord
} from "@/lib/event-store";
import {
  getLeadById,
  listLeads,
  saveLead,
  type LeadRecord,
  type LeadUpsertInput,
  updateLeadById,
  upsertLeadRecord
} from "@/lib/lead-store";
import {
  getSupabaseLeadById,
  isSupabaseConfigured,
  listSupabaseEvents,
  listSupabaseLeads,
  syncAnalyticsEventToSupabase,
  syncLeadToSupabase
} from "@/lib/supabase-rest";

export type RepositoryDatasetSource = "supabase" | "local";

export type LeadDataset = {
  source: RepositoryDatasetSource;
  supabaseConfigured: boolean;
  leads: LeadRecord[];
};

export type AnalyticsEventDataset = {
  source: RepositoryDatasetSource;
  supabaseConfigured: boolean;
  events: AnalyticsEventRecord[];
};

export async function persistLead(input: LeadUpsertInput): Promise<LeadRecord> {
  const lead = await saveLead(input);

  if (isSupabaseConfigured()) {
    try {
      await syncLeadToSupabase(lead);
    } catch (error) {
      console.error("Lead sync to Supabase failed", error);
    }
  }

  return lead;
}

export async function updatePersistedLeadById(leadId: string, input: LeadUpsertInput): Promise<LeadRecord | null> {
  let existingLead = await getLeadById(leadId);

  if (!existingLead && isSupabaseConfigured()) {
    try {
      const supabaseLead = await getSupabaseLeadById(leadId);

      if (supabaseLead) {
        existingLead = await upsertLeadRecord(supabaseLead);
      }
    } catch (error) {
      console.error("Lead lookup in Supabase failed", error);
    }
  }

  if (!existingLead) {
    return null;
  }

  const updatedLead = await updateLeadById(leadId, input);

  if (updatedLead && isSupabaseConfigured()) {
    try {
      await syncLeadToSupabase(updatedLead);
    } catch (error) {
      console.error("Lead update sync to Supabase failed", error);
    }
  }

  return updatedLead;
}

export async function recordAnalyticsEvent(input: AnalyticsEventInput): Promise<AnalyticsEventRecord> {
  const event = await saveAnalyticsEvent(input);

  if (isSupabaseConfigured()) {
    try {
      await syncAnalyticsEventToSupabase(event);
    } catch (error) {
      console.error("Analytics event sync to Supabase failed", error);
    }
  }

  return event;
}

export async function getLeadDataset(limit = 100): Promise<LeadDataset> {
  const supabaseConfigured = isSupabaseConfigured();

  if (supabaseConfigured) {
    try {
      const leads = await listSupabaseLeads(limit);
      return {
        source: "supabase",
        supabaseConfigured,
        leads
      };
    } catch (error) {
      console.error("Lead dataset fallback to local store", error);
    }
  }

  return {
    source: "local",
    supabaseConfigured,
    leads: await listLeads(limit)
  };
}

export async function getAnalyticsEventDataset(limit = 200): Promise<AnalyticsEventDataset> {
  const supabaseConfigured = isSupabaseConfigured();

  if (supabaseConfigured) {
    try {
      const events = await listSupabaseEvents(limit);
      return {
        source: "supabase",
        supabaseConfigured,
        events
      };
    } catch (error) {
      console.error("Analytics dataset fallback to local store", error);
    }
  }

  return {
    source: "local",
    supabaseConfigured,
    events: await listAnalyticsEvents(limit)
  };
}


