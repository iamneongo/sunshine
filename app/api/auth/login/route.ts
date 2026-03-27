import { NextResponse } from "next/server";
import {
  DASHBOARD_SESSION_COOKIE_NAME,
  createDashboardSessionToken,
  getDashboardSessionCookieOptions,
  getSafeDashboardRedirectPath,
  validateDashboardCredentials
} from "@/lib/dashboard-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = getSafeDashboardRedirectPath(String(formData.get("next") ?? ""));

  if (!(await validateDashboardCredentials(username, password))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", next);
    loginUrl.searchParams.set("error", "invalid");
    return NextResponse.redirect(loginUrl, 303);
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(
    DASHBOARD_SESSION_COOKIE_NAME,
    await createDashboardSessionToken(),
    getDashboardSessionCookieOptions()
  );
  return response;
}
