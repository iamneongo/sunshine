import { NextResponse } from "next/server";
import { CLEAR_TEST_DATA_CONFIRM_PHRASE, clearTestData, getTestDataAudit } from "@/lib/test-data";

function getSafeReturnPath(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value.trim() : "";

  if (!next || !next.startsWith("/dashboard") || next.startsWith("//")) {
    return "/dashboard/overview";
  }

  return next;
}

function buildRedirect(request: Request, returnPath: string, status: string, extra: Record<string, string> = {}) {
  const url = new URL(returnPath, request.url);
  url.searchParams.set("testDataCleanup", status);

  for (const [key, value] of Object.entries(extra)) {
    url.searchParams.set(key, value);
  }

  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const returnPath = getSafeReturnPath(formData.get("returnTo"));
  const confirmPhrase = typeof formData.get("confirmPhrase") === "string" ? String(formData.get("confirmPhrase")).trim() : "";
  const confirmTotalRaw = typeof formData.get("confirmTotal") === "string" ? String(formData.get("confirmTotal")).trim() : "";
  const understand = formData.get("understand") === "on";
  const confirmTotal = Number.parseInt(confirmTotalRaw, 10);

  const audit = await getTestDataAudit();

  if (audit.totalCount === 0) {
    return buildRedirect(request, returnPath, "empty");
  }

  if (!understand) {
    return buildRedirect(request, returnPath, "confirm_missing");
  }

  if (confirmPhrase !== CLEAR_TEST_DATA_CONFIRM_PHRASE) {
    return buildRedirect(request, returnPath, "invalid_phrase");
  }

  if (!Number.isFinite(confirmTotal) || confirmTotal !== audit.totalCount) {
    return buildRedirect(request, returnPath, "invalid_total", {
      expectedTotal: String(audit.totalCount)
    });
  }

  try {
    const result = await clearTestData(audit);
    return buildRedirect(request, returnPath, "success", {
      clearedLeads: String(result.leadCount),
      clearedEvents: String(result.eventCount)
    });
  } catch (error) {
    console.error("Clear test data failed", error);
    return buildRedirect(request, returnPath, "failed");
  }
}
