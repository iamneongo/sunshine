import { NextResponse } from "next/server";
import { buildRequestUrl, DASHBOARD_SESSION_COOKIE_NAME, getDashboardSessionCookieOptions } from "@/lib/dashboard-auth";

function buildLogoutResponse(request: Request) {
  const response = NextResponse.redirect(buildRequestUrl(request, "/login"), 303);
  response.cookies.set(DASHBOARD_SESSION_COOKIE_NAME, "", {
    ...getDashboardSessionCookieOptions(request),
    maxAge: 0
  });
  return response;
}

export async function POST(request: Request) {
  return buildLogoutResponse(request);
}

export async function GET(request: Request) {
  return buildLogoutResponse(request);
}
