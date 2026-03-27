import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

export type LeadSource =
  | "form"
  | "chatbot"
  | "unknown";
export type LeadStatus = "Chưa gọi" | "Đã gọi" | "Đã gửi thông tin" | "Đặt lịch" | "Đã xem dự án" | "Đang chốt";
export type LeadHotness = "Nóng" | "Ấm" | "Lạnh";
export type LeadNeed = "Đầu tư" | "Ở / nghỉ dưỡng" | "Xem giá" | "Xem pháp lý" | "Chưa rõ";
export type LeadContactPreference = "Zalo" | "Điện thoại" | "Email" | "Chưa rõ";
export type LeadTag = "lead_nong" | "lead_dau_tu" | "lead_nghi_duong" | "can_goi_ngay";

export type LeadRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  projectName: string;
  source: LeadSource;
  fullName: string;
  phone: string;
  zalo: string;
  email: string;
  need: LeadNeed;
  budget: string;
  contactPreference: LeadContactPreference;
  hotness: LeadHotness;
  status: LeadStatus;
  tags: LeadTag[];
  notes: string;
  preferredCallbackTime: string;
  preferredVisitTime: string;
  travelParty: string;
  lastMessage: string;
  metadata: Record<string, string>;
};

export type LeadUpsertInput = Partial<Omit<LeadRecord, "id" | "createdAt" | "updatedAt" | "tags" | "hotness">> & {
  hotness?: LeadHotness;
  tags?: LeadTag[];
};

const DEFAULT_LEAD_FILE = path.join(process.cwd(), "data", "leads.json");
const SERVERLESS_LEAD_FILE = path.join(os.tmpdir(), "bds-data", "leads.json");

function isReadonlyServerlessRuntime(): boolean {
  return process.cwd().startsWith("/var/task") || Boolean(process.env.LAMBDA_TASK_ROOT) || Boolean(process.env.VERCEL);
}

function normalizePathForRuntime(filePath: string): string {
  return path.resolve(filePath).replace(/\\/g, "/");
}

function isReadonlyBundlePath(filePath: string): boolean {
  const normalizedFilePath = normalizePathForRuntime(filePath);
  const normalizedCwd = normalizePathForRuntime(process.cwd());

  return (
    normalizedFilePath === normalizedCwd ||
    normalizedFilePath.startsWith(`${normalizedCwd}/`) ||
    normalizedFilePath.startsWith("/var/task/") ||
    normalizedFilePath === "/var/task"
  );
}

function getLeadFilePath(): string {
  const configuredPath = process.env.LEAD_STORE_FILE?.trim();

  if (configuredPath) {
    const resolvedConfiguredPath = path.isAbsolute(configuredPath)
      ? configuredPath
      : path.resolve(process.cwd(), configuredPath);

    if (!isReadonlyServerlessRuntime() || !isReadonlyBundlePath(resolvedConfiguredPath)) {
      return resolvedConfiguredPath;
    }
  }

  return isReadonlyServerlessRuntime() ? SERVERLESS_LEAD_FILE : DEFAULT_LEAD_FILE;
}

