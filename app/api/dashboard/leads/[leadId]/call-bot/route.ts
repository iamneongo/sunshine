import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getPersistedLeadById } from "@/lib/crm-data";
import {
  DASHBOARD_SESSION_COOKIE_NAME,
  buildRequestUrl,
  getSafeDashboardRedirectPath,
  isAuthenticatedDashboardSession
} from "@/lib/dashboard-auth";
import { triggerLeadCallBotWorkflow } from "@/lib/lead-call-bot";
import { getLeadDialablePhone, isUcallCallBotConfigured } from "@/lib/ucall";

function buildReturnUrl(request: NextRequest, leadId: string, returnTo: string, state: "success" | "error", reason = "") {
  const safePath = getSafeDashboardRedirectPath(returnTo || `/dashboard/leads/${leadId}`);
  const redirectUrl = buildRequestUrl(request, safePath);

  if (state === "success") {
    redirectUrl.searchParams.set("callBot", "1");
  } else {
    redirectUrl.searchParams.set("callBotError", reason || "failed");
  }

  return redirectUrl;
}

export async function POST(request: NextRequest, context: { params: Promise<{ leadId: string }> }) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(DASHBOARD_SESSION_COOKIE_NAME)?.value;

  if (!(await isAuthenticatedDashboardSession(sessionToken))) {
    return NextResponse.redirect(buildRequestUrl(request, "/login?next=/dashboard/overview"), 303);
  }

  const { leadId } = await context.params;
  const formData = await request.formData();
  const returnTo = String(formData.get("returnTo") ?? `/dashboard/leads/${leadId}`);

  if (!isUcallCallBotConfigured()) {
    return NextResponse.redirect(buildReturnUrl(request, leadId, returnTo, "error", "config"), 303);
  }

  const lead = await getPersistedLeadById(leadId);

  if (!lead) {
    return NextResponse.redirect(buildReturnUrl(request, leadId, returnTo, "error", "not-found"), 303);
  }

  const dialablePhone = getLeadDialablePhone(lead);

  if (!dialablePhone) {
    return NextResponse.redirect(buildReturnUrl(request, leadId, returnTo, "error", "contact"), 303);
  }

  try {
    const result = await triggerLeadCallBotWorkflow(lead, {
      source: "dashboard",
      path: getSafeDashboardRedirectPath(returnTo),
      eventName: "dashboard_call_bot_triggered",
      mode: "manual",
      force: true
    });

    if (!result.triggered) {
      return NextResponse.redirect(buildReturnUrl(request, leadId, returnTo, "error", result.skippedReason || "failed"), 303);
    }

    return NextResponse.redirect(buildReturnUrl(request, leadId, returnTo, "success"), 303);
  } catch (error) {
    console.error("/api/dashboard/leads/call-bot error", error);
    return NextResponse.redirect(buildReturnUrl(request, leadId, returnTo, "error", "failed"), 303);
  }
}
