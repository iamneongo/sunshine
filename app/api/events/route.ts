import { NextResponse } from "next/server";
import { getAnalyticsEventDataset, recordAnalyticsEvent } from "@/lib/crm-data";
import type { AnalyticsEventSource } from "@/lib/event-store";

type EventRequestBody = {
  name?: string;
  source?: string;
  leadId?: string;
  sessionId?: string;
  path?: string;
  metadata?: Record<string, unknown>;
};

const SOURCE_MAP: Record<string, AnalyticsEventSource> = {
  landing: "landing",
  chatbot: "chatbot",
  dashboard: "dashboard",
  system: "system"
};

function normalizeVietnamese(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeSource(value: unknown): AnalyticsEventSource {
  const normalized = normalizeVietnamese(normalizeText(value));
  return SOURCE_MAP[normalized] ?? "system";
}

function normalizeMetadata(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.entries(value).reduce<Record<string, string>>((acc, [key, item]) => {
    const normalizedKey = normalizeText(key);
    const normalizedValue = normalizeText(item);

    if (normalizedKey && normalizedValue) {
      acc[normalizedKey] = normalizedValue;
    }

    return acc;
  }, {});
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedLimit = Number.parseInt(searchParams.get("limit") ?? "100", 10);
  const limit = Number.isFinite(requestedLimit) && requestedLimit > 0 ? requestedLimit : 100;
  const dataset = await getAnalyticsEventDataset(limit);

  return NextResponse.json(
    {
      ok: true,
      source: dataset.source,
      supabaseConfigured: dataset.supabaseConfigured,
      events: dataset.events
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EventRequestBody;
    const name = normalizeText(body.name);

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const event = await recordAnalyticsEvent({
      name,
      source: normalizeSource(body.source),
      leadId: normalizeText(body.leadId),
      sessionId: normalizeText(body.sessionId),
      path: normalizeText(body.path),
      metadata: normalizeMetadata(body.metadata)
    });

    return NextResponse.json(
      {
        ok: true,
        event
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (error) {
    console.error("/api/events error", error);
    return NextResponse.json({ error: "Unable to save event" }, { status: 500 });
  }
}
