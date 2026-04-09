import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  DASHBOARD_SESSION_COOKIE_NAME,
  buildRequestUrl,
  getSafeDashboardRedirectPath,
  isAuthenticatedDashboardSession
} from "@/lib/dashboard-auth";

export async function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get(DASHBOARD_SESSION_COOKIE_NAME)?.value;
  const isAuthenticated = await isAuthenticatedDashboardSession(sessionToken);
  const { pathname, search } = request.nextUrl;

  if (pathname === "/login") {
    if (isAuthenticated) {
      const redirectTarget = getSafeDashboardRedirectPath(request.nextUrl.searchParams.get("next"));
      return NextResponse.redirect(buildRequestUrl(request, redirectTarget));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    const loginUrl = buildRequestUrl(request, "/login");
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"]
};
