import { NextResponse } from "next/server";
import { DASHBOARD_SESSION_COOKIE_NAME, getDashboardSessionCookieOptions } from "@/lib/dashboard-auth";

function buildLogoutResponse(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url), 303);
  response.cookies.set(DASHBOARD_SESSION_COOKIE_NAME, "", {
    ...getDashboardSessionCookieOptions(),
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
