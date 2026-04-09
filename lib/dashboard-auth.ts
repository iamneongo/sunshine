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

function getHeaderValue(request: Request, key: string): string {
  return request.headers.get(key)?.split(",")[0]?.trim() ?? "";
}

function getConfiguredPublicOrigin(): string {
  return (
    process.env.APP_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    ""
  ).replace(/\/$/, "");
}

function parseHostParts(host: string): { hostname: string; port: string } {
  const normalized = host.trim();

  if (!normalized) {
    return { hostname: "", port: "" };
  }

  try {
    const parsed = new URL(`http://${normalized}`);
    return {
      hostname: parsed.hostname,
      port: parsed.port
    };
  } catch {
    return {
      hostname: normalized.replace(/:\d+$/, ""),
      port: normalized.match(/:(\d+)$/)?.[1] ?? ""
    };
  }
}

function isLocalHostname(hostname: string): boolean {
  const normalized = hostname.trim().toLowerCase();
  return normalized === "localhost" || normalized === "127.0.0.1" || normalized === "::1";
}

export function getRequestOrigin(request: Request): string {
  const forwardedProto = getHeaderValue(request, "x-forwarded-proto");
  const forwardedHost = getHeaderValue(request, "x-forwarded-host");
  const forwardedPort = getHeaderValue(request, "x-forwarded-port");
  const host = forwardedHost || getHeaderValue(request, "host");
  let fallbackProtocol = process.env.NODE_ENV === "production" ? "https" : "http";

  try {
    fallbackProtocol = new URL(request.url).protocol.replace(":", "") || fallbackProtocol;
  } catch {
    fallbackProtocol = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://") ? "https" : fallbackProtocol;
  }

  if (host) {
    const protocol = forwardedProto || fallbackProtocol;
    const { hostname, port: explicitPort } = parseHostParts(host);
    const configuredOrigin = getConfiguredPublicOrigin();

    if (configuredOrigin) {
      try {
        const configuredUrl = new URL(configuredOrigin);
        if (configuredUrl.hostname && configuredUrl.hostname === hostname) {
          return configuredUrl.origin;
        }
      } catch {
        // Ignore malformed configured origin and continue with forwarded headers.
      }
    }

    let effectivePort = explicitPort || forwardedPort;

    if (
      !isLocalHostname(hostname) &&
      (effectivePort === "3000" || (protocol === "https" && effectivePort === "443") || (protocol === "http" && effectivePort === "80"))
    ) {
      effectivePort = "";
    }

    const normalizedHost = effectivePort ? `${hostname}:${effectivePort}` : hostname;
    return `${protocol}://${normalizedHost}`;
  }

  try {
    return new URL(request.url).origin;
  } catch {
    return getConfiguredPublicOrigin() || "http://localhost:3000";
  }
}

export function buildRequestUrl(request: Request, path: string): URL {
  return new URL(path, getRequestOrigin(request));
}

function shouldUseSecureDashboardCookie(request?: Request): boolean {
  if (request) {
    const forwardedProto = getHeaderValue(request, "x-forwarded-proto").toLowerCase();

    if (forwardedProto) {
      return forwardedProto === "https";
    }

    try {
      return getRequestOrigin(request).startsWith("https://");
    } catch {
      return process.env.NODE_ENV === "production";
    }
  }

  return process.env.NODE_ENV === "production";
}

export function getDashboardSessionCookieOptions(request?: Request) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: shouldUseSecureDashboardCookie(request),
    path: "/",
    maxAge: DASHBOARD_SESSION_MAX_AGE
  };
}
