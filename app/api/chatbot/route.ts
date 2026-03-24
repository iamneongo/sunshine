import { NextResponse } from "next/server";
import {
  CHATBOT_SYSTEM_PROMPT,
  DEFAULT_QUICK_ACTIONS,
  PROJECT_CONTEXT
} from "@/lib/chatbot-config";

type ClientHistoryItem = {
  role: "user" | "assistant";
  text: string;
};

type LeadSignals = {
  intent: "investment" | "living" | "resort" | "pricing" | "legal" | "unknown";
  budget: string;
  contactPreference: "zalo" | "phone" | "email" | "unknown";
  hotness: "hot" | "warm" | "cold";
};

type ChatbotPayload = {
  reply: string;
  suggestions: string[];
  leadSignals: LeadSignals;
  source: "gemini" | "fallback";
};

const DEFAULT_SUGGESTIONS = DEFAULT_QUICK_ACTIONS.map((item) => item.prompt);

function normalizeVietnamese(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function detectLeadSignals(message: string): LeadSignals {
  const normalized = normalizeVietnamese(message);

  let intent: LeadSignals["intent"] = "unknown";
  if (/(gia|bang gia|nhan bang gia|1,2 ty|1.2 ty|tong tien|chi phi)/.test(normalized)) {
    intent = "pricing";
  } else if (/(phap ly|so hong|giay to|chu dau tu)/.test(normalized)) {
    intent = "legal";
  } else if (/(dau tu|sinh loi|dong tien|cho thue|tang gia)/.test(normalized)) {
    intent = "investment";
  } else if (/(nghi duong|view dep|resort|bien)/.test(normalized)) {
    intent = "resort";
  } else if (/(de o|an cu|o lau dai|gia dinh)/.test(normalized)) {
    intent = "living";
  }

  let contactPreference: LeadSignals["contactPreference"] = "unknown";
  if (/zalo/.test(normalized)) {
    contactPreference = "zalo";
  } else if (/(sdt|so dien thoai|phone|goi)/.test(normalized) || /(\+84|0)\d{8,10}/.test(normalized)) {
    contactPreference = "phone";
  } else if (/email/.test(normalized)) {
    contactPreference = "email";
  }

  let budget = "unknown";
  const budgetMatch = message.match(/(1[,.]?2\s*ty|1[,.]?5\s*ty|2\s*ty|\d+[,.]?\d*\s*ty)/i);
  if (budgetMatch?.[0]) {
    budget = budgetMatch[0];
  }

  let hotness: LeadSignals["hotness"] = "cold";
  if (/(gia bao nhieu|bang gia|nhan bang gia|phap ly|di xem|xem du an|goi lai|so dien thoai|zalo)/.test(normalized)) {
    hotness = "hot";
  } else if (/(dau tu|video|view dep|1,2 ty|1.2 ty|cho thue)/.test(normalized)) {
    hotness = "warm";
  }

  return {
    intent,
    budget,
    contactPreference,
    hotness
  };
}

function buildFallbackResponse(message: string): Omit<ChatbotPayload, "source"> {
  const normalized = normalizeVietnamese(message);
  const leadSignals = detectLeadSignals(message);

  if (/(\+84|0)\d{8,10}/.test(normalized)) {
    return {
      reply:
        "Dạ em đã ghi nhận SĐT/Zalo của anh/chị rồi ạ. Em sẽ ưu tiên gửi **bảng giá nội bộ**, **video căn đẹp** và có thể sắp xếp **gọi nhanh 2 phút** hoặc **đặt lịch xem dự án** nếu mình muốn.",
      suggestions: ["Gửi Zalo trước", "Gọi nhanh 2 phút", "Đặt lịch xem dự án"],
      leadSignals: {
        ...leadSignals,
        hotness: "hot"
      }
    };
  }

  if (/(gia|bang gia|nhan bang gia|1,2 ty|1.2 ty|tong tien|chi phi)/.test(normalized)) {
    return {
      reply:
        `Dạ hiện giỏ hàng đang có các căn **${PROJECT_CONTEXT.priceAnchor.toLowerCase()}** tùy vị trí, tầng và thời điểm. Anh/chị để lại **SĐT/Zalo**, em gửi ngay **bảng giá nội bộ** và căn đẹp nhất hôm nay ạ.`,
      suggestions: ["Đầu tư sinh lời", "Mua để ở / nghỉ dưỡng", "Gửi Zalo trước"],
      leadSignals: {
        ...leadSignals,
        intent: "pricing",
        hotness: leadSignals.hotness === "cold" ? "hot" : leadSignals.hotness
      }
    };
  }

  if (/(video|xem video|can dep|view dep|hinh anh|thuc te|vr)/.test(normalized)) {
    return {
      reply:
        "Dạ em có thể gửi video ngắn và hình thực tế của nhóm căn đang được quan tâm nhất. Anh/chị muốn xem nhóm **đầu tư giá tốt** hay **view đẹp nghỉ dưỡng**, rồi để lại **SĐT/Zalo** giúp em để em gửi đúng căn ạ.",
      suggestions: ["Căn đầu tư giá tốt", "Căn view đẹp nghỉ dưỡng", "Gửi Zalo trước"],
      leadSignals
    };
  }

  if (/(dau tu|sinh loi|dong tien|cho thue|tang gia)/.test(normalized)) {
    return {
      reply:
        "Dạ với nhu cầu đầu tư, bên em đang ưu tiên nhóm căn dễ vào tiền từ **1,2 tỷ**, có thể khai thác cho thuê và có biên độ tăng giá tốt nếu chọn đúng căn. Anh/chị cho em xin **SĐT/Zalo**, em lọc ngay giỏ hàng phù hợp để tư vấn gọn và đúng nhu cầu ạ.",
      suggestions: ["Tài chính 1-1,5 tỷ", "Muốn sản phẩm dễ tăng giá", "Gọi nhanh 2 phút"],
      leadSignals: {
        ...leadSignals,
        intent: "investment",
        hotness: leadSignals.hotness === "cold" ? "warm" : leadSignals.hotness
      }
    };
  }

  if (/(phap ly|so hong|giay to|chu dau tu)/.test(normalized)) {
    return {
      reply:
        "Dạ em có thể gửi phần thông tin pháp lý, chính sách bán hàng và tài liệu giới thiệu dự án để anh/chị xem rõ hơn. Anh/chị để lại **SĐT/Zalo**, em gửi ngay file phù hợp và bên em hỗ trợ chi tiết ạ.",
      suggestions: ["Xem pháp lý", "Nhận bảng giá nội bộ", "Gửi Zalo trước"],
      leadSignals: {
        ...leadSignals,
        intent: "legal",
        hotness: "hot"
      }
    };
  }

  if (/(o dau|vi tri|ban do|ket noi|vung tau)/.test(normalized)) {
    return {
      reply:
        "Dạ dự án nằm tại Nam Vũng Tàu, phù hợp cả đầu tư lẫn nghỉ dưỡng và đang hưởng lợi từ hạ tầng kết nối khu vực. Anh/chị để lại **Zalo/SĐT**, em gửi ngay vị trí, video thực tế và bảng giá để mình xem nhanh hơn ạ.",
      suggestions: ["Gửi vị trí", "Xem video căn đẹp", "Gửi Zalo trước"],
      leadSignals
    };
  }

  return {
    reply:
      "Dạ em có thể hỗ trợ anh/chị xem **bảng giá nội bộ**, **video căn đẹp**, **thông tin pháp lý** hoặc tư vấn nhanh theo nhu cầu đầu tư và nghỉ dưỡng. Anh/chị muốn em gửi phần nào trước ạ?",
    suggestions: DEFAULT_SUGGESTIONS,
    leadSignals
  };
}

function sanitizeSuggestions(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return DEFAULT_SUGGESTIONS;
  }

  const suggestions = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);

  return suggestions.length > 0 ? suggestions : DEFAULT_SUGGESTIONS;
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

