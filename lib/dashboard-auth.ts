export const DASHBOARD_SESSION_COOKIE_NAME = "sunshine_dashboard_session";
export const DASHBOARD_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export const HARDCODED_DASHBOARD_ADMIN_USERNAME = "admin";
export const HARDCODED_DASHBOARD_ADMIN_PASSWORD = "Sunshine@2026";

const DASHBOARD_SESSION_SECRET = "sunshine-dashboard-hardcoded-session";

async function sha256Hex(input: string): Promise<string> {
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

export async function createDashboardSessionToken(): Promise<string> {
  return sha256Hex(
    `dashboard:${HARDCODED_DASHBOARD_ADMIN_USERNAME}:${HARDCODED_DASHBOARD_ADMIN_PASSWORD}:${DASHBOARD_SESSION_SECRET}`
  );
}

export async function isAuthenticatedDashboardSession(token: string | null | undefined): Promise<boolean> {
  if (!token) {
    return false;
  }

  return token === (await createDashboardSessionToken());
}

export async function validateDashboardCredentials(username: string, password: string): Promise<boolean> {
  return username.trim() === HARDCODED_DASHBOARD_ADMIN_USERNAME && password === HARDCODED_DASHBOARD_ADMIN_PASSWORD;
}

export function getSafeDashboardRedirectPath(next: string | null | undefined): string {
  if (typeof next !== "string") {
    return "/dashboard/overview";
  }

  const normalized = next.trim();
  if (!normalized || !normalized.startsWith("/dashboard")) {
    return "/dashboard/overview";
  }

  if (normalized.startsWith("//")) {
    return "/dashboard/overview";
  }

  return normalized;
}

export function getDashboardSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DASHBOARD_SESSION_MAX_AGE
  };
}
