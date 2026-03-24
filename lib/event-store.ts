import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type AnalyticsEventSource = "landing" | "chatbot" | "dashboard" | "system";

export type AnalyticsEventRecord = {
  id: string;
  createdAt: string;
  name: string;
  source: AnalyticsEventSource;
  leadId: string;
  sessionId: string;
  path: string;
  metadata: Record<string, string>;
};

export type AnalyticsEventInput = Partial<Omit<AnalyticsEventRecord, "id" | "createdAt" | "metadata">> & {
  name: string;
  metadata?: Record<string, string>;
};

const DEFAULT_EVENT_FILE = path.join(process.cwd(), "data", "events.json");

function getEventFilePath(): string {
  const configuredPath = process.env.EVENT_STORE_FILE?.trim();
  return configuredPath ? path.resolve(process.cwd(), configuredPath) : DEFAULT_EVENT_FILE;
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function sanitizeMetadata(metadata: AnalyticsEventInput["metadata"]): Record<string, string> {
  if (!metadata || typeof metadata !== "object") {
    return {};
  }

  return Object.entries(metadata).reduce<Record<string, string>>((acc, [key, value]) => {
    const normalizedKey = normalizeWhitespace(key);
    const normalizedValue = typeof value === "string" ? normalizeWhitespace(value) : "";

    if (normalizedKey && normalizedValue) {
      acc[normalizedKey] = normalizedValue;
    }

    return acc;
  }, {});
}

async function ensureEventFile(): Promise<void> {
  const eventFile = getEventFilePath();
  await fs.mkdir(path.dirname(eventFile), { recursive: true });

  try {
    await fs.access(eventFile);
  } catch {
    await fs.writeFile(eventFile, "[]\n", "utf8");
  }
}

async function readEventFile(): Promise<AnalyticsEventRecord[]> {
  await ensureEventFile();

  const raw = await fs.readFile(getEventFilePath(), "utf8");

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AnalyticsEventRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeEventFile(events: AnalyticsEventRecord[]): Promise<void> {
  await ensureEventFile();
  await fs.writeFile(getEventFilePath(), `${JSON.stringify(events, null, 2)}\n`, "utf8");
}

export async function saveAnalyticsEvent(input: AnalyticsEventInput): Promise<AnalyticsEventRecord> {
  const events = await readEventFile();
  const event: AnalyticsEventRecord = {
    id: `evt_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
    name: normalizeWhitespace(input.name),
    source: input.source ?? "system",
    leadId: normalizeWhitespace(input.leadId ?? ""),
    sessionId: normalizeWhitespace(input.sessionId ?? ""),
    path: normalizeWhitespace(input.path ?? ""),
    metadata: sanitizeMetadata(input.metadata)
  };

  await writeEventFile([event, ...events]);

  return event;
}

export async function listAnalyticsEvents(limit = 200): Promise<AnalyticsEventRecord[]> {
  const events = await readEventFile();
  return [...events]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}
