import { NextResponse } from "next/server";
import { getLeadDataset, persistLead } from "@/lib/crm-data";
import {
  type LeadContactPreference,
  type LeadHotness,
  type LeadNeed,
  type LeadSource,
  type LeadStatus,
  type LeadTag
} from "@/lib/lead-store";

type LeadRequestBody = {
  source?: string;
  fullName?: string;
  phone?: string;
  zalo?: string;
  phoneOrZalo?: string;
  email?: string;
  need?: string;
  budget?: string;
  contactPreference?: string;
  hotness?: string;
  status?: string;
  tags?: string[];
  notes?: string;
  preferredCallbackTime?: string;
  preferredVisitTime?: string;
  travelParty?: string;
  lastMessage?: string;
  metadata?: Record<string, unknown>;
};

const NEED_MAP: Record<string, LeadNeed> = {
  "dau tu": "Đầu tư",
  "dau tu sinh loi": "Đầu tư",
  "mua de o / nghi duong": "Ở / nghỉ dưỡng",
  "mua de o": "Ở / nghỉ dưỡng",
  "nghi duong": "Ở / nghỉ dưỡng",
  "xem gia": "Xem giá",
  "muon xem gia": "Xem giá",
  "muon xem gia truoc": "Xem giá",
  "xem phap ly": "Xem pháp lý",
  "muon xem phap ly": "Xem pháp lý",
  "muon xem phap ly truoc": "Xem pháp lý",
  "nhan bang gia 03/2026": "Xem giá",
  "xem can thuc te gia tot": "Ở / nghỉ dưỡng",
  "xem can hop tai chinh": "Đầu tư",
  "xem phap ly va chinh sach": "Xem pháp lý"
};

const CONTACT_MAP: Record<string, LeadContactPreference> = {
  zalo: "Zalo",
  phone: "Điện thoại",
  "dien thoai": "Điện thoại",
  email: "Email"
};

const HOTNESS_MAP: Record<string, LeadHotness> = {
  hot: "Nóng",
  warm: "Ấm",
  cold: "Lạnh",
  nong: "Nóng",
  am: "Ấm",
  lanh: "Lạnh"
};

const STATUS_MAP: Record<string, LeadStatus> = {
  "chua goi": "Chưa gọi",
  "da goi": "Đã gọi",
  "da gui thong tin": "Đã gửi thông tin",
  "dat lich": "Đặt lịch",
  "da xem du an": "Đã xem dự án",
  "dang chot": "Đang chốt"
};

const SOURCE_MAP: Record<string, LeadSource> = {
  chatbot: "chatbot",
  webchat: "chatbot",
  chat: "chatbot",
  landing: "form",
  form: "form",
  landing_form: "form",
  booking: "form",
  booking_modal: "form"
};

const TAG_ALLOWLIST = new Set<LeadTag>(["lead_nong", "lead_dau_tu", "lead_nghi_duong", "can_goi_ngay"]);

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

function isEmailLike(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(value.trim());
}

function normalizeNeed(value: unknown): LeadNeed {
  const normalized = normalizeVietnamese(normalizeText(value));
  return NEED_MAP[normalized] ?? "Chưa rõ";
}

function normalizeContactPreference(value: unknown): LeadContactPreference {
  const normalized = normalizeVietnamese(normalizeText(value));
  return CONTACT_MAP[normalized] ?? "Chưa rõ";
}

function normalizeHotness(value: unknown): LeadHotness | undefined {
  const normalized = normalizeVietnamese(normalizeText(value));
  return HOTNESS_MAP[normalized];
}

function normalizeStatus(value: unknown): LeadStatus | undefined {
  const normalized = normalizeVietnamese(normalizeText(value));
  return STATUS_MAP[normalized];
}

function normalizeSource(value: unknown): LeadSource {
  const normalized = normalizeVietnamese(normalizeText(value));
  return SOURCE_MAP[normalized] ?? "unknown";
}

function normalizeTags(value: unknown): LeadTag[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => normalizeVietnamese(item))
    .filter((item): item is LeadTag => TAG_ALLOWLIST.has(item as LeadTag));
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

function resolveContact(body: LeadRequestBody, contactPreference: LeadContactPreference) {
  const rawPhone = normalizeText(body.phone);
  const rawZalo = normalizeText(body.zalo);
  const rawEmail = normalizeText(body.email);
  const rawPhoneOrZalo = normalizeText(body.phoneOrZalo);
  const combinedLooksLikeEmail = isEmailLike(rawPhoneOrZalo);

  let phone = rawPhone;
  let zalo = rawZalo;
  let email = rawEmail || (combinedLooksLikeEmail ? rawPhoneOrZalo : "");

  if (rawPhoneOrZalo && !combinedLooksLikeEmail) {
    phone ||= rawPhoneOrZalo;

    if (contactPreference === "Zalo") {
      zalo ||= rawPhoneOrZalo;
    }
  }

  return {
    phone,
    zalo,
    email
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedLimit = Number.parseInt(searchParams.get("limit") ?? "50", 10);
  const limit = Number.isFinite(requestedLimit) && requestedLimit > 0 ? requestedLimit : 50;
  const dataset = await getLeadDataset(limit);

  return NextResponse.json(
    {
      ok: true,
      source: dataset.source,
      supabaseConfigured: dataset.supabaseConfigured,
      leads: dataset.leads
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
    const body = (await request.json()) as LeadRequestBody;
    const contactPreference = normalizeContactPreference(body.contactPreference);
    const { phone, zalo, email } = resolveContact(body, contactPreference);

    if (!phone && !zalo && !email) {
      return NextResponse.json({ error: "At least one contact field is required" }, { status: 400 });
    }

    const lead = await persistLead({
      source: normalizeSource(body.source),
      fullName: normalizeText(body.fullName),
      phone,
      zalo,
      email,
      need: normalizeNeed(body.need),
      budget: normalizeText(body.budget) || "Chưa rõ",
      contactPreference,
      hotness: normalizeHotness(body.hotness),
      status: normalizeStatus(body.status),
      tags: normalizeTags(body.tags),
      notes: normalizeText(body.notes),
      preferredCallbackTime: normalizeText(body.preferredCallbackTime),
      preferredVisitTime: normalizeText(body.preferredVisitTime),
      travelParty: normalizeText(body.travelParty),
      lastMessage: normalizeText(body.lastMessage),
      metadata: normalizeMetadata(body.metadata)
    });

    return NextResponse.json(
      {
        ok: true,
        lead
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (error) {
    console.error("/api/leads error", error);
    return NextResponse.json({ error: "Unable to save lead" }, { status: 500 });
  }
}

