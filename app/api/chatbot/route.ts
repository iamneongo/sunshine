import { NextResponse } from "next/server";
import {
  CHATBOT_SYSTEM_PROMPT,
  DEFAULT_QUICK_ACTIONS,
  PROJECT_CONTEXT
} from "@/lib/chatbot-config";
import { persistLead } from "@/lib/crm-data";
import {
  type LeadContactPreference,
  type LeadHotness,
  type LeadNeed
} from "@/lib/lead-store";

type ClientHistoryItem = {
  role: "user" | "assistant";
  text: string;
};

type LeadSignals = {
  intent: "investment" | "living" | "resort" | "pricing" | "legal" | "unknown";
  budget: string;
  contactPreference: "zalo" | "phone" | "email" | "unknown";
  hotness: "hot" | "warm" | "cold";
  name: string;
};

type ChatbotPayload = {
  reply: string;
  suggestions: string[];
  leadSignals: LeadSignals;
  source: "gemini" | "fallback" | "scripted";
  leadCaptured: boolean;
  leadId?: string;
};

const DEFAULT_SUGGESTIONS = DEFAULT_QUICK_ACTIONS.map((item) => item.prompt);
const CALLBACK_OPTIONS = ["Ngay bây giờ", "Trong 30 phút tới", "Buổi chiều", "Buổi tối"];
const VISIT_OPTIONS = ["Hôm nay", "Ngày mai", "Cuối tuần"];
const PARTY_OPTIONS = ["Đi 1 mình", "Đi cùng gia đình / bạn bè"];
const CONTACT_DELIVERY_OPTIONS = ["Gửi Zalo trước", "Gọi nhanh 2 phút", "Nhận qua Email"];
const PRIMARY_BUDGET_OPTIONS = ["Tài chính 1,5-2,5 tỷ", "Tài chính 2,5-5 tỷ", "Nhận bảng giá nội bộ"];
const INVESTMENT_BUDGET_OPTIONS = ["Tài chính 1,5-2,5 tỷ", "Tài chính 2,5-5 tỷ", "Muốn sản phẩm dễ tăng giá"];
const RESORT_BUDGET_OPTIONS = ["Tài chính 1,5-2,5 tỷ", "Tài chính 2,5-5 tỷ", "Căn view đẹp nghỉ dưỡng"];

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

function dedupeSuggestions(suggestions: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of suggestions) {
    const trimmed = normalizeText(item);
    const key = normalizeVietnamese(trimmed);

    if (!trimmed || seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(trimmed);

    if (result.length === 4) {
      break;
    }
  }

  return result.length > 0 ? result : DEFAULT_SUGGESTIONS;
}

function buildConversationText(message: string, history: ClientHistoryItem[]): string {
  return [...history.filter((item) => item.role === "user").map((item) => item.text), message]
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .join(" ");
}

function extractPhone(text: string): string {
  const match = text.match(/(?:\+?84|0)[\d\s.-]{8,13}\d/);
  return match ? match[0].replace(/[^\d+]/g, "") : "";
}

function extractEmail(text: string): string {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match?.[0]?.trim() ?? "";
}

function normalizePersonName(value: string): string {
  return value.replace(/\s+/g, " ").replace(/[.,;:!?]+$/g, "").trim();
}

