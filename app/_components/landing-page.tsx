"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  CHATBOT_PLACEHOLDER,
  DEFAULT_QUICK_ACTIONS,
  INITIAL_CHAT_MESSAGE,
  PROJECT_CONTEXT
} from "@/lib/chatbot-config";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

type LeadFormState = {
  fullName: string;
  phoneOrZalo: string;
  need: string;
  budget: string;
  contactPreference: "Zalo" | "Điện thoại" | "Email";
};

type LeadNotice = {
  type: "success" | "error";
  text: string;
} | null;

type ChatApiPayload = {
  reply: string;
  suggestions?: string[];
  leadCaptured?: boolean;
};

const NAV_LINKS = [
  { label: "Video", target: "video" },
  { label: "Bảng giá", target: "lead-form" },
  { label: "Hạ tầng", target: "infrastructure" },
  { label: "Pháp lý", target: "proof" }
] as const;

const HERO_BULLETS = [
  "Tổng giá từ 1,2 tỷ/căn",
  "Có video, tiến độ và pháp lý để đối chiếu",
  "Phù hợp khách cần lọc căn dễ vào tiền"
] as const;

const REASON_CARDS = [
  {
    title: "Tổng giá dễ hình dung",
    description: "Nhìn vào tổng tiền là khách có thể biết khá nhanh căn này có hợp khung tài chính của mình hay không."
  },
  {
    title: "Thông tin đúng thứ cần xem",
    description: "Video, tiến độ, hạ tầng và pháp lý đều có sẵn để khách đối chiếu trước khi xin bảng giá."
  },
  {
    title: "Dễ chọn bước tiếp theo",
    description: "Ai muốn xem giá, xin video hay hỏi pháp lý đều có đường đi rõ ràng, không bị thúc quá gắt."
  }
] as const;

const INFRASTRUCTURE_ITEMS = [
  "Cao tốc Biên Hòa - Vũng Tàu là chi tiết nhiều khách từ Đông Nam Bộ sẽ hỏi khi cân nhắc thời gian di chuyển.",
  "Cầu Cần Giờ thường được nhắc tới khi khách TP.HCM nhìn vào câu chuyện kết nối và khả năng tăng giá của khu vực.",
  "Nam Vũng Tàu vẫn được chú ý nhờ quỹ đất ven biển, hạ tầng mới và mặt bằng giá còn khá dễ tiếp cận."
] as const;

const PROOF_ITEMS = [
  "Thông tin chủ đầu tư và các đầu mục pháp lý có thể gửi riêng qua Zalo hoặc email để khách đối chiếu thuận tiện hơn.",
  "Video thực tế và các mốc tiến độ giúp khách hình dung dự án rõ hơn, thay vì chỉ nhìn phối cảnh.",
  "Nếu khách cần, hệ thống có thể gửi bảng giá nội bộ, video phù hợp và phần pháp lý đang quan tâm trong cùng một lượt."
] as const;

const INITIAL_LEAD_FORM: LeadFormState = {
  fullName: "",
  phoneOrZalo: "",
  need: "Đầu tư sinh lời",
  budget: "1-1,5 tỷ",
  contactPreference: "Zalo"
};