function normalizeDigits(value: string): string {
  return value.replace(/[^\d]/g, "");
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeBudgetKey(value: string): string {
  return normalizeWhitespace(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

export function normalizeLeadBudget(value: unknown): string {
  const raw = typeof value === "string" ? normalizeWhitespace(value) : "";

  if (!raw) {
    return "Chưa rõ";
  }

  const normalized = normalizeBudgetKey(raw);

  if (/(1\s*[-–]\s*1[,.]?5\s*ty|1-1,5\s*ty|duoi\s*1[,.]?5\s*ty|1[,.]?2\s*ty|1[,.]?3\s*ty|1[,.]?4\s*ty)/.test(normalized)) {
    return "Dưới 1,5 tỷ";
  }

  if (/(quanh\s*1[,.]?5\s*ty|tam\s*1[,.]?5\s*ty|muc\s*1[,.]?5\s*ty|^1[,.]?5\s*ty$)/.test(normalized)) {
    return "Quanh 1,5 tỷ";
  }

  if (/(1[,.]?5\s*[-–]\s*2\s*ty|1[,.]?5\s*[-–]\s*2[,.]?5\s*ty|1,5-2\s*ty|1,5-2,5\s*ty)/.test(normalized)) {
    return "1,5-2,5 tỷ";
  }

  if (/(2[,.]?5\s*[-–]\s*5\s*ty|2,5-5\s*ty)/.test(normalized)) {
    return "2,5-5 tỷ";
  }

  if (/(tren\s*2\s*ty|hon\s*2\s*ty|2\s*ty\s*tro\s*len)/.test(normalized)) {
    return "Từ 2 tỷ trở lên";
  }

  if (/(tren\s*5\s*ty|hon\s*5\s*ty|5\s*ty\s*tro\s*len)/.test(normalized)) {
    return "Trên 5 tỷ";
  }

  return raw;
}


const FORM_SOURCE_VALUES = new Set([
  "form",
  "landing",
  "landing_form",
  "booking",
  "booking_modal",
  "lead_form",
  "web_form",
  "website_form"
]);

const CHATBOT_SOURCE_VALUES = new Set(["chatbot", "webchat", "chat"]);

export function normalizeLeadSource(value: unknown): LeadSource {
  const normalized = normalizeWhitespace(typeof value === "string" ? value : "")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (FORM_SOURCE_VALUES.has(normalized)) {
    return "form";
  }

  if (CHATBOT_SOURCE_VALUES.has(normalized)) {
    return "chatbot";
  }

  return "unknown";
}

function normalizeStoredLeadRecord(record: LeadRecord): LeadRecord {
  return {
    ...record,
    source: normalizeLeadSource(record.source),
    budget: normalizeLeadBudget(record.budget)
  };
}

function appendNote(existing: string, incoming: string): string {
  const current = normalizeWhitespace(existing);
  const next = normalizeWhitespace(incoming);

  if (!next) {
    return current;
  }

  if (!current) {
    return next;
  }

  if (current.includes(next)) {
    return current;
  }

  return `${current}\n${next}`;
}

function sanitizeMetadata(metadata: LeadUpsertInput["metadata"]): Record<string, string> {
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

function resolveStatus(input: LeadUpsertInput, existing?: LeadRecord): LeadStatus {
  if (input.status) {
    return input.status;
  }

  if (existing?.status) {
    return existing.status;
  }

  if (normalizeWhitespace(input.preferredVisitTime ?? "")) {
    return "Đặt lịch";
  }

  if (
    normalizeWhitespace(input.phone ?? "") ||
    normalizeWhitespace(input.zalo ?? "") ||
    normalizeWhitespace(input.email ?? "")
  ) {
    return "Đã gửi thông tin";
  }

  return "Chưa gọi";
}

function scoreLeadHotness(lead: Omit<LeadRecord, "id" | "createdAt" | "updatedAt" | "tags" | "hotness">): LeadHotness {
  let score = 0;
  const haystack = `${lead.notes} ${lead.lastMessage} ${lead.need}`.toLowerCase();

  if (lead.phone || lead.zalo || lead.email) {
    score += 35;
  }

  if (lead.budget && lead.budget !== "Chưa rõ") {
    score += 15;
  }

  if (/(giá|bang gia|bảng giá|pháp lý|xem dự án|đặt lịch|goi nhanh|gọi nhanh|so dien thoai|sdt|zalo)/.test(haystack)) {
    score += 30;
  }

  if (lead.preferredCallbackTime || lead.preferredVisitTime) {
    score += 15;
  }

  if (lead.status === "Đặt lịch" || lead.status === "Đang chốt") {
    score += 20;
  }

  if (score >= 70) {
    return "Nóng";
  }

  if (score >= 40) {
    return "Ấm";
  }

  return "Lạnh";
}

function buildLeadTags(lead: Pick<LeadRecord, "need" | "hotness" | "status">, customTags: LeadTag[] = []): LeadTag[] {
  const tags = new Set<LeadTag>(customTags);

  if (lead.hotness === "Nóng") {
    tags.add("lead_nong");
  }

  if (lead.need === "Đầu tư") {
    tags.add("lead_dau_tu");
  }

  if (lead.need === "Ở / nghỉ dưỡng") {
    tags.add("lead_nghi_duong");
  }

  if (lead.hotness === "Nóng" || lead.status === "Đặt lịch" || lead.status === "Đang chốt") {
    tags.add("can_goi_ngay");
  }

  return Array.from(tags);
}

async function ensureLeadFile(): Promise<void> {
  const leadFile = getLeadFilePath();
  await fs.mkdir(path.dirname(leadFile), { recursive: true });

  try {
    await fs.access(leadFile);
  } catch {
    await fs.writeFile(leadFile, "[]\n", "utf8");
  }
}

async function readLeadFile(): Promise<LeadRecord[]> {
  await ensureLeadFile();

  const raw = await fs.readFile(getLeadFilePath(), "utf8");

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is LeadRecord => Boolean(item && typeof item === "object")).map((item) => normalizeStoredLeadRecord(item)) : [];
  } catch {
    return [];
  }
}

async function writeLeadFile(leads: LeadRecord[]): Promise<void> {
  await ensureLeadFile();
  await fs.writeFile(getLeadFilePath(), `${JSON.stringify(leads, null, 2)}\n`, "utf8");
}

function findExistingLead(leads: LeadRecord[], input: LeadUpsertInput): LeadRecord | undefined {
  const normalizedPhone = normalizeDigits(input.phone ?? "");
  const normalizedZalo = normalizeDigits(input.zalo ?? "");
  const normalizedEmail = normalizeEmail(input.email ?? "");

  return leads.find((lead) => {
    const leadPhone = normalizeDigits(lead.phone);
    const leadZalo = normalizeDigits(lead.zalo);
    const leadEmail = normalizeEmail(lead.email);

    return Boolean(
      (normalizedPhone && (leadPhone === normalizedPhone || leadZalo === normalizedPhone)) ||
        (normalizedZalo && (leadPhone === normalizedZalo || leadZalo === normalizedZalo)) ||
        (normalizedEmail && leadEmail === normalizedEmail)
    );
  });
}

export async function saveLead(input: LeadUpsertInput): Promise<LeadRecord> {
  const leads = await readLeadFile();
  const existing = findExistingLead(leads, input);
  const now = new Date().toISOString();

  const baseLead = {
    projectName: normalizeWhitespace(input.projectName ?? existing?.projectName ?? "Sunshine Bay Retreat Vũng Tàu"),
    source: normalizeLeadSource(input.source ?? existing?.source ?? "unknown"),
    fullName: normalizeWhitespace(input.fullName ?? existing?.fullName ?? ""),
    phone: normalizeWhitespace(input.phone ?? existing?.phone ?? ""),
    zalo: normalizeWhitespace(input.zalo ?? existing?.zalo ?? ""),
    email: normalizeWhitespace(input.email ?? existing?.email ?? ""),
    need: input.need ?? existing?.need ?? "Chưa rõ",
    budget: normalizeLeadBudget(input.budget ?? existing?.budget ?? "Chưa rõ"),
    contactPreference: input.contactPreference ?? existing?.contactPreference ?? "Chưa rõ",
    status: resolveStatus(input, existing),
    notes: appendNote(existing?.notes ?? "", input.notes ?? ""),
    preferredCallbackTime: normalizeWhitespace(input.preferredCallbackTime ?? existing?.preferredCallbackTime ?? ""),
    preferredVisitTime: normalizeWhitespace(input.preferredVisitTime ?? existing?.preferredVisitTime ?? ""),
    travelParty: normalizeWhitespace(input.travelParty ?? existing?.travelParty ?? ""),
    lastMessage: normalizeWhitespace(input.lastMessage ?? existing?.lastMessage ?? ""),
    metadata: {
      ...(existing?.metadata ?? {}),
      ...sanitizeMetadata(input.metadata)
    }
  } satisfies Omit<LeadRecord, "id" | "createdAt" | "updatedAt" | "tags" | "hotness">;

  const hotness = input.hotness ?? scoreLeadHotness(baseLead);
  const record: LeadRecord = {
    id: existing?.id ?? `lead_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    ...baseLead,
    hotness,
    tags: buildLeadTags(
      {
        need: baseLead.need,
        hotness,
        status: baseLead.status
      },
      input.tags ?? existing?.tags ?? []
    )
  };

  const nextLeads = existing
    ? leads.map((lead) => (lead.id === existing.id ? record : lead))
    : [record, ...leads];

  await writeLeadFile(nextLeads);

  return record;
}

export async function listLeads(limit = 50): Promise<LeadRecord[]> {
  const leads = await readLeadFile();
  return [...leads]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit);
}


export async function deleteLeadsByIds(ids: string[]): Promise<number> {
  const idSet = new Set(ids.map((id) => normalizeWhitespace(id)).filter(Boolean));

  if (idSet.size === 0) {
    return 0;
  }

  const leads = await readLeadFile();
  const nextLeads = leads.filter((lead) => !idSet.has(lead.id));
  const removed = leads.length - nextLeads.length;

  if (removed > 0) {
    await writeLeadFile(nextLeads);
  }

  return removed;
}

export async function upsertLeadRecord(record: LeadRecord): Promise<LeadRecord> {
  const leads = await readLeadFile();
  const normalizedRecord = normalizeStoredLeadRecord(record);
  const nextLeads = leads.some((lead) => lead.id === record.id)
    ? leads.map((lead) => (lead.id === record.id ? normalizedRecord : lead))
    : [normalizedRecord, ...leads];

  await writeLeadFile(nextLeads);
  return normalizedRecord;
}
export async function getLeadById(leadId: string): Promise<LeadRecord | null> {
  const leads = await readLeadFile();
  return leads.find((lead) => lead.id === leadId) ?? null;
}

export async function updateLeadById(leadId: string, input: LeadUpsertInput): Promise<LeadRecord | null> {
  const leads = await readLeadFile();
  const existing = leads.find((lead) => lead.id === leadId);

  if (!existing) {
    return null;
  }

  const now = new Date().toISOString();
  const baseLead = {
    projectName: normalizeWhitespace(input.projectName ?? existing.projectName),
    source: normalizeLeadSource(input.source ?? existing.source),
    fullName: normalizeWhitespace(input.fullName ?? existing.fullName),
    phone: normalizeWhitespace(input.phone ?? existing.phone),
    zalo: normalizeWhitespace(input.zalo ?? existing.zalo),
    email: normalizeWhitespace(input.email ?? existing.email),
    need: input.need ?? existing.need,
    budget: normalizeLeadBudget(input.budget ?? existing.budget),
    contactPreference: input.contactPreference ?? existing.contactPreference,
    status: resolveStatus(input, existing),
    notes: appendNote(existing.notes, input.notes ?? ""),
    preferredCallbackTime: normalizeWhitespace(input.preferredCallbackTime ?? existing.preferredCallbackTime),
    preferredVisitTime: normalizeWhitespace(input.preferredVisitTime ?? existing.preferredVisitTime),
    travelParty: normalizeWhitespace(input.travelParty ?? existing.travelParty),
    lastMessage: normalizeWhitespace(input.lastMessage ?? existing.lastMessage),
    metadata: {
      ...existing.metadata,
      ...sanitizeMetadata(input.metadata)
    }
  } satisfies Omit<LeadRecord, "id" | "createdAt" | "updatedAt" | "tags" | "hotness">;

  const hotness = input.hotness ?? scoreLeadHotness(baseLead);
  const record: LeadRecord = {
    ...existing,
    updatedAt: now,
    ...baseLead,
    hotness,
    tags: buildLeadTags(
      {
        need: baseLead.need,
        hotness,
        status: baseLead.status
      },
      input.tags ?? existing.tags
    )
  };

  const nextLeads = leads.map((lead) => (lead.id === leadId ? record : lead));
  await writeLeadFile(nextLeads);

  return record;
}