function titleCaseName(value: string): string {
  return normalizePersonName(value)
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function looksLikePersonName(value: string): boolean {
  const trimmed = normalizePersonName(value);
  if (!trimmed || trimmed.length < 2 || trimmed.length > 48 || /[\d@]/.test(trimmed)) {
    return false;
  }

  const wordCount = trimmed.split(/\s+/).length;
  const normalized = normalizeVietnamese(trimmed);

  if (wordCount > 6) {
    return false;
  }

  if (/(dau tu|nghi duong|bang gia|phap ly|video|zalo|dien thoai|email|hom nay|ngay mai|cuoi tuan|goi nhanh|gui gia|can dep|gia tot)/.test(normalized)) {
    return false;
  }

  if (/^(anh|chi|em|toi|khach|nha dau tu)$/.test(normalized)) {
    return false;
  }

  return true;
}

function extractNameFromText(text: string): string {
  const patterns = [
    /(?:tôi tên(?: là)?|toi ten(?: la)?|tên tôi(?: là)?|ten toi(?: la)?|mình tên(?: là)?|minh ten(?: la)?|anh tên(?: là)?|anh ten(?: la)?|chị tên(?: là)?|chi ten(?: la)?|em tên(?: là)?|em ten(?: la)?|tên là|ten la)\s+([^,!.;\n]+)/iu,
    /(?:tôi là|toi la|mình là|minh la|anh là|anh la|chị là|chi la|em là|em la)\s+([^,!.;\n]+)/iu
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    const candidate = normalizePersonName(match?.[1] ?? "");

    if (candidate && looksLikePersonName(candidate)) {
      return titleCaseName(candidate);
    }
  }

  const normalizedText = normalizeVietnamese(text);
  const fallbackMatch = normalizedText.match(
    /(?:toi ten(?: la)?|ten toi(?: la)?|minh ten(?: la)?|anh ten(?: la)?|chi ten(?: la)?|em ten(?: la)?|ten la|toi la|minh la|anh la|chi la|em la)\s+([^,!.;\n]+)/
  );
  const fallbackCandidate = normalizePersonName(fallbackMatch?.[1] ?? "");

  if (fallbackCandidate && looksLikePersonName(fallbackCandidate)) {
    return titleCaseName(fallbackCandidate);
  }

  return "";
}

function assistantAskedForName(text: string): boolean {
  return /(xin ten|cho em xin ten|xin them ho ten|de sale xung ho|xin ho ten|biet ten)/.test(
    normalizeVietnamese(text)
  );
}

function extractLeadName(message: string, history: ClientHistoryItem[]): string {
  const timeline = [...history, { role: "user" as const, text: message }];

  for (let index = timeline.length - 1; index >= 0; index -= 1) {
    const item = timeline[index];
    if (item.role !== "user") {
      continue;
    }

    const taggedName = extractNameFromText(item.text);
    if (taggedName) {
      return taggedName;
    }

    const previousAssistant = timeline[index - 1];
    if (previousAssistant?.role === "assistant" && assistantAskedForName(previousAssistant.text)) {
      const rawReplyName = normalizePersonName(item.text).replace(/^(?:tên|ten)\s+/iu, "").trim();
      if (rawReplyName && looksLikePersonName(rawReplyName)) {
        return titleCaseName(rawReplyName);
      }
    }
  }

  return "";
}

function detectBudget(text: string): string {
  const normalized = normalizeVietnamese(text);
  const amount = extractBudgetAmount(text);

  if (amount !== null) {
    if (amount < 1.5) {
      return "Dưới 1,5 tỷ";
    }

    if (Math.abs(amount - 1.5) < 0.01) {
      return "Quanh 1,5 tỷ";
    }

    if (amount <= 2.5) {
      return "1,5-2,5 tỷ";
    }

    if (amount <= 5) {
      return "2,5-5 tỷ";
    }

    return "Trên 5 tỷ";
  }

  if (/(1\s*[-–]\s*1[,.]?5\s*ty|1[,.]?2\s*ty|duoi\s*1[,.]?5\s*ty|1-1,5\s*ty)/.test(normalized)) {
    return "Dưới 1,5 tỷ";
  }

  if (/(quanh\s*1[,.]?5\s*ty|tam\s*1[,.]?5\s*ty|muc\s*1[,.]?5\s*ty|1[,.]?5\s*ty(?!\s*[-–]))/.test(normalized)) {
    return "Quanh 1,5 tỷ";
  }

  if (/(1[,.]?5\s*[-–]\s*2[,.]?5\s*ty|1,5-2,5\s*ty|tu\s*1[,.]?5\s*den\s*2[,.]?5\s*ty)/.test(normalized)) {
    return "1,5-2,5 tỷ";
  }

  if (/(2[,.]?5\s*[-–]\s*5\s*ty|2,5-5\s*ty|tu\s*2[,.]?5\s*den\s*5\s*ty)/.test(normalized)) {
    return "2,5-5 tỷ";
  }

  if (/(tren\s*5\s*ty|hon\s*5\s*ty|5\s*ty\s*tro\s*len)/.test(normalized)) {
    return "Trên 5 tỷ";
  }

  const directMatch = text.match(/\d+[,.]?\d*\s*t(?:ỷ|y)/i);
  return directMatch?.[0]?.trim() ?? "unknown";
}

function detectIntent(text: string): LeadSignals["intent"] {
  const normalized = normalizeVietnamese(text);

  if (/(phap ly|so hong|giay to|chu dau tu|bao lanh|hop dong)/.test(normalized)) {
    return "legal";
  }

  if (/(dau tu|sinh loi|dong tien|cho thue|tang gia|de tang gia|de cho thue)/.test(normalized)) {
    return "investment";
  }

  if (/(nghi duong|view dep|resort|bien|second home)/.test(normalized)) {
    return "resort";
  }

  if (/(de o|an cu|o lau dai|gia dinh|mua o)/.test(normalized)) {
    return "living";
  }

  if (/(gia|bang gia|nhan bang gia|nhan gia\s*626|626\s*trieu|1[,.]?2\s*ty|tong tien|chi phi|thanh toan|gia bao nhieu|goi gia)/.test(normalized)) {
    return "pricing";
  }

  return "unknown";
}

function detectContactPreference(text: string): LeadSignals["contactPreference"] {
  const normalized = normalizeVietnamese(text);

  if (/zalo/.test(normalized)) {
    return "zalo";
  }

  if (/email/.test(normalized) || Boolean(extractEmail(text))) {
    return "email";
  }

  if (/(sdt|so dien thoai|phone|goi nhanh|goi lai|goi cho toi|dien thoai)/.test(normalized) || Boolean(extractPhone(text))) {
    return "phone";
  }

  return "unknown";
}

function detectCallbackTime(text: string): string {
  const normalized = normalizeVietnamese(text);

  if (/ngay bay gio/.test(normalized)) {
    return "Ngay bây giờ";
  }

  if (/30\s*phut/.test(normalized)) {
    return "Trong 30 phút tới";
  }

  if (/buoi chieu/.test(normalized)) {
    return "Buổi chiều";
  }

  if (/buoi toi/.test(normalized)) {
    return "Buổi tối";
  }

  return "";
}

function detectVisitTime(text: string): string {
  const normalized = normalizeVietnamese(text);

  if (/hom nay/.test(normalized)) {
    return "Hôm nay";
  }

  if (/ngay mai/.test(normalized)) {
    return "Ngày mai";
  }

  if (/cuoi tuan/.test(normalized)) {
    return "Cuối tuần";
  }

  return "";
}

function detectTravelParty(text: string): string {
  const normalized = normalizeVietnamese(text);

  if (/(di\s*1\s*minh|mot\s*minh)/.test(normalized)) {
    return "Đi 1 mình";
  }

  if (/(gia dinh|ban be|di cung)/.test(normalized)) {
    return "Đi cùng gia đình / bạn bè";
  }

  return "";
}

function hasUsableGeminiApiKey(value: string | undefined): boolean {
  const normalized = normalizeText(value);

  if (!normalized) {
    return false;
  }

  return !/^(your_|replace_|changeme|sample_|example_|test_)/i.test(normalized) && !/gemini_api_key/i.test(normalized);
}

function getLastAssistantMessage(history: ClientHistoryItem[]): string {
  for (let index = history.length - 1; index >= 0; index -= 1) {
    if (history[index]?.role === "assistant") {
      return normalizeText(history[index].text);
    }
  }

  return "";
}

function assistantAskedForBudget(text: string): boolean {
  return /(khung tai chinh|tam tai chinh|tai chinh nao|ngan sach nao|quan tam khoang nao)/.test(
    normalizeVietnamese(text)
  );
}

function assistantAskedForNeed(text: string): boolean {
  return /(dau tu sinh loi|mua de o|nghi duong)/.test(normalizeVietnamese(text));
}

function assistantAskedForPropertyPreference(text: string): boolean {
  return /(gia tot|view dep|view bien|de cho thue|huong bien|huong nao truoc|loc theo huong nao)/.test(
    normalizeVietnamese(text)
  );
}

function assistantAskedForDeliveryMethod(text: string): boolean {
  return /(gui thong tin theo cach nao|gui zalo truoc|nhan qua email|goi nhanh 2 phut|cach nao truoc)/.test(
    normalizeVietnamese(text)
  );
}

function assistantAskedForVisitTime(text: string): boolean {
  const normalized = normalizeVietnamese(text);
  return /dat lich|muon di/.test(normalized) && /hom nay|ngay mai|cuoi tuan/.test(normalized);
}

function assistantAskedForTravelParty(text: string): boolean {
  const normalized = normalizeVietnamese(text);
  return /di/.test(normalized) && /1 minh|gia dinh|ban be/.test(normalized);
}

function extractBudgetAmount(text: string): number | null {
  const normalized = normalizeVietnamese(text);

  const separatedMatch = normalized.match(/(\d+)\s*ty\s*(\d{1,2})\b/);
  if (separatedMatch) {
    const major = Number(separatedMatch[1]);
    const minorRaw = Number(separatedMatch[2]);
    const minor = minorRaw >= 10 ? minorRaw / 100 : minorRaw / 10;

    if (Number.isFinite(major) && Number.isFinite(minor)) {
      return major + minor;
    }
  }

  const directMatch = normalized.match(/(\d+)(?:[,.](\d+))?\s*ty\b/);
  if (!directMatch) {
    return null;
  }

  const major = Number(directMatch[1]);
  const decimalPart = directMatch[2] ? Number(`0.${directMatch[2]}`) : 0;

  if (!Number.isFinite(major) || !Number.isFinite(decimalPart)) {
    return null;
  }

  return major + decimalPart;
}

function canonicalizeUserReply(message: string, history: ClientHistoryItem[]): string {
  const normalized = normalizeVietnamese(message);
  const lastAssistant = getLastAssistantMessage(history);
  const detectedBudget = detectBudget(message);

  if (!normalized) {
    return message;
  }

  if (assistantAskedForVisitTime(lastAssistant)) {
    if (/cuoi tuan|weekend|thu\s*7|chu nhat/.test(normalized)) {
      return "Cuối tuần";
    }

    if (/ngay mai|mai /.test(`${normalized} `) || normalized === "mai") {
      return "Ngày mai";
    }

    if (/hom nay|toi nay|chieu nay|nay/.test(normalized)) {
      return "Hôm nay";
    }
  }

  if (assistantAskedForTravelParty(lastAssistant)) {
    if (/(1 minh|mot minh|di le)/.test(normalized)) {
      return "Đi 1 mình";
    }

    if (/(gia dinh|ban be|vo chong|2 nguoi|3 nguoi|di cung)/.test(normalized)) {
      return "Đi cùng gia đình / bạn bè";
    }
  }

  if ((assistantAskedForBudget(lastAssistant) || /\bty\b/.test(normalized)) && detectedBudget !== "unknown") {
    return `Tài chính ${detectedBudget}`;
  }

  if (assistantAskedForNeed(lastAssistant)) {
    if (/(dau tu|sinh loi|dong tien|khai thac|cho thue)/.test(normalized)) {
      return "Đầu tư sinh lời";
    }

    if (/(de o|o lau dai|an cu|nghi duong|gia dinh)/.test(normalized)) {
      return "Mua để ở / nghỉ dưỡng";
    }
  }

  if (assistantAskedForPropertyPreference(lastAssistant) || /(view dep|view bien|can dep|huong bien|gia tot|cho thue|tang gia)/.test(normalized)) {
    if (/(view dep|view bien|can dep|nghi duong|huong bien)/.test(normalized)) {
      return "Căn view đẹp nghỉ dưỡng";
    }

    if (/(gia tot|de vao tien|can dau tu)/.test(normalized)) {
      return "Căn đầu tư giá tốt";
    }

    if (/(cho thue|khai thac)/.test(normalized)) {
      return "Muốn sản phẩm cho thuê tốt";
    }

    if (/(tang gia|bien do|du dia)/.test(normalized)) {
      return "Muốn sản phẩm dễ tăng giá";
    }
  }

  if (assistantAskedForDeliveryMethod(lastAssistant) || /(zalo|email|goi|dien thoai|phone|call|mail)/.test(normalized)) {
    if (/zalo/.test(normalized)) {
      return "Gửi Zalo trước";
    }

    if (/(email|mail)/.test(normalized)) {
      return "Nhận qua Email";
    }

    if (/(goi|dien thoai|phone|call|alo)/.test(normalized)) {
      return "Gọi nhanh 2 phút";
    }
  }

  if (/ngay bay gio|bay gio|goi ngay/.test(normalized)) {
    return "Ngay bây giờ";
  }

  if (/30\s*phut/.test(normalized)) {
    return "Trong 30 phút tới";
  }

  if (/buoi chieu|chieu nay/.test(normalized)) {
    return "Buổi chiều";
  }

  if (/buoi toi|toi nay/.test(normalized)) {
    return "Buổi tối";
  }

  if (/(gui gia|xin gia|xem gia|bang gia noi bo|nhan bang gia)/.test(normalized)) {
    return "Nhận bảng giá nội bộ";
  }

  if (/(xem video|video thuc te|xem hinh|xem can dep|video can dep|xem can thuc te|can thuc te gia tot)/.test(normalized)) {
    return "Xem video căn đẹp";
  }

  if (/(phap ly|so hong|giay to|hop dong)/.test(normalized)) {
    return "Xem pháp lý";
  }

  return message;
}

function detectLeadSignals(message: string, history: ClientHistoryItem[]): LeadSignals {
  const conversation = buildConversationText(message, history);
  const budget = detectBudget(conversation);
  const contactPreference = detectContactPreference(conversation);
  const intent = detectIntent(conversation);
  const name = extractLeadName(message, history);
  const hasContact = Boolean(extractPhone(conversation) || extractEmail(conversation));
  const normalized = normalizeVietnamese(conversation);

  let hotness: LeadSignals["hotness"] = "cold";

  if (
    hasContact ||
    /(gia bao nhieu|bang gia|nhan bang gia|phap ly|dat lich|xem du an|goi nhanh|goi lai|zalo|hom nay|ngay mai|cuoi tuan)/.test(
      normalized
    )
  ) {
    hotness = "hot";
  } else if (/(dau tu|video|view dep|cho thue|tang gia|tai chinh|\d+[,.]?\d*\s*ty)/.test(normalized)) {
    hotness = "warm";
  }

  return {
    intent,
    budget,
    contactPreference,
    hotness,
    name
  };
}

function mapNeed(intent: LeadSignals["intent"]): LeadNeed {
  switch (intent) {
    case "investment":
      return "Đầu tư";
    case "living":
    case "resort":
      return "Ở / nghỉ dưỡng";
    case "pricing":
      return "Xem giá";
    case "legal":
      return "Xem pháp lý";
    default:
      return "Chưa rõ";
  }
}

function mapContactPreference(value: LeadSignals["contactPreference"]): LeadContactPreference {
  switch (value) {
    case "zalo":
      return "Zalo";
    case "phone":
      return "Điện thoại";
    case "email":
      return "Email";
    default:
      return "Chưa rõ";
  }
}

function mapHotness(value: LeadSignals["hotness"]): LeadHotness {
  switch (value) {
    case "hot":
      return "Nóng";
    case "warm":
      return "Ấm";
    default:
      return "Lạnh";
  }
}

function resolveContactFields(text: string, contactPreference: LeadSignals["contactPreference"]) {
  const phoneLike = extractPhone(text);
  const email = extractEmail(text);
  const normalized = normalizeVietnamese(text);
  const prefersZalo = contactPreference === "zalo" || /zalo/.test(normalized);

  return {
    phone: phoneLike,
    zalo: prefersZalo && phoneLike ? phoneLike : "",
    email
  };
}

function mergeLeadSignals(primary: Partial<LeadSignals> | null | undefined, fallback: LeadSignals): LeadSignals {
  const intent = primary?.intent;
  const contactPreference = primary?.contactPreference;
  const hotness = primary?.hotness;
  const budget = normalizeText(primary?.budget);
  const name = normalizePersonName(primary?.name ?? "");

  return {
    intent:
      intent === "investment" || intent === "living" || intent === "resort" || intent === "pricing" || intent === "legal"
        ? intent
        : fallback.intent,
    budget: budget || fallback.budget,
    contactPreference:
      contactPreference === "zalo" || contactPreference === "phone" || contactPreference === "email"
        ? contactPreference
        : fallback.contactPreference,
    hotness: hotness === "hot" || hotness === "warm" ? hotness : fallback.hotness,
    name: name || fallback.name
  };
}

function buildLeadNotes(message: string, leadSignals: LeadSignals, preferredCallbackTime: string, preferredVisitTime: string, travelParty: string): string {
  const parts = [
    `Chatbot intent: ${leadSignals.intent}`,
    leadSignals.budget !== "unknown" ? `Budget: ${leadSignals.budget}` : "",
    preferredCallbackTime ? `Callback: ${preferredCallbackTime}` : "",
    preferredVisitTime ? `Visit: ${preferredVisitTime}` : "",
    travelParty ? `Travel party: ${travelParty}` : "",
    normalizeText(message) ? `Last ask: ${normalizeText(message)}` : ""
  ].filter(Boolean);

  return parts.join(" | ");
}

function buildLeadInput(message: string, history: ClientHistoryItem[], leadSignals: LeadSignals) {
  const conversation = buildConversationText(message, history);
  const preferredCallbackTime = detectCallbackTime(conversation);
  const preferredVisitTime = detectVisitTime(conversation);
  const travelParty = detectTravelParty(conversation);
  const { phone, zalo, email } = resolveContactFields(conversation, leadSignals.contactPreference);

  return {
    source: "chatbot" as const,
    fullName: leadSignals.name,
    phone,
    zalo,
    email,
    need: mapNeed(leadSignals.intent),
    budget: leadSignals.budget === "unknown" ? "Chưa rõ" : leadSignals.budget,
    contactPreference: mapContactPreference(leadSignals.contactPreference),
    hotness: mapHotness(leadSignals.hotness),
    status: preferredVisitTime ? ("Đặt lịch" as const) : undefined,
    notes: buildLeadNotes(message, leadSignals, preferredCallbackTime, preferredVisitTime, travelParty),
    preferredCallbackTime,
    preferredVisitTime,
    travelParty,
    lastMessage: normalizeText(message),
    metadata: {
      channel: "website_chatbot",
      price_anchor: PROJECT_CONTEXT.priceAnchor,
      last_user_turn: normalizeText(message)
    }
  };
}

function buildResponse(reply: string, suggestions: string[], leadSignals: LeadSignals) {
  return {
    reply,
    suggestions: dedupeSuggestions(suggestions),
    leadSignals
  };
}

function buildScriptedResponse(message: string, history: ClientHistoryItem[]): Omit<ChatbotPayload, "source" | "leadCaptured" | "leadId"> | null {
  const canonicalMessage = canonicalizeUserReply(message, history);
  const normalized = normalizeVietnamese(canonicalMessage);
  const conversation = buildConversationText(message, history);
  const leadSignals = detectLeadSignals(message, history);
  const hasContact = Boolean(extractPhone(conversation) || extractEmail(conversation));
  const hasName = Boolean(leadSignals.name);
  const hasBudget = leadSignals.budget !== "unknown";
  const callbackTime = detectCallbackTime(conversation);
  const visitTime = detectVisitTime(conversation);
  const travelParty = detectTravelParty(conversation);

  if (hasContact && visitTime) {
    const partyText = travelParty ? `, đi theo nhóm **${travelParty.toLowerCase()}**` : "";
    return buildResponse(
      `Dạ em đã ghi nhận lịch **${visitTime}**${partyText}. Đội ngũ tư vấn sẽ gửi trước **bảng giá nội bộ**, **video căn đẹp** và xác nhận lại vị trí hẹn qua SĐT/Zalo của anh/chị ạ.`,
      ["Xem pháp lý", "Nhận bảng giá nội bộ", "Xem video căn đẹp"],
      {
        ...leadSignals,
        hotness: "hot"
      }
    );
  }

  if (hasContact && callbackTime) {
    return buildResponse(
      `Dạ em đã ghi nhận SĐT/Zalo và nhu cầu **gọi nhanh 2 phút** vào **${callbackTime}**. Em sẽ gửi trước **bảng giá nội bộ** và gọi đúng khung giờ này để tư vấn gọn cho mình ạ.`,
      ["Nhận bảng giá nội bộ", "Xem pháp lý", "Đặt lịch xem dự án"],
      {
        ...leadSignals,
        contactPreference: "phone",
        hotness: "hot"
      }
    );
  }

  if (/gui zalo truoc/.test(normalized)) {
    if (hasContact) {
      const needLabel = leadSignals.intent !== "unknown" ? mapNeed(leadSignals.intent) : null;
      const budgetLabel = leadSignals.budget !== "unknown" ? leadSignals.budget : "";
      const detailText = needLabel && budgetLabel
        ? ` với nhu cầu **${needLabel}** và tài chính **${budgetLabel}**`
        : needLabel
          ? ` với nhu cầu **${needLabel}**`
          : budgetLabel
            ? ` với tài chính **${budgetLabel}**`
            : "";

      return buildResponse(
        `Dạ em đã ghi nhận kênh nhận thông tin qua **Zalo**${detailText}. Em sẽ ưu tiên gửi **bảng giá nội bộ**, **video căn đẹp** và phần thông tin phù hợp trong ít phút tới ạ.`,
        ["Gọi nhanh 2 phút", "Đặt lịch xem dự án", "Xem pháp lý"],
        {
          ...leadSignals,
          contactPreference: "zalo",
          hotness: "hot"
        }
      );
    }

    return buildResponse(
      "Dạ anh/chị gửi giúp em **SĐT/Zalo** tại đây, em sẽ ưu tiên gửi **bảng giá nội bộ**, **video căn đẹp** và pháp lý trước qua Zalo rồi mới gọi nếu mình cần ạ.",
      ["Nhận bảng giá nội bộ", "Xem video căn đẹp", "Xem pháp lý"],
      {
        ...leadSignals,
        contactPreference: "zalo",
        hotness: "hot"
      }
    );
  }

  if (/nhan qua email|gui email|email cho toi|nhan bang gia qua email/.test(normalized)) {
    return buildResponse(
      "Dạ anh/chị gửi giúp em **email** tại đây, em sẽ gửi trước **bảng giá nội bộ**, **video căn đẹp** và tài liệu dự án. Nếu cần em mới hỗ trợ thêm qua SĐT/Zalo để tránh làm phiền ạ.",
      ["Xem pháp lý", "Nhận bảng giá nội bộ", "Gọi nhanh 2 phút"],
      {
        ...leadSignals,
        contactPreference: "email",
        hotness: leadSignals.hotness === "cold" ? "warm" : leadSignals.hotness
      }
    );
  }

  if (/goi nhanh 2 phut|goi nhanh|goi lai/.test(normalized)) {
    return buildResponse(
      "Dạ em có thể sắp xếp **gọi nhanh 2 phút**. Anh/chị muốn em gọi **ngay bây giờ**, **trong 30 phút tới**, **buổi chiều** hay **buổi tối** ạ?",
      CALLBACK_OPTIONS,
      {
        ...leadSignals,
        contactPreference: "phone",
        hotness: "hot"
      }
    );
  }

  if (CALLBACK_OPTIONS.some((option) => normalizeVietnamese(option) === normalized)) {
    const callbackLabel = CALLBACK_OPTIONS.find((option) => normalizeVietnamese(option) === normalized) ?? "Buổi chiều";
    return buildResponse(
      `Dạ em ghi nhận khung **${callbackLabel}**. Anh/chị để lại **SĐT** giúp em, đội ngũ tư vấn sẽ gọi đúng giờ và gửi trước bảng giá nội bộ nếu mình muốn xem nhanh ạ.`,
      ["Gửi Zalo trước", "Nhận bảng giá nội bộ", "Xem pháp lý"],
      {
        ...leadSignals,
        contactPreference: "phone",
        hotness: "hot"
      }
    );
  }

  if (/dat lich xem du an|xem du an/.test(normalized)) {
    return buildResponse(
      "Dạ em có thể hỗ trợ **đặt lịch xem dự án**. Anh/chị muốn đi **Hôm nay**, **Ngày mai** hay **Cuối tuần** ạ?",
      VISIT_OPTIONS,
      {
        ...leadSignals,
        hotness: "hot"
      }
    );
  }

  if (VISIT_OPTIONS.some((option) => normalizeVietnamese(option) === normalized)) {
    const visitLabel = VISIT_OPTIONS.find((option) => normalizeVietnamese(option) === normalized) ?? "Ngày mai";
    return buildResponse(
      `Dạ em ghi nhận lịch **${visitLabel}**. Anh/chị đi **1 mình** hay **cùng gia đình / bạn bè** để em sắp xếp sale tư vấn phù hợp ạ?`,
      PARTY_OPTIONS,
      {
        ...leadSignals,
        hotness: "hot"
      }
    );
  }

  if (PARTY_OPTIONS.some((option) => normalizeVietnamese(option) === normalized)) {
    const partyLabel = PARTY_OPTIONS.find((option) => normalizeVietnamese(option) === normalized) ?? "Đi 1 mình";
    return buildResponse(
      `Dạ em đã ghi nhận nhu cầu **${partyLabel.toLowerCase()}**. Anh/chị để lại **SĐT/Zalo**, em chốt lịch, gửi vị trí và bảng giá phù hợp trước khi mình đi xem ạ.`,
      ["Gửi Zalo trước", "Nhận bảng giá nội bộ", "Gọi nhanh 2 phút"],
      {
        ...leadSignals,
        hotness: "hot"
      }
    );
  }

  if (hasContact && !hasName) {
    return buildResponse(
      "Dạ em đã ghi nhận **SĐT/Zalo** của anh/chị rồi ạ. Anh/chị cho em xin thêm **họ tên** để sale xưng hô chuẩn và gửi đúng danh sách căn phù hợp nhé.",
      ["Đầu tư sinh lời", "Mua để ở / nghỉ dưỡng", "Xem pháp lý"],
      {
        ...leadSignals,
        hotness: "hot"
      }
    );
  }

  if (hasContact && hasName && leadSignals.intent === "unknown") {
    return buildResponse(
      `Dạ em đã ghi nhận **${leadSignals.name}** rồi ạ. Anh/chị đang nghiêng về **đầu tư sinh lời** hay **mua để ở / nghỉ dưỡng** để em lọc đúng nhóm căn trước nhé?`,
      ["Đầu tư sinh lời", "Mua để ở / nghỉ dưỡng", "Xem pháp lý"],
      {
        ...leadSignals,
        hotness: "hot"
      }
    );
  }

  if (hasContact && hasName && !hasBudget) {
    return buildResponse(
      `Dạ em đã ghi nhận nhu cầu của **${leadSignals.name}**. Anh/chị đang quan tâm khung tài chính nào để em gửi đúng danh sách căn phù hợp hơn ạ?`,
      PRIMARY_BUDGET_OPTIONS,
      {
        ...leadSignals,
        hotness: "hot"
      }
    );
  }

  if (hasContact && hasName && hasBudget && leadSignals.contactPreference === "unknown") {
    return buildResponse(
      `Dạ em đã ghi nhận **${leadSignals.name}** với tài chính **${leadSignals.budget}** rồi ạ. Anh/chị muốn nhận thông tin theo cách nào trước?`,
      CONTACT_DELIVERY_OPTIONS,
      {
        ...leadSignals,
        hotness: "hot"
      }
    );
  }

  if (hasContact && hasName && hasBudget && leadSignals.intent !== "unknown") {
    const needLabel = mapNeed(leadSignals.intent);
    return buildResponse(
      `Dạ em đã ghi nhận **${leadSignals.name}**, nhu cầu **${needLabel}** với tài chính **${leadSignals.budget}**. Anh/chị muốn nhận trước qua **Zalo**, **gọi nhanh 2 phút** hay **đặt lịch xem dự án** ạ?`,
      ["Gửi Zalo trước", "Gọi nhanh 2 phút", "Đặt lịch xem dự án"],
      {
        ...leadSignals,
        hotness: "hot"
      }
    );
  }

  if (hasContact) {
    return buildResponse(
      "Dạ em đã ghi nhận SĐT/Zalo của anh/chị rồi ạ. Trong ít phút nữa đội ngũ tư vấn sẽ gửi **bảng giá nội bộ**, **video căn đẹp** và nếu cần em sắp xếp **gọi nhanh 2 phút** hoặc **đặt lịch xem dự án** luôn cho mình.",
      ["Gửi Zalo trước", "Gọi nhanh 2 phút", "Đặt lịch xem dự án"],
      {
        ...leadSignals,
        hotness: "hot"
      }
    );
  }

  if (/(can nao phu hop|phu hop tai chinh|hop tai chinh|nen chon can nao|tu van giup|minh muon xem can phu hop|goi y can|can nao hop)/.test(normalized)) {
    return buildResponse(
      "Dạ em có thể lọc nhanh theo nhu cầu và khung tài chính của mình. Anh/chị đang ưu tiên **đầu tư sinh lời** hay **mua để ở / nghỉ dưỡng** ạ?",
      ["Đầu tư sinh lời", "Mua để ở / nghỉ dưỡng", "Tài chính 1,5-2,5 tỷ"],
      {
        ...leadSignals,
        hotness: leadSignals.hotness === "cold" ? "warm" : leadSignals.hotness
      }
    );
  }

  if (/nhan bang gia noi bo|nhan bang gia|bang gia noi bo|nhan gia\s*626|bang gia\s*626/.test(normalized)) {
    return buildResponse(
      "Dạ em gửi anh/chị ngay ạ. Trước khi gửi, anh/chị đang quan tâm theo hướng nào để em gửi đúng căn phù hợp?",
      ["Đầu tư sinh lời", "Mua để ở / nghỉ dưỡng", "Gửi Zalo trước"],
      {
        ...leadSignals,
        intent: "pricing",
        hotness: "hot"
      }
    );
  }

  if (/xem video can dep|video can dep|xem video|xem can thuc te|can thuc te gia tot/.test(normalized)) {
    return buildResponse(
      "Dạ em có video ngắn và hình thực tế của các căn đang được quan tâm nhất. Anh/chị muốn xem theo hướng nào ạ?",
      ["Căn đầu tư giá tốt", "Căn view đẹp nghỉ dưỡng", "Gửi Zalo trước"],
      {
        ...leadSignals,
        hotness: leadSignals.hotness === "cold" ? "warm" : leadSignals.hotness
      }
    );
  }

  if (/can dau tu gia tot/.test(normalized)) {
    return buildResponse(
      "Dạ em sẽ lọc nhóm căn đầu tư giá tốt, dễ vào tiền và bám sát mức tài chính của mình. Anh/chị gửi giúp em **SĐT/Zalo**, em gửi ngay danh sách căn phù hợp nhất hôm nay ạ.",
      ["Gửi Zalo trước", "Gọi nhanh 2 phút", "Nhận bảng giá nội bộ"],
      {
        ...leadSignals,
        intent: "investment",
        hotness: "hot"
      }
    );
  }

  if (/can view dep nghi duong/.test(normalized)) {
    return buildResponse(
      "Dạ em sẽ ưu tiên nhóm căn view đẹp phù hợp nghỉ dưỡng hoặc ở lâu dài. Anh/chị để lại **SĐT/Zalo**, em gửi video và danh sách căn đẹp nhất đang còn ạ.",
      ["Gửi Zalo trước", "Nhận bảng giá nội bộ", "Đặt lịch xem dự án"],
      {
        ...leadSignals,
        intent: "resort",
        hotness: "hot"
      }
    );
  }

  if (/muon san pham de tang gia|de tang gia/.test(normalized)) {
    return buildResponse(
      "Dạ mức tăng giá là **kỳ vọng** theo vị trí, tiến độ và bảng căn từng thời điểm. Em có thể lọc nhóm căn có biên độ tốt hơn, anh/chị để lại **SĐT/Zalo** để em gửi đúng căn nội bộ ạ.",
      ["Gửi Zalo trước", "Nhận bảng giá nội bộ", "Gọi nhanh 2 phút"],
      {
        ...leadSignals,
        intent: "investment",
        hotness: "hot"
      }
    );
  }

  if (/muon san pham cho thue tot|de cho thue|cho thue tot/.test(normalized)) {
    return buildResponse(
      "Dạ em có thể lọc nhóm căn dễ khai thác cho thuê hơn tùy vị trí và diện tích. Anh/chị gửi giúp em **SĐT/Zalo**, em gửi bảng giá nội bộ và nhóm căn phù hợp ngay ạ.",
      ["Gửi Zalo trước", "Nhận bảng giá nội bộ", "Xem video căn đẹp"],
      {
        ...leadSignals,
        intent: "investment",
        hotness: "hot"
      }
    );
  }

  if (/tu van dau tu|dau tu sinh loi|toi muon dau tu/.test(normalized)) {
    return buildResponse(
      "Dạ với nhu cầu đầu tư, em sẽ lọc nhóm căn dễ vào tiền và dễ chốt hơn nếu biết khung tài chính của mình. Anh/chị đang quan tâm khoảng nào ạ?",
      INVESTMENT_BUDGET_OPTIONS,
      {
        ...leadSignals,
        intent: "investment",
        hotness: leadSignals.hotness === "cold" ? "warm" : leadSignals.hotness
      }
    );
  }

  if (/mua de o|mua de o \/ nghi duong|nghi duong|o \/ nghi duong/.test(normalized)) {
    return buildResponse(
      "Dạ em có thể lọc nhóm căn hợp nghỉ dưỡng hoặc ở lâu dài. Anh/chị đang nghiêng về tầm tài chính nào để em gửi đúng nhóm căn đẹp ạ?",
      RESORT_BUDGET_OPTIONS,
      {
        ...leadSignals,
        intent: /nghi duong|view dep|bien/.test(normalized) ? "resort" : "living",
        hotness: leadSignals.hotness === "cold" ? "warm" : leadSignals.hotness
      }
    );
  }

  if (/tai chinh duoi 1,5 ty|duoi 1,5 ty|1-1,5 ty|1\s*[-–]\s*1[,.]?5\s*ty|1[,.]?2\s*ty|1[,.]?3\s*ty|1[,.]?4\s*ty/.test(normalized)) {
    return buildResponse(
      "Dạ em ghi nhận mức tài chính mình đang dự tính. Để tránh báo sai mặt bằng giá hiện tại, em xin gửi **bảng giá cập nhật** và lọc lại nhóm căn phù hợp nhất cho mình nhé?",
      ["Nhận bảng giá nội bộ", "Gửi Zalo trước", "Xem pháp lý"],
      {
        ...leadSignals,
        budget: "Dưới 1,5 tỷ",
        hotness: leadSignals.hotness === "cold" ? "warm" : leadSignals.hotness
      }
    );
  }

  if (/quanh 1,5 ty|tam 1,5 ty|muc 1,5 ty|1[,.]?5\s*ty(?!\s*[-–])/.test(normalized)) {
    return buildResponse(
      "Dạ em ghi nhận mức tài chính quanh **1,5 tỷ**. Để tránh báo nhầm có căn đúng mốc này, em xin gửi **bảng giá cập nhật** và lọc các phương án đang phù hợp nhất cho mình nhé?",
      ["Nhận bảng giá nội bộ", "Gửi Zalo trước", "Xem căn thực tế"],
      {
        ...leadSignals,
        budget: "Quanh 1,5 tỷ",
        hotness: leadSignals.hotness === "cold" ? "warm" : leadSignals.hotness
      }
    );
  }

  if (/tai chinh 1,5-2,5 ty|1[,.]?5-2[,.]?5\s*ty|1[,.]?5\s*[-–]\s*2[,.]?5\s*ty|tu\s*1[,.]?5\s*den\s*2[,.]?5\s*ty/.test(normalized)) {
    return buildResponse(
      "Dạ với khung tài chính **1,5-2,5 tỷ**, em có thể lọc nhóm căn phù hợp theo vị trí, view và nhu cầu khai thác. Anh/chị muốn ưu tiên hướng nào trước ạ?",
      ["Căn đầu tư giá tốt", "Căn view đẹp nghỉ dưỡng", "Muốn sản phẩm cho thuê tốt"],
      {
        ...leadSignals,
        budget: "1,5-2,5 tỷ",
        hotness: leadSignals.hotness === "cold" ? "warm" : leadSignals.hotness
      }
    );
  }

  if (/tai chinh 2,5-5 ty|2[,.]?5-5\s*ty|2[,.]?5\s*[-–]\s*5\s*ty|tu\s*2[,.]?5\s*den\s*5\s*ty/.test(normalized)) {
    return buildResponse(
      "Dạ với khung tài chính **2,5-5 tỷ**, em có thể ưu tiên nhóm căn có vị trí đẹp hơn, tầm nhìn thoáng hơn và linh hoạt hơn về nhu cầu sử dụng. Anh/chị muốn xem theo hướng nào trước ạ?",
      ["Căn view đẹp nghỉ dưỡng", "Muốn sản phẩm dễ tăng giá", "Xem pháp lý"],
      {
        ...leadSignals,
        budget: "2,5-5 tỷ",
        hotness: leadSignals.hotness === "cold" ? "warm" : leadSignals.hotness
      }
    );
  }

  if (/tren 5 ty|5\s*ty tro len|hon 5 ty/.test(normalized)) {
    return buildResponse(
      "Dạ với ngân sách **trên 5 tỷ**, em có thể ưu tiên nhóm sản phẩm vị trí đẹp, tầm nhìn tốt và phương án khai thác linh hoạt hơn. Anh/chị muốn nhận **bảng giá**, **video căn đẹp** hay **pháp lý** trước ạ?",
      ["Nhận bảng giá nội bộ", "Xem video căn đẹp", "Xem pháp lý"],
      {
        ...leadSignals,
        budget: "Trên 5 tỷ",
        hotness: leadSignals.hotness === "cold" ? "warm" : leadSignals.hotness
      }
    );
  }

  if (/xem phap ly|phap ly|so hong|giay to|chu dau tu/.test(normalized)) {
    return buildResponse(
      "Dạ em sẽ gửi anh/chị thông tin **pháp lý**, **chính sách bán hàng** và bộ tài liệu dự án để xem rõ hơn. Anh/chị để lại **Zalo/SĐT**, em gửi ngay ạ.",
      ["Gửi Zalo trước", "Nhận bảng giá nội bộ", "Gọi nhanh 2 phút"],
      {
        ...leadSignals,
        intent: "legal",
        contactPreference: leadSignals.contactPreference === "unknown" ? "zalo" : leadSignals.contactPreference,
        hotness: "hot"
      }
    );
  }

  if (/gui gia|nhan gia\s*626/.test(normalized)) {
    return buildResponse(
      "Dạ em vẫn giữ sẵn **bảng giá nội bộ** và **video căn đẹp** cho anh/chị ạ. Anh/chị để lại **SĐT/Zalo**, em gửi ngay trong ít phút tới.",
      ["Gửi Zalo trước", "Xem video căn đẹp", "Gọi nhanh 2 phút"],
      {
        ...leadSignals,
        intent: "pricing",
        hotness: "hot"
      }
    );
  }
  if (/(gia bao nhieu|gia|bao nhieu tien|tong tien|chi phi)/.test(normalized)) {
    return buildResponse(
      `Dạ hiện dự án đang có các căn **${PROJECT_CONTEXT.priceAnchor.toLowerCase()}** tùy vị trí, tầng và thời điểm. Em có **bảng giá nội bộ** mới nhất, anh/chị để lại **SĐT/Zalo** em gửi đúng căn đẹp nhất hôm nay ạ.`,
      ["Nhận bảng giá nội bộ", "Đầu tư sinh lời", "Gửi Zalo trước"],
      {
        ...leadSignals,
        intent: "pricing",
        hotness: "hot"
      }
    );
  }

  if (/co vay duoc khong|vay duoc khong|ho tro tai chinh|tra gop/.test(normalized)) {
    return buildResponse(
      "Dạ thường sẽ có phương án tài chính hỗ trợ **tùy chính sách từng thời điểm**. Anh/chị cho em xin **SĐT/Zalo**, em gửi luôn bảng giá và phương án thanh toán phù hợp ạ.",
      ["Gửi Zalo trước", "Nhận bảng giá nội bộ", "Gọi nhanh 2 phút"],
      {
        ...leadSignals,
        intent: "pricing",
        hotness: "hot"
      }
    );
  }

  if (/o dau|vi tri|ban do|ket noi|vung tau/.test(normalized)) {
    return buildResponse(
      "Dạ em gửi ngay **vị trí**, **bản đồ** và **video thực tế** cho anh/chị nhé. Anh/chị cho em xin **Zalo/SĐT** để em gửi đầy đủ và nhanh hơn ạ.",
      ["Xem video căn đẹp", "Gửi Zalo trước", "Đặt lịch xem dự án"],
      {
        ...leadSignals,
        hotness: leadSignals.hotness === "cold" ? "warm" : leadSignals.hotness
      }
    );
  }

  if (/co tang gia that khong|tang gia that khong|co tang gia khong/.test(normalized)) {
    return buildResponse(
      "Dạ mức tăng giá là **kỳ vọng** theo thị trường, vị trí, tiến độ và bảng căn từng thời điểm. Điều quan trọng là chọn đúng căn đang có biên độ tốt, anh/chị cho em xin **SĐT/Zalo** để em lọc nhanh nhóm phù hợp nhất ạ.",
      ["Muốn sản phẩm dễ tăng giá", "Nhận bảng giá nội bộ", "Gửi Zalo trước"],
      {
        ...leadSignals,
        intent: "investment",
        hotness: "hot"
      }
    );
  }

  return null;
}

function buildFallbackResponse(message: string, history: ClientHistoryItem[]): Omit<ChatbotPayload, "source" | "leadCaptured" | "leadId"> {
  return (
    buildScriptedResponse(message, history) ??
    buildResponse(
      "Dạ em có thể hỗ trợ anh/chị xem **bảng giá nội bộ**, **video căn đẹp**, **thông tin pháp lý** hoặc tư vấn nhanh theo nhu cầu đầu tư và nghỉ dưỡng. Anh/chị muốn em gửi phần nào trước ạ?",
      DEFAULT_SUGGESTIONS,
      detectLeadSignals(message, history)
    )
  );
}

function sanitizeSuggestions(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return DEFAULT_SUGGESTIONS;
  }

  return dedupeSuggestions(
    value.filter((item): item is string => typeof item === "string").map((item) => item.trim())
  );
}