function ensureSessionId(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  const existing = window.sessionStorage.getItem("sunshine_session_v2");
  if (existing) {
    return existing;
  }

  const sessionId = `sess_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  window.sessionStorage.setItem("sunshine_session_v2", sessionId);
  return sessionId;
}

function renderRichText(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

export default function LandingPage() {
  const initialMessages = useMemo<ChatMessage[]>(
    () => [
      { role: "assistant", text: INITIAL_CHAT_MESSAGE },
      { role: "assistant", text: "Anh/chị muốn xem phần nào trước ạ?" }
    ],
    []
  );
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_QUICK_ACTIONS.map((item) => item.prompt));
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [leadForm, setLeadForm] = useState<LeadFormState>(INITIAL_LEAD_FORM);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadNotice, setLeadNotice] = useState<LeadNotice>(null);
  const historyRef = useRef<ChatMessage[]>(initialMessages);
  const endRef = useRef<HTMLDivElement | null>(null);
  const sessionIdRef = useRef("server");

  useEffect(() => {
    historyRef.current = messages;
  }, [messages]);

  useEffect(() => {
    sessionIdRef.current = ensureSessionId();
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "landing_view",
        source: "landing",
        sessionId: sessionIdRef.current,
        path: window.location.pathname,
        metadata: { campaign: "native_next_landing" }
      })
    }).catch(() => null);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("chatbot-open", chatOpen);
    return () => document.body.classList.remove("chatbot-open");
  }, [chatOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, suggestions, chatOpen]);

  function scrollToSection(target: string) {
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function trackEvent(name: string, metadata: Record<string, string> = {}) {
    try {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          name,
          source: "landing",
          sessionId: sessionIdRef.current,
          path: window.location.pathname,
          metadata
        })
      });
    } catch {
      // Ignore analytics errors.
    }
  }

  async function sendPrompt(rawText: string) {
    const text = rawText.trim();
    if (!text || chatLoading) {
      return;
    }

    setChatOpen(true);
    setChatLoading(true);
    setMessages((prev) => [...prev, { role: "user", text }]);
    setSuggestions([]);
    void trackEvent("chat_prompt_sent", { prompt: text.slice(0, 80) });

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyRef.current.map((item) => ({ role: item.role, text: item.text }))
        })
      });

      if (!response.ok) {
        throw new Error(`Chatbot API returned ${response.status}`);
      }

      const data = (await response.json()) as ChatApiPayload;
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
      setSuggestions(data.suggestions?.length ? data.suggestions : DEFAULT_QUICK_ACTIONS.map((item) => item.prompt));
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Dạ em có thể hỗ trợ anh/chị nhận **bảng giá nội bộ**, **video căn đẹp** hoặc **pháp lý**. Anh/chị để lại SĐT/Zalo giúp em để em gửi đúng phần mình cần nhé."
        }
      ]);
      setSuggestions(DEFAULT_QUICK_ACTIONS.map((item) => item.prompt));
    } finally {
      setChatLoading(false);
    }
  }

  async function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLeadSubmitting(true);
    setLeadNotice(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "landing_form",
          fullName: leadForm.fullName,
          phoneOrZalo: leadForm.phoneOrZalo,
          need: leadForm.need,
          budget: leadForm.budget,
          contactPreference: leadForm.contactPreference,
          hotness: /giá|pháp lý/i.test(leadForm.need) ? "hot" : "warm",
          notes: "Lead form native next landing",
          lastMessage: `${leadForm.need} | ${leadForm.budget}`,
          metadata: { placement: "native_next_landing" }
        })
      });

      if (!response.ok) {
        throw new Error(`Lead API returned ${response.status}`);
      }

      setLeadNotice({
        type: "success",
        text: "Thông tin đã được ghi nhận. Bảng giá nội bộ, video căn đẹp và phần anh/chị quan tâm sẽ được gửi trong ít phút tới."
      });
      setLeadForm(INITIAL_LEAD_FORM);
      void trackEvent("lead_form_submitted", {
        need: leadForm.need,
        budget: leadForm.budget,
        contactPreference: leadForm.contactPreference
      });
    } catch {
      setLeadNotice({
        type: "error",
        text: "Chưa gửi được thông tin. Anh/chị thử lại giúp em hoặc nhắn trực tiếp trong khung chat để em hỗ trợ ngay."
      });
    } finally {
      setLeadSubmitting(false);
    }
  }

  return (
    <div className="bg-slate-50 text-slate-950">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 text-white sm:px-6 lg:px-8">
          <button type="button" onClick={() => scrollToSection("hero")} className="flex items-center gap-3 text-left">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/15 text-amber-300">
              <i className="fa-solid fa-crown" />
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300/85">Sunshine Bay Retreat</div>
              <div className="text-sm text-white/70">Căn hộ biển Vũng Tàu</div>
            </div>
          </button>

          <nav className="hidden items-center gap-6 text-sm text-white/75 lg:flex">
            {NAV_LINKS.map((item) => (
              <button key={item.target} type="button" onClick={() => scrollToSection(item.target)} className="transition hover:text-white">
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void sendPrompt("Nhận bảng giá nội bộ")}
              className="hidden rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-amber-300 sm:inline-flex"
            >
              Nhận bảng giá
            </button>
            <button
              type="button"
              onClick={() => setChatOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 lg:hidden"
              aria-label="Mở chat"
            >
              <i className={`fa-solid ${chatOpen ? "fa-xmark" : "fa-comments"}`} />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section
          id="hero"
          className="relative flex min-h-screen items-center overflow-hidden bg-slate-950 pt-24 text-white"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(2,8,23,0.35) 0%, rgba(2,8,23,0.88) 58%, rgba(2,8,23,0.96) 100%), url('/hero.png')",
            backgroundPosition: "center",
            backgroundSize: "cover"
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.22),transparent_32%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200 backdrop-blur">
                <i className="fa-solid fa-file-lines" />
                Bảng căn nội bộ đang mở bán
              </span>
              <h1 className="mt-6 text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-7xl">
                Căn hộ biển Vũng Tàu
                <span className="mt-2 block text-amber-300">từ 1,2 tỷ/căn</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                {PROJECT_CONTEXT.projectName} phù hợp với nhóm khách muốn bắt đầu ở tầm vốn vừa phải nhưng vẫn cần đủ video,
                tiến độ và pháp lý để kiểm tra trước khi đi sâu vào bảng giá.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {HERO_BULLETS.map((item) => (
                  <div key={item} className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur">
                    <i className="fa-solid fa-circle-check text-amber-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void sendPrompt("Nhận bảng giá nội bộ")}
                  className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-4 text-sm font-bold uppercase tracking-[0.22em] text-slate-950 shadow-[0_18px_50px_rgba(251,191,36,0.28)] transition hover:bg-amber-300"
                >
                  Nhận bảng giá nội bộ
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection("video")}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-4 text-sm font-bold uppercase tracking-[0.22em] text-white backdrop-blur transition hover:bg-white/15"
                >
                  Xem video căn đẹp
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
              <div className="grid gap-4 rounded-[1.5rem] bg-slate-950/55 p-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200/80">Tổng giá</div>
                  <div className="mt-3 text-3xl font-black text-white">1,2 tỷ</div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">Tương đương khoảng 6x triệu/m², dễ hình dung tổng tiền hơn khi so sánh các căn.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200/80">Tình trạng quan tâm</div>
                  <div className="mt-3 text-3xl font-black text-white">73%</div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">Nhóm căn được hỏi nhiều đang tập trung vào căn dễ vào tiền và căn có view thoáng.</p>
                </div>
              </div>
              <img src="/luxury_beachfront_condo_hero_1774060840570.png" alt="Phối cảnh dự án" className="mt-4 h-[280px] w-full rounded-[1.5rem] object-cover sm:h-[360px]" />
            </div>
          </div>
        </section>

        <section id="video" className="bg-slate-100 py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
            <div className="max-w-2xl">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Video thực tế</div>
              <h2 className="mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-5xl">Xem nhanh căn đẹp, tiến độ và cảm giác dự án</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">Khách thường muốn xem nhanh hình thật, video ngắn và cảm giác tổng thể trước khi quyết định có nên xin bảng giá hay không.</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a href="https://www.youtube.com/watch?v=oum9PyUrZeg" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800">
                  Mở video trên YouTube
                </a>
                <button type="button" onClick={() => void sendPrompt("Xem video căn đẹp")} className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-950 transition hover:border-slate-400">
                  Gửi video qua Zalo
                </button>
              </div>
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <img src="/sunshine-vung-tau-8.jpg" alt="Video thực tế dự án" className="h-[420px] w-full rounded-[1.5rem] object-cover" />
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Trước khi đi sâu hơn</div>
              <h2 className="mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-5xl">Khách thường nhìn vào 3 điểm này trước</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">Chỉ cần đủ thông tin để khách tự đánh giá xem dự án có đáng để xin bảng giá và dành thời gian tìm hiểu tiếp hay không.</p>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {REASON_CARDS.map((item) => (
                <article key={item.title} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
                  <h3 className="text-2xl font-black leading-tight text-slate-950">{item.title}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-20 text-white sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">Đăng ký nhanh</div>
              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">Để lại thông tin để nhận bảng giá, video và phần mình cần</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Khách cần bảng giá, video hay pháp lý thì hệ thống sẽ gửi đúng phần đó trước, không gửi lan man.</p>
              <div className="mt-8 space-y-3">
                {[
                  "Bảng giá nội bộ theo mức tài chính đang quan tâm",
                  "Video căn phù hợp và một vài căn còn dễ chọn",
                  "Phần pháp lý hoặc tiến độ nếu muốn kiểm tra trước"
                ].map((text) => (
                  <div key={text} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200">
                    {text}
                  </div>
                ))}
              </div>
            </div>

            <div id="lead-form" className="rounded-[2rem] bg-white p-6 text-slate-950 shadow-[0_30px_80px_rgba(2,8,23,0.32)] sm:p-8">
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <input value={leadForm.fullName} onChange={(event) => setLeadForm((prev) => ({ ...prev, fullName: event.target.value }))} placeholder="Họ và tên *" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-amber-400 focus:bg-white" required />
                <input value={leadForm.phoneOrZalo} onChange={(event) => setLeadForm((prev) => ({ ...prev, phoneOrZalo: event.target.value }))} placeholder="SĐT / Zalo / Email *" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-amber-400 focus:bg-white" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <select value={leadForm.need} onChange={(event) => setLeadForm((prev) => ({ ...prev, need: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-amber-400 focus:bg-white">
                    <option>Đầu tư sinh lời</option>
                    <option>Mua để ở / nghỉ dưỡng</option>
                    <option>Muốn xem giá trước</option>
                    <option>Muốn xem pháp lý trước</option>
                  </select>
                  <select value={leadForm.budget} onChange={(event) => setLeadForm((prev) => ({ ...prev, budget: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-amber-400 focus:bg-white">
                    <option>1-1,5 tỷ</option>
                    <option>1,5-2 tỷ</option>
                    <option>Trên 2 tỷ</option>
                  </select>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(["Zalo", "Điện thoại", "Email"] as const).map((option) => {
                    const checked = leadForm.contactPreference === option;
                    return (
                      <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${checked ? "border-amber-400 bg-amber-50 text-slate-950" : "border-slate-200 bg-white text-slate-600"}`}>
                        <input type="radio" className="hidden" checked={checked} onChange={() => setLeadForm((prev) => ({ ...prev, contactPreference: option }))} />
                        <span className={`inline-flex h-4 w-4 rounded-full border ${checked ? "border-amber-500 bg-amber-400" : "border-slate-300"}`} />
                        {option}
                      </label>
                    );
                  })}
                </div>
                <button type="submit" disabled={leadSubmitting} className="inline-flex w-full items-center justify-center rounded-2xl bg-amber-400 px-6 py-4 text-sm font-bold uppercase tracking-[0.22em] text-slate-950 shadow-[0_18px_50px_rgba(251,191,36,0.28)] transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70">
                  {leadSubmitting ? "Đang gửi..." : "Nhận bảng giá nội bộ"}
                </button>
                <p className="text-xs leading-6 text-slate-500">Thông tin thường được gửi qua Zalo trước trong 2-5 phút, sau đó mới gọi nếu anh/chị muốn trao đổi nhanh hơn.</p>
              </form>

              {leadNotice ? (
                <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm leading-6 ${leadNotice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
                  {leadNotice.text}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section id="infrastructure" className="bg-slate-100 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Hạ tầng khu vực</div>
              <h2 className="mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-5xl">Nam Vũng Tàu là phần khách sẽ hỏi khá kỹ</h2>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {INFRASTRUCTURE_ITEMS.map((item) => (
                <article key={item} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <i className="fa-solid fa-road text-lg" />
                  </span>
                  <p className="mt-5 text-base leading-7 text-slate-600">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="proof" className="bg-white py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Pháp lý & tiến độ</div>
              <h2 className="mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-5xl">Khi cần, pháp lý và tiến độ sẽ được gửi riêng qua Zalo</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">Khách không nhất thiết phải đọc hết trên trang. Nhưng khi cần đối chiếu, mình phải gửi được ngay.</p>
              <button type="button" onClick={() => void sendPrompt("Xem pháp lý")} className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800">
                Nhận pháp lý qua Zalo
              </button>
            </div>
            <div className="grid gap-4">
              {PROOF_ITEMS.map((item) => (
                <div key={item} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-base leading-7 text-slate-600 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <aside id="chatbot-panel" className={`fixed bottom-24 right-4 z-[80] flex w-[380px] max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] transition duration-300 lg:right-6 ${chatOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`}>
        <div className="flex items-center justify-between gap-3 bg-slate-950 px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10">
              <img src="/ai_avatar_vn.png" alt="Sunshine AI" className="h-full w-full object-cover" />
            </span>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-amber-300">Sunshine Assistant</div>
              <div className="text-base font-bold">AI phản hồi tức thì</div>
            </div>
          </div>
          <button type="button" onClick={() => setChatOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/15" aria-label="Đóng chat">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="max-h-[420px] space-y-4 overflow-y-auto bg-slate-50 px-4 py-4">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[88%] rounded-[1.5rem] px-4 py-3 text-sm leading-7 shadow-sm ${message.role === "user" ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-700"}`}>
                {renderRichText(message.text)}
              </div>
            </div>
          ))}
          {chatLoading ? <div className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">Đang soạn phản hồi...</div> : null}
          <div ref={endRef} />
        </div>

        <div className="border-t border-slate-200 bg-white px-4 py-4">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {suggestions.map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => void sendPrompt(suggestion)} className="shrink-0 rounded-full border border-amber-300/60 bg-amber-50 px-4 py-2 text-xs font-semibold text-slate-900 transition hover:border-amber-400 hover:bg-amber-100">
                {suggestion}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
            <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                const prompt = chatInput;
                setChatInput("");
                void sendPrompt(prompt);
              }
            }} placeholder={CHATBOT_PLACEHOLDER} className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
            <button type="button" onClick={() => {
              const prompt = chatInput;
              setChatInput("");
              void sendPrompt(prompt);
            }} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-amber-400 text-slate-950 transition hover:bg-amber-300" aria-label="Gửi tin nhắn">
              <i className="fa-solid fa-paper-plane" />
            </button>
          </div>
        </div>
      </aside>

      <nav id="mobile-quick-nav" className="fixed bottom-0 left-0 z-[60] flex w-full items-center justify-around border-t border-slate-200 bg-white px-3 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] md:hidden">
        <button type="button" onClick={() => scrollToSection("lead-form")} className="flex flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-700">
          <i className="fa-solid fa-file-invoice-dollar text-base text-slate-900" />
          Bảng giá
        </button>
        <button type="button" onClick={() => setChatOpen((value) => !value)} className="-mt-9 inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-950 shadow-[0_18px_40px_rgba(15,23,42,0.18)]" aria-label="Mở trợ lý AI">
          <img src="/ai_avatar_vn.png" alt="AI Sunshine" className="h-full w-full object-cover" />
        </button>
        <button type="button" onClick={() => scrollToSection("video")} className="flex flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-700">
          <i className="fa-solid fa-circle-play text-base text-slate-900" />
          Xem video
        </button>
      </nav>
    </div>
  );
}


