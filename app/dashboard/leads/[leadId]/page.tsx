import Link from "next/link";
import { notFound } from "next/navigation";
import { getDashboardLeadDetail } from "@/lib/dashboard-data";
import { getUcallCallBotStateForLead } from "@/lib/ucall";
import {
  DashboardBadge,
  DashboardEmptyState,
  DashboardPageHeader,
  DashboardSurfaceCard,
  buildLeadQuickActions,
  dashboardButtonClasses,
  dashboardScrollAreaClasses,
  formatDateTime,
  getHotnessTone,
  getLeadDisplayName,
  getLeadPrimaryContact,
  getLeadSourceLabel,
  getLeadSourceTone,
  getRecommendedFollowUp,
  getStatusTone
} from "../../_components/dashboard-ui";
import { DashboardCallBotButton } from "../../_components/dashboard-call-bot-button";

export const dynamic = "force-dynamic";

type DashboardLeadDetailPageProps = {
  params: Promise<{ leadId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const tagLabels: Record<string, string> = {
  lead_nong: "Lead nóng",
  lead_dau_tu: "Thiên hướng đầu tư",
  lead_nghi_duong: "Nghỉ dưỡng",
  can_goi_ngay: "Cần gọi ngay"
};

function getSingleValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getCallBotErrorMessage(reason: string): string | null {
  if (reason === "config") {
    return "Thiếu cấu hình UCall để gọi bot tự động. Cần thêm API key, company slug và call campaign id.";
  }

  if (reason === "contact") {
    return "Lead này chưa có số điện thoại hợp lệ để gọi bot qua UCall.";
  }

  if (reason === "not-found") {
    return "Không tìm thấy lead để đẩy sang call bot. Vui lòng tải lại trang.";
  }

  if (reason === "failed") {
    return "Không thể đẩy lead sang call bot ở lần này. Vui lòng kiểm tra cấu hình campaign hoặc thử lại.";
  }

  return null;
}

type LeadDetailRecord = NonNullable<Awaited<ReturnType<typeof getDashboardLeadDetail>>>["lead"];

type LeadNoteRow = {
  label: string;
  value: string;
  fullValue?: string;
  isTechnical?: boolean;
};

type LeadNoteSection = {
  id: string;
  title: string;
  rows: LeadNoteRow[];
};

const noteKeyLabels: Record<string, string> = {
  "chatbot intent": "Ý định",
  budget: "Ngân sách",
  "last ask": "Tin nhắn gần nhất",
  campaign: "Campaign",
  customer: "Customer",
  need: "Nhu cầu",
  source: "Nguồn",
  status: "Trạng thái",
  zalo: "Zalo",
  email: "Email",
  visit: "Lịch xem",
  callback: "Khung giờ gọi",
  "contact preference": "Kênh ưu tiên"
};

const chatbotIntentLabels: Record<string, string> = {
  investment: "Đầu tư",
  pricing: "Xem bảng giá",
  legal: "Xem pháp lý",
  tour: "Đặt lịch xem dự án",
  video: "Xem video căn đẹp",
  resort: "Nghỉ dưỡng",
  living: "Ở / nghỉ dưỡng",
  unknown: "Chưa rõ"
};

function prettifyNoteKey(key: string): string {
  const normalizedKey = key.trim().toLowerCase();
  return noteKeyLabels[normalizedKey] ?? key.trim();
}

function shortenIdentifier(value: string): string {
  const trimmedValue = value.trim();

  if (trimmedValue.length <= 28) {
    return trimmedValue;
  }

  return `${trimmedValue.slice(0, 10)}...${trimmedValue.slice(-8)}`;
}

function prettifyNoteValue(key: string, value: string): LeadNoteRow {
  const normalizedKey = key.trim().toLowerCase();
  const trimmedValue = value.trim();

  if (normalizedKey === "chatbot intent") {
    return {
      label: prettifyNoteKey(key),
      value: chatbotIntentLabels[trimmedValue.toLowerCase()] ?? trimmedValue
    };
  }

  if (normalizedKey === "campaign" || normalizedKey === "customer") {
    return {
      label: prettifyNoteKey(key),
      value: shortenIdentifier(trimmedValue),
      fullValue: trimmedValue,
      isTechnical: true
    };
  }

  return {
    label: prettifyNoteKey(key),
    value: trimmedValue
  };
}

function sanitizeStructuredValue(value: string): string {
  return value
    .replace(/\[(?:UCall(?: Auto)?)\]\s*.*?(?=(?:\s*\[(?:UCall(?: Auto)?)\])|$)/gi, " ")
    .replace(/\s*Campaign:\s*[a-f0-9-]{8,}/gi, "")
    .replace(/\s*Customer:\s*[a-f0-9-]{8,}/gi, "")
    .replace(/\s*Chatbot intent:.*$/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\|$/, "")
    .trim();
}

function buildStructuredRows(line: string): LeadNoteRow[] {
  const cleanedLine = sanitizeStructuredValue(line);
  const rows: LeadNoteRow[] = [];
  const seen = new Set<string>();

  for (const segment of cleanedLine.split(/\s*\|\s*/)) {
    const match = segment.match(/^([^:]{2,40}):\s*(.+)$/);

    if (!match) {
      continue;
    }

    const rawKey = match[1].trim();
    const normalizedKey = rawKey.toLowerCase();
    const sanitizedValue = sanitizeStructuredValue(match[2]);

    if (!sanitizedValue) {
      continue;
    }

    const row = prettifyNoteValue(rawKey, sanitizedValue);
    const dedupeKey = `${normalizedKey}:${row.value}`;

    if (seen.has(dedupeKey)) {
      continue;
    }

    seen.add(dedupeKey);
    rows.push(row);
  }

  return rows;
}

function extractUcallFragments(line: string): string[] {
  return Array.from(line.matchAll(/\[(?:UCall(?: Auto)?)\]\s*.*?(?=(?:\s*\[(?:UCall(?: Auto)?)\])|$)/gi)).map((match) =>
    match[0].trim()
  );
}

function parseUcallNoteLine(line: string, index: number): LeadNoteSection | null {
  const titleMatch = line.match(/\[(UCall(?: Auto)?)\]\s*(.+)$/i);

  if (!titleMatch) {
    return null;
  }

  const title = titleMatch[1].toLowerCase().includes("auto") ? "Call bot tự động" : "Call bot";
  const body = titleMatch[2].trim();
  const campaignMatch = body.match(/\bCampaign:\s*([a-f0-9-]{8,})/i);
  const customerMatch = body.match(/\bCustomer:\s*([a-f0-9-]{8,})/i);
  const message = body
    .replace(/\|?\s*Campaign:\s*[a-f0-9-]{8,}/i, "")
    .replace(/\|?\s*Customer:\s*[a-f0-9-]{8,}/i, "")
    .replace(/\s*Chatbot intent:.*$/i, "")
    .trim()
    .replace(/\|\s*$/, "")
    .replace(/\.$/, "");
  const rows: LeadNoteRow[] = [];

  if (message) {
    rows.push({ label: "Nội dung", value: message });
  }

  if (campaignMatch) {
    rows.push(prettifyNoteValue("Campaign", campaignMatch[1]));
  }

  if (customerMatch) {
    rows.push(prettifyNoteValue("Customer", customerMatch[1]));
  }

  return {
    id: `ucall-${index}`,
    title,
    rows
  };
}

function parseLeadNotes(notes: string): LeadNoteSection[] {
  return notes
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line, index) => {
      const sections: LeadNoteSection[] = [];
      const structuredRows = buildStructuredRows(line);

      if (structuredRows.length > 0) {
        sections.push({
          id: `structured-${index}`,
          title: line.toLowerCase().includes("chatbot intent") ? "Thông tin chatbot" : "Ghi chú",
          rows: structuredRows
        });
      }

      const ucallSections = extractUcallFragments(line)
        .map((fragment, fragmentIndex) => parseUcallNoteLine(fragment, index * 10 + fragmentIndex))
        .filter((section): section is LeadNoteSection => Boolean(section));

      if (ucallSections.length > 0) {
        sections.push(...ucallSections);
      }

      if (sections.length === 0) {
        const rawValue = sanitizeStructuredValue(line);

        if (rawValue) {
          sections.push({
            id: `raw-${index}`,
            title: "Ghi chú",
            rows: [{ label: "Nội dung", value: rawValue }]
          });
        }
      }

      return sections;
    })
    .slice(-6)
    .reverse();
}

