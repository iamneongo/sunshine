import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type LeadSource =
  | "landing_form"
  | "booking_modal"
  | "chatbot"
  | "facebook"
  | "tiktok"
  | "zalo_oa"
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

function getLeadFilePath(): string {
  const configuredPath = process.env.LEAD_STORE_FILE?.trim();
  return configuredPath ? path.resolve(process.cwd(), configuredPath) : DEFAULT_LEAD_FILE;
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
    return Array.isArray(parsed) ? (parsed as LeadRecord[]) : [];
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
    source: input.source ?? existing?.source ?? "unknown",
    fullName: normalizeWhitespace(input.fullName ?? existing?.fullName ?? ""),
    phone: normalizeWhitespace(input.phone ?? existing?.phone ?? ""),
    zalo: normalizeWhitespace(input.zalo ?? existing?.zalo ?? ""),
    email: normalizeWhitespace(input.email ?? existing?.email ?? ""),
    need: input.need ?? existing?.need ?? "Chưa rõ",
    budget: normalizeWhitespace(input.budget ?? existing?.budget ?? "Chưa rõ"),
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