function tryParseJsonPayload(rawText: string): Omit<ChatbotPayload, "source"> | null {
  if (!rawText) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawText);
    if (typeof parsed?.reply !== "string" || !parsed.reply.trim()) {
      return null;
    }

    return {
      reply: parsed.reply.trim(),
      suggestions: sanitizeSuggestions(parsed.suggestions),
      leadSignals: {
        intent: parsed?.leadSignals?.intent ?? "unknown",
        budget: typeof parsed?.leadSignals?.budget === "string" ? parsed.leadSignals.budget : "unknown",
        contactPreference: parsed?.leadSignals?.contactPreference ?? "unknown",
        hotness: parsed?.leadSignals?.hotness ?? "cold"
      }
    };
  } catch {
    return null;
  }
}

async function requestGeminiReply(message: string, history: ClientHistoryItem[]): Promise<Omit<ChatbotPayload, "source">> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  if (!apiKey) {
    return buildFallbackResponse(message);
  }

  const contents = history
    .slice(-10)
    .map((item) => ({
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
          temperature: 0.55,
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

  if (parsed) {
    return parsed;
  }

  const fallback = buildFallbackResponse(message);
  if (rawText) {
    return {
      ...fallback,
      reply: rawText
    };
  }

  return fallback;
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

    const payload = await requestGeminiReply(message, history);

    return NextResponse.json(
      {
        ...payload,
        source: process.env.GEMINI_API_KEY ? "gemini" : "fallback"
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
        ...buildFallbackResponse(message),
        source: "fallback"
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  }
}