function buildNextSteps(lead: LeadDetailRecord): string[] {
  const steps = [getRecommendedFollowUp(lead)];

  if (lead.contactPreference === "Zalo") {
    steps.push("Chuẩn bị gói gửi nhanh qua Zalo gồm bảng giá phù hợp, căn gợi ý và bản đồ dự án.");
  }

  if (lead.status === "Đặt lịch") {
    steps.push("Xác nhận lại thời gian, vị trí và thành phần đi xem để tránh hụt lịch trong ngày.");
  }

  if (lead.need === "Xem pháp lý") {
    steps.push("Ưu tiên chốt bộ tài liệu pháp lý cần gửi trước khi sale gọi follow-up tiếp theo.");
  }

  if (lead.hotness === "Nóng") {
    steps.push("Giữ nhịp liên hệ trong cùng phiên làm việc này để tránh nguội lead.");
  }

  return Array.from(new Set(steps));
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 text-sm font-semibold leading-6 text-slate-700">{value || "Chưa có"}</div>
    </div>
  );
}

function LeadNotesTable({ notes }: { notes: string }) {
  const sections = parseLeadNotes(notes);

  if (sections.length === 0) {
    return (
      <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-500">
        Chưa có ghi chú follow-up.
      </div>
    );
  }

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
      {sections.map((section) => (
        <div key={section.id} className="border-b border-slate-200 last:border-b-0">
          <div className="bg-slate-100/80 px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
            {section.title}
          </div>
          <dl className="divide-y divide-slate-100">
            {section.rows.map((row) => (
              <div key={`${section.id}-${row.label}`} className="grid gap-1 px-4 py-3 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4">
                <dt className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{row.label}</dt>
                <dd
                  className={`min-w-0 break-words text-sm font-semibold leading-6 text-slate-700 ${
                    row.isTechnical ? "font-mono text-[12px] tracking-normal text-slate-600" : ""
                  }`}
                  title={row.fullValue}
                >
                  {row.value || "Chưa có"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

export default async function DashboardLeadDetailPage({ params, searchParams }: DashboardLeadDetailPageProps) {
  const { leadId } = await params;
  const query = searchParams ? await searchParams : undefined;
  const detail = await getDashboardLeadDetail(leadId);

  if (!detail) {
    notFound();
  }

  const { lead, relatedEvents, similarLeads } = detail;
  const quickActions = buildLeadQuickActions(lead);
  const nextSteps = buildNextSteps(lead);
  const saved = getSingleValue(query?.saved) === "1";
  const updateError = getSingleValue(query?.error) === "not-found";
  const callBotSuccess = getSingleValue(query?.callBot) === "1";
  const callBotErrorReason = getSingleValue(query?.callBotError);
  const callBotErrorMessage = getCallBotErrorMessage(callBotErrorReason);
  const callBotState = getUcallCallBotStateForLead(lead);
  const metadataEntries = Object.entries(lead.metadata ?? {});

  return (
    <div className="space-y-6 lg:space-y-8">
      <DashboardPageHeader

        title={getLeadDisplayName(lead)}

        actions={
          <>
            <Link href="/dashboard/leads" className={dashboardButtonClasses("outline")}>
              Về danh sách lead
            </Link>
            <Link href="/dashboard/follow-up" className={dashboardButtonClasses()}>
              Queue follow-up
            </Link>
          </>
        }
      />

      {saved ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700 sm:px-5">
          Lead đã được cập nhật trong dashboard.
        </div>
      ) : null}

      {updateError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm font-semibold text-rose-700 sm:px-5">
          Không tìm thấy lead cần cập nhật. Vui lòng tải lại danh sách lead.
        </div>
      ) : null}

      {callBotSuccess ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700 sm:px-5">
          Lead đã được đẩy sang call bot tự động của UCall.
        </div>
      ) : null}

      {callBotErrorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm font-semibold text-rose-700 sm:px-5">
          {callBotErrorMessage}
        </div>
      ) : null}

      <DashboardSurfaceCard className="p-5 sm:p-6">
        <div className="flex flex-col gap-6 2xl:flex-row 2xl:items-start 2xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              <DashboardBadge className={getLeadSourceTone(lead.source)}>{getLeadSourceLabel(lead.source)}</DashboardBadge>
              <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${getHotnessTone(lead.hotness)}`}>
                {lead.hotness}
              </span>
              <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${getStatusTone(lead.status)}`}>
                {lead.status}
              </span>
            </div>

            <div className="mt-4 text-3xl font-black tracking-tight text-slate-950">{getLeadDisplayName(lead)}</div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <InfoField label="Liên hệ chính" value={getLeadPrimaryContact(lead)} />
              <InfoField label="Nhu cầu" value={lead.need} />
              <InfoField label="Ngân sách" value={lead.budget} />
              <InfoField label="Kênh ưu tiên" value={lead.contactPreference} />
            </div>
          </div>

          <div className="2xl:w-[320px]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mt-4 flex flex-wrap gap-2">
                {quickActions.length > 0 ? (
                  quickActions.map((action) => (
                    <a
                      key={`${lead.id}-${action.label}`}
                      href={action.href}
                      target={action.external ? "_blank" : undefined}
                      rel={action.external ? "noreferrer" : undefined}
                      className={dashboardButtonClasses(action.label === "Gọi" ? "default" : "outline")}
                    >
                      <i className={`fa-solid ${action.icon} mr-2`}></i>
                      {action.label}
                    </a>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">Lead này chưa có kênh liên hệ nhanh.</span>
                )}
                <DashboardCallBotButton
                  leadId={lead.id}
                  returnTo={`/dashboard/leads/${lead.id}`}
                  disabled={!callBotState.enabled}
                  disabledReason={callBotState.reason}
                  className={`${dashboardButtonClasses("outline")} ${!callBotState.enabled ? "cursor-not-allowed opacity-50" : ""}`}
                />
              </div>
              {!callBotState.enabled ? (
                <div className="mt-3 text-xs font-semibold text-slate-500">{callBotState.reason}</div>
              ) : null}
              <div className="mt-4 grid gap-3 text-sm text-slate-600">
                <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <span>Tạo lúc</span>
                  <span className="font-semibold text-slate-950">{formatDateTime(lead.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <span>Cập nhật</span>
                  <span className="font-semibold text-slate-950">{formatDateTime(lead.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardSurfaceCard>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
        <div className="space-y-6">
          <DashboardSurfaceCard className="p-5 sm:p-6">
            <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Hồ sơ và ngữ cảnh</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <InfoField label="Điện thoại" value={lead.phone} />
              <InfoField label="Zalo" value={lead.zalo} />
              <InfoField label="Email" value={lead.email} />
              <InfoField label="Khung giờ gọi" value={lead.preferredCallbackTime} />
              <InfoField label="Lịch xem dự án" value={lead.preferredVisitTime} />
              <InfoField label="Đi cùng" value={lead.travelParty} />
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Tin nhắn / ngữ cảnh gần nhất</div>
              <p className="mt-2 text-sm leading-7 text-slate-600">{lead.lastMessage || "Chưa có tin nhắn gần nhất."}</p>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Ghi chú tích lũy</div>
              <LeadNotesTable notes={lead.notes} />
            </div>

            {lead.tags.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {lead.tags.map((tag) => (
                  <DashboardBadge key={tag}>{tagLabels[tag] ?? tag}</DashboardBadge>
                ))}
              </div>
            ) : null}
          </DashboardSurfaceCard>

          <DashboardSurfaceCard className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Lịch sử tương tác</h2>
              </div>
              <Link href="/dashboard/analytics" className={dashboardButtonClasses("outline")}>
                Mở analytics
              </Link>
            </div>
            <div className={`mt-6 space-y-3 ${dashboardScrollAreaClasses("card")}`}>
              {relatedEvents.length > 0 ? (
                relatedEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/dashboard/events/${event.id}`}
                    className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-sm font-black text-slate-950">{event.name}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{event.source}</div>
                      </div>
                      <div className="text-xs font-semibold text-slate-500">{formatDateTime(event.createdAt)}</div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{event.summary}</p>
                  </Link>
                ))
              ) : (
                <DashboardEmptyState message="Chưa có event gắn trực tiếp với lead này." />
              )}
            </div>
          </DashboardSurfaceCard>
        </div>

        <div className="space-y-6">
          <DashboardSurfaceCard className="p-5 sm:p-6">
            <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Điều chỉnh trạng thái xử lý</h2>
            <form action={`/api/dashboard/leads/${lead.id}`} method="post" className="mt-6 space-y-4">
              <input type="hidden" name="returnTo" value={`/dashboard/leads/${lead.id}`} />

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Trạng thái</div>
                  <select
                    name="status"
                    defaultValue={lead.status}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-slate-400"
                  >
                    <option value="Chưa gọi">Chưa gọi</option>
                    <option value="Đã gọi">Đã gọi</option>
                    <option value="Đã gửi thông tin">Đã gửi thông tin</option>
                    <option value="Đặt lịch">Đặt lịch</option>
                    <option value="Đã xem dự án">Đã xem dự án</option>
                    <option value="Đang chốt">Đang chốt</option>
                  </select>
                </label>

                <label className="block">
                  <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Độ nóng</div>
                  <select
                    name="hotness"
                    defaultValue={lead.hotness}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-slate-400"
                  >
                    <option value="Nóng">Nóng</option>
                    <option value="Ấm">Ấm</option>
                    <option value="Lạnh">Lạnh</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Kênh ưu tiên</div>
                  <select
                    name="contactPreference"
                    defaultValue={lead.contactPreference}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-slate-400"
                  >
                    <option value="Zalo">Zalo</option>
                    <option value="Điện thoại">Điện thoại</option>
                    <option value="Email">Email</option>
                    <option value="Chưa rõ">Chưa rõ</option>
                  </select>
                </label>

                <label className="block">
                  <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Khung giờ gọi</div>
                  <input
                    type="text"
                    name="preferredCallbackTime"
                    placeholder={lead.preferredCallbackTime || "Ví dụ: 14:00 - 16:00"}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Lịch xem dự án</div>
                  <input
                    type="text"
                    name="preferredVisitTime"
                    placeholder={lead.preferredVisitTime || "Ví dụ: Thứ 7 sáng"}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Đi cùng</div>
                  <input
                    type="text"
                    name="travelParty"
                    placeholder={lead.travelParty || "Ví dụ: Đi cùng gia đình"}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                  />
                </label>
              </div>

              <label className="block">
                <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Ngữ cảnh mới nhất</div>
                <input
                  type="text"
                  name="lastMessage"
                  placeholder={lead.lastMessage || "Ví dụ: muốn xem pháp lý trước"}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                />
              </label>

              <label className="block">
                <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Thêm ghi chú nội bộ</div>
                <textarea
                  name="notes"
                  rows={5}
                  placeholder="Ghi thêm diễn biến mới, phản hồi của khách, lý do cần follow-up..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                />
              </label>

              <div className="flex flex-wrap gap-3">
                <button type="submit" className={dashboardButtonClasses()}>
                  Lưu cập nhật
                </button>
                <Link href="/dashboard/leads" className={dashboardButtonClasses("outline")}>
                  Về bảng lead
                </Link>
              </div>
            </form>
          </DashboardSurfaceCard>

          <DashboardSurfaceCard className="p-5 sm:p-6">
            <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Checklist follow-up</h2>
            <div className="mt-6 space-y-3">
              {nextSteps.map((step) => (
                <div key={step} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
                  {step}
                </div>
              ))}
            </div>
          </DashboardSurfaceCard>

          <DashboardSurfaceCard className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Mở nhanh lead liên quan</h2>
              </div>
              <Link href="/dashboard/leads" className={dashboardButtonClasses("outline")}>
                Mở danh sách
              </Link>
            </div>
            <div className={`mt-6 space-y-3 ${dashboardScrollAreaClasses("card")}`}>
              {similarLeads.length > 0 ? (
                similarLeads.map((item) => (
                  <Link
                    key={item.id}
                    href={`/dashboard/leads/${item.id}`}
                    className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-black text-slate-950">{getLeadDisplayName(item)}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{item.need} • {item.budget}</div>
                      </div>
                      <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${getHotnessTone(item.hotness)}`}>
                        {item.hotness}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <DashboardEmptyState message="Chưa có lead tương tự trong dataset hiện tại." />
              )}
            </div>
          </DashboardSurfaceCard>

          <DashboardSurfaceCard className="p-5 sm:p-6">
            <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Thông tin kỹ thuật đi kèm</h2>
            <div className={`mt-6 space-y-3 ${dashboardScrollAreaClasses("card")}`}>
              {metadataEntries.length > 0 ? (
                metadataEntries.map(([key, value]) => (
                  <div key={key} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{key}</div>
                    <div className="mt-2 break-words text-sm leading-6 text-slate-600">{value}</div>
                  </div>
                ))
              ) : (
                <DashboardEmptyState message="Lead này chưa có metadata bổ sung." />
              )}
            </div>
          </DashboardSurfaceCard>
        </div>
      </section>
    </div>
  );
}


