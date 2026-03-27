import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { recordAnalyticsEvent, updatePersistedLeadById } from "@/lib/crm-data";
import {
  DASHBOARD_SESSION_COOKIE_NAME,
  getSafeDashboardRedirectPath,
  isAuthenticatedDashboardSession
} from "@/lib/dashboard-auth";
import { type LeadContactPreference, type LeadHotness, type LeadStatus } from "@/lib/lead-store";

const leadStatuses = ["Chưa gọi", "Đã gọi", "Đã gửi thông tin", "Đặt lịch", "Đã xem dự án", "Đang chốt"] as const;
const leadHotnessValues = ["Nóng", "Ấm", "Lạnh"] as const;
const leadContactPreferences = ["Zalo", "Điện thoại", "Email", "Chưa rõ"] as const;

function getOptionalFormValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized ? normalized : undefined;
}

function pickAllowedValue<T extends string>(value: string | undefined, allowedValues: readonly T[]): T | undefined {
  return value ? allowedValues.find((item) => item === value) : undefined;
}

export async function POST(request: NextRequest, context: { params: Promise<{ leadId: string }> }) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(DASHBOARD_SESSION_COOKIE_NAME)?.value;

  if (!(await isAuthenticatedDashboardSession(sessionToken))) {
    return NextResponse.redirect(new URL("/login?next=/dashboard/overview", request.url), 303);
  }

  const { leadId } = await context.params;
  const formData = await request.formData();
  const returnTo = getSafeDashboardRedirectPath(getOptionalFormValue(formData, "returnTo") || `/dashboard/leads/${leadId}`);
  const redirectUrl = new URL(returnTo, request.url);

  const updatedLead = await updatePersistedLeadById(leadId, {
    status: pickAllowedValue(getOptionalFormValue(formData, "status"), leadStatuses) as LeadStatus | undefined,
    hotness: pickAllowedValue(getOptionalFormValue(formData, "hotness"), leadHotnessValues) as LeadHotness | undefined,
    contactPreference: pickAllowedValue(
      getOptionalFormValue(formData, "contactPreference"),
      leadContactPreferences
    ) as LeadContactPreference | undefined,
    notes: getOptionalFormValue(formData, "notes"),
    preferredCallbackTime: getOptionalFormValue(formData, "preferredCallbackTime"),
    preferredVisitTime: getOptionalFormValue(formData, "preferredVisitTime"),
    travelParty: getOptionalFormValue(formData, "travelParty"),
    lastMessage: getOptionalFormValue(formData, "lastMessage")
  });

  if (!updatedLead) {
    redirectUrl.searchParams.set("error", "not-found");
    return NextResponse.redirect(redirectUrl, 303);
  }

  await recordAnalyticsEvent({
    name: "dashboard_lead_updated",
    source: "dashboard",
    leadId: updatedLead.id,
    path: returnTo,
    metadata: {
      status: updatedLead.status,
      hotness: updatedLead.hotness,
      contact_preference: updatedLead.contactPreference
    }
  });

  redirectUrl.searchParams.set("saved", "1");
  return NextResponse.redirect(redirectUrl, 303);
}

