import type { LeadRecord } from "@/lib/lead-store";

type UcallConfig = {
  baseUrl: string;
  apiKey: string;
  companySlug: string;
  callCampaignId: string;
  runCampaignOnTrigger: boolean;
};

type TriggerUcallCallBotResult = {
  campaignId: string;
  phoneNumber: string;
  customerId: string;
  payload: unknown;
};

function getUcallConfig(): UcallConfig | null {
  const apiKey = (process.env.UCALL_API_KEY ?? "").trim();
  const companySlug = (process.env.UCALL_COMPANY_SLUG ?? "").trim();
  const callCampaignId = (process.env.UCALL_CALL_CAMPAIGN_ID ?? "").trim();
  const baseUrl = (process.env.UCALL_BASE_URL ?? "https://admin.ucall.vn").trim().replace(/\/$/, "");
  const runCampaignOnTrigger = /^(1|true|yes)$/i.test((process.env.UCALL_RUN_CAMPAIGN_ON_TRIGGER ?? "").trim());

  if (!apiKey || !companySlug || !callCampaignId || !baseUrl) {
    return null;
  }

  return {
    baseUrl,
    apiKey,
    companySlug,
    callCampaignId,
    runCampaignOnTrigger
  };
}

export function isUcallCallBotConfigured(): boolean {
  return Boolean(getUcallConfig());
}

function getLeadDialablePhone(lead: LeadRecord): string {
  const primary = lead.phone || lead.zalo || "";
  return primary.replace(/[^\d]/g, "");
}

async function ucallRequest(pathname: string, init: RequestInit = {}): Promise<Response> {
  const config = getUcallConfig();

  if (!config) {
    throw new Error("UCall is not configured");
  }

  const headers = new Headers(init.headers);
  headers.set("x-api-key", config.apiKey);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${config.baseUrl}${pathname}`, {
    ...init,
    headers,
    cache: "no-store"
  });
}

async function parseUcallResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { raw: text } : null;
}

function buildOtherAttributes(lead: LeadRecord): Record<string, string> {
  return {
    lead_id: lead.id,
    lead_name: lead.fullName || "Lead chưa rõ tên",
    need: lead.need,
    budget: lead.budget,
    source: lead.source,
    status: lead.status,
    contact_preference: lead.contactPreference,
    preferred_callback_time: lead.preferredCallbackTime || "",
    preferred_visit_time: lead.preferredVisitTime || "",
    travel_party: lead.travelParty || "",
    email: lead.email || "",
    zalo: lead.zalo || ""
  };
}

function extractUcallCustomerId(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const record = payload as Record<string, unknown>;
  const nestedData = record.data && typeof record.data === "object" ? (record.data as Record<string, unknown>) : null;
  const candidates = [record.id, record.customer_id, record.uuid, nestedData?.id];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

async function runCampaignIfConfigured(config: UcallConfig): Promise<void> {
  if (!config.runCampaignOnTrigger) {
    return;
  }

  const response = await ucallRequest(`/api/company/${encodeURIComponent(config.companySlug)}/call_campaign/${encodeURIComponent(config.callCampaignId)}`, {
    method: "PUT",
    body: JSON.stringify({
      status: "RUN"
    })
  });

  if (!response.ok) {
    const payload = await parseUcallResponse(response);
    throw new Error(`UCall campaign start failed (${response.status}): ${JSON.stringify(payload)}`);
  }
}

export function getUcallCallBotStateForLead(lead: LeadRecord): { enabled: boolean; reason: string } {
  if (!isUcallCallBotConfigured()) {
    return {
      enabled: false,
      reason: "Thiếu cấu hình UCall"
    };
  }

  if (!getLeadDialablePhone(lead)) {
    return {
      enabled: false,
      reason: "Lead chưa có số gọi được"
    };
  }

  return {
    enabled: true,
    reason: ""
  };
}

export async function triggerUcallCallBotForLead(lead: LeadRecord): Promise<TriggerUcallCallBotResult> {
  const config = getUcallConfig();

  if (!config) {
    throw new Error("UCall is not configured");
  }

  const phoneNumber = getLeadDialablePhone(lead);

  if (!phoneNumber) {
    throw new Error("Lead does not have a dialable phone number");
  }

  const response = await ucallRequest(
    `/api/company/${encodeURIComponent(config.companySlug)}/call_campaign/${encodeURIComponent(config.callCampaignId)}/customer`,
    {
      method: "POST",
      body: JSON.stringify({
        phone_number: phoneNumber,
        other_attributes: buildOtherAttributes(lead)
      })
    }
  );

  const payload = await parseUcallResponse(response);

  if (!response.ok) {
    throw new Error(`UCall call-bot trigger failed (${response.status}): ${JSON.stringify(payload)}`);
  }

  await runCampaignIfConfigured(config);

  return {
    campaignId: config.callCampaignId,
    phoneNumber,
    customerId: extractUcallCustomerId(payload),
    payload
  };
}
