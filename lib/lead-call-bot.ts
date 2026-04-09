import { type AnalyticsEventSource } from "@/lib/event-store";
import { recordAnalyticsEvent, updatePersistedLeadById } from "@/lib/crm-data";
import { type LeadRecord } from "@/lib/lead-store";
import { getLeadDialablePhone, isUcallCallBotConfigured, triggerUcallCallBotForLead } from "@/lib/ucall";

type LeadCallBotTriggerMode = "auto" | "manual";

type TriggerLeadCallBotOptions = {
  source: AnalyticsEventSource;
  path: string;
  eventName: string;
  mode?: LeadCallBotTriggerMode;
  force?: boolean;
  notePrefix?: string;
  metadata?: Record<string, string>;
};

export type TriggerLeadCallBotWorkflowResult = {
  triggered: boolean;
  skippedReason: "" | "config" | "contact" | "cooldown";
  lead: LeadRecord;
  campaignId?: string;
  customerId?: string;
  phoneNumber?: string;
};

const AUTO_CALL_COOLDOWN_MS = 15 * 60 * 1000;

function getLastAutoTriggerTimestamp(lead: LeadRecord): number {
  const raw = lead.metadata.ucall_last_auto_trigger_at || "";
  const parsed = Date.parse(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function shouldSkipAutoTrigger(lead: LeadRecord): boolean {
  const lastTriggeredAt = getLastAutoTriggerTimestamp(lead);

  if (!lastTriggeredAt) {
    return false;
  }

  return Date.now() - lastTriggeredAt < AUTO_CALL_COOLDOWN_MS;
}

export async function triggerLeadCallBotWorkflow(
  lead: LeadRecord,
  options: TriggerLeadCallBotOptions
): Promise<TriggerLeadCallBotWorkflowResult> {
  const mode = options.mode ?? "auto";
  const isAutoMode = mode === "auto";

  if (!isUcallCallBotConfigured()) {
    return {
      triggered: false,
      skippedReason: "config",
      lead
    };
  }

  const dialablePhone = getLeadDialablePhone(lead);

  if (!dialablePhone) {
    return {
      triggered: false,
      skippedReason: "contact",
      lead
    };
  }

  if (isAutoMode && !options.force && shouldSkipAutoTrigger(lead)) {
    return {
      triggered: false,
      skippedReason: "cooldown",
      lead
    };
  }

  const result = await triggerUcallCallBotForLead(lead);
  const triggeredAtIso = new Date().toISOString();
  const triggeredAtLabel = new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(triggeredAtIso));
  const notePrefix = options.notePrefix ?? (isAutoMode ? "[UCall Auto]" : "[UCall]");

  const updatedLead =
    (await updatePersistedLeadById(lead.id, {
      notes: `${notePrefix} Đã đẩy lead vào call bot lúc ${triggeredAtLabel}. Campaign: ${result.campaignId}${
        result.customerId ? ` | Customer: ${result.customerId}` : ""
      }`,
      metadata: {
        ucall_last_campaign_id: result.campaignId,
        ucall_last_customer_id: result.customerId || "",
        ucall_last_phone: result.phoneNumber,
        ucall_last_trigger_at: triggeredAtIso,
        ucall_last_trigger_mode: mode,
        ...(isAutoMode
          ? {
              ucall_last_auto_trigger_at: triggeredAtIso
            }
          : {}),
        ...(options.metadata ?? {})
      }
    })) ?? lead;

  await recordAnalyticsEvent({
    name: options.eventName,
    source: options.source,
    leadId: lead.id,
    path: options.path,
    metadata: {
      campaign_id: result.campaignId,
      customer_id: result.customerId || "",
      phone_number: result.phoneNumber,
      trigger_mode: mode,
      ...(options.metadata ?? {})
    }
  });

  return {
    triggered: true,
    skippedReason: "",
    lead: updatedLead,
    campaignId: result.campaignId,
    customerId: result.customerId,
    phoneNumber: result.phoneNumber
  };
}