function parseGeminiText(responseData: any): string {
  const parts = responseData?.candidates?.[0]?.content?.parts;

  if (!Array.isArray(parts)) {
    return "";
  }

  return parts
    .map((part) => (typeof part?.text === "string" ? part.text : ""))
    .join("")
    .trim();
}

function tryParseJsonPayload(rawText: string): Omit<ChatbotPayload, "source" | "leadCaptured" | "leadId"> | null {
  if (!rawText) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawText);
    if (typeof parsed?.reply !== "string" || !parsed.reply.trim()) {
      return null;
    }

    const fallbackSignals: LeadSignals = {
      intent: "unknown",
      budget: "unknown",
      contactPreference: "unknown",
      hotness: "cold",
      name: ""
    };

    return {
      reply: parsed.reply.trim(),
      suggestions: sanitizeSuggestions(parsed.suggestions),
      leadSignals: mergeLeadSignals(parsed?.leadSignals, fallbackSignals)
    };
  } catch {
    return null;
  }
}

async function requestGeminiReply(message: string, history: ClientHistoryItem[]): Promise<Omit<ChatbotPayload, "source" | "leadCaptured" | "leadId">> {
  const scripted = buildScriptedResponse(message, history);
  if (scripted) {
    return scripted;
  }

  const apiKey = normalizeText(process.env.GEMINI_API_KEY);
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  if (!hasUsableGeminiApiKey(apiKey)) {
    return buildFallbackResponse(message, history);
  }

  const contents = history.slice(-10).map((item) => ({
    role: item.role === "assistant" ? "model" : "user",
    parts: [{ text: item.text }]
  }));

  contents.push({
    role: "user",
    parts: [{ text: message }]
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: CHATBOT_SYSTEM_PROMPT }]
        },
        contents,
        generationConfig: {
          temperature: 0.45,
          topP: 0.9,
          responseMimeType: "application/json"
        }
      }),
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API failed with status ${response.status}`);
  }

  const responseData = await response.json();
  const rawText = parseGeminiText(responseData);
  const parsed = tryParseJsonPayload(rawText);
  const detectedSignals = detectLeadSignals(message, history);

  if (parsed) {
    return {
      ...parsed,
      leadSignals: mergeLeadSignals(parsed.leadSignals, detectedSignals)
    };
  }

  const fallback = buildFallbackResponse(message, history);
  if (rawText) {
    return {
      ...fallback,
      reply: rawText,
      leadSignals: detectedSignals
    };
  }

  return fallback;
}

async function persistLeadIfPossible(message: string, history: ClientHistoryItem[], leadSignals: LeadSignals) {
  const leadInput = buildLeadInput(message, history, leadSignals);

  if (!leadInput.phone && !leadInput.zalo && !leadInput.email) {
    return null;
  }

  return persistLead(leadInput);
}

export async function POST(request: Request) {
  let message = "";

  try {
    const body = await request.json();
    message = typeof body?.message === "string" ? body.message.trim() : "";
    const history = Array.isArray(body?.history)
      ? body.history.filter(
          (item: unknown): item is ClientHistoryItem =>
            Boolean(item) &&
            typeof (item as ClientHistoryItem).text === "string" &&
            ((item as ClientHistoryItem).role === "user" || (item as ClientHistoryItem).role === "assistant")
        )
      : [];

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const scripted = buildScriptedResponse(message, history);
    const payload = scripted ?? (await requestGeminiReply(message, history));
    const source: ChatbotPayload["source"] = scripted
      ? "scripted"
      : hasUsableGeminiApiKey(process.env.GEMINI_API_KEY)
        ? "gemini"
        : "fallback";

    let leadCaptured = false;
    let leadId: string | undefined;

    try {
      const lead = await persistLeadIfPossible(message, history, payload.leadSignals);
      if (lead) {
        leadCaptured = true;
        leadId = lead.id;
      }
    } catch (leadError) {
      console.error("/api/chatbot lead persistence error", leadError);
    }

    return NextResponse.json(
      {
        ...payload,
        source,
        leadCaptured,
        leadId
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (error) {
    console.error("/api/chatbot error", error);

    return NextResponse.json(
      {
        ...buildFallbackResponse(message, []),
        source: "fallback",
        leadCaptured: false
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  }
}







