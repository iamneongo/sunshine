import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Phone, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardLeadDetail } from "@/lib/dashboard-data";
import { getUcallCallBotStateForLead } from "@/lib/ucall";
import { DashboardFormSelect } from "../../_components/dashboard-form-select";
import {
  buildLeadQuickActions,
  cn,
  formatDateTime,
  getDashboardEventLabel,
  getDashboardEventSummary,
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
    <div className="rounded-lg border p-4">
      <div className="text-muted-foreground text-xs uppercase tracking-wide">{label}</div>
      <div className="mt-2 text-sm font-medium leading-6">{value || "Chưa có"}</div>
    </div>
  );
}

function LeadNotesTable({ notes }: { notes: string }) {
  const sections = parseLeadNotes(notes);

  if (sections.length === 0) {
    return (
      <div className="mt-3 rounded-lg border border-dashed p-4 text-muted-foreground text-sm">
        Chưa có ghi chú follow-up.
      </div>
    );
  }

  return (
    <div className="mt-3 overflow-hidden rounded-lg border">
      {sections.map((section) => (
        <div key={section.id} className="border-b last:border-b-0">
          <div className="bg-muted px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {section.title}
          </div>
          <dl className="divide-y">
            {section.rows.map((row) => (
              <div key={`${section.id}-${row.label}`} className="grid gap-1 px-4 py-3 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{row.label}</dt>
                <dd
                  className={`min-w-0 break-words text-sm leading-6 ${
                    row.isTechnical ? "font-mono text-xs text-muted-foreground" : "font-medium"
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
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge className={getLeadSourceTone(lead.source)} variant="outline">
              {getLeadSourceLabel(lead.source)}
            </Badge>
            <Badge className={getHotnessTone(lead.hotness)} variant="outline">
              {lead.hotness}
            </Badge>
            <Badge className={getStatusTone(lead.status)} variant="outline">
              {lead.status}
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{getLeadDisplayName(lead)}</h1>
          <p className="text-muted-foreground text-sm leading-6">{getLeadPrimaryContact(lead)} • {lead.need} • {lead.budget}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/leads">Về danh sách lead</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/follow-up">Queue follow-up</Link>
          </Button>
        </div>
      </div>

      {saved ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 text-sm">
          Lead đã được cập nhật trong dashboard.
        </div>
      ) : null}

      {updateError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700 text-sm">
          Không tìm thấy lead cần cập nhật. Vui lòng tải lại danh sách lead.
        </div>
      ) : null}

      {callBotSuccess ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 text-sm">
          Lead đã được đẩy sang call bot tự động của UCall.
        </div>
      ) : null}

      {callBotErrorMessage ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700 text-sm">
          {callBotErrorMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Lead profile</CardTitle>
            <CardDescription>Thông tin chính, nhu cầu và kênh liên hệ của lead hiện tại.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InfoField label="Liên hệ chính" value={getLeadPrimaryContact(lead)} />
            <InfoField label="Nhu cầu" value={lead.need} />
            <InfoField label="Ngân sách" value={lead.budget} />
            <InfoField label="Kênh ưu tiên" value={lead.contactPreference} />
          </CardContent>
          <CardContent className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="rounded-lg border p-4">
              <div className="text-muted-foreground text-xs uppercase tracking-wide">Tin nhắn / ngữ cảnh gần nhất</div>
              <p className="mt-2 text-sm leading-7">{lead.lastMessage || "Chưa có tin nhắn gần nhất."}</p>
            </div>
            <div className="space-y-3">
              <div className="rounded-lg border p-4 text-sm">
                <div className="text-muted-foreground">Tạo lúc</div>
                <div className="mt-1 font-medium">{formatDateTime(lead.createdAt)}</div>
              </div>
              <div className="rounded-lg border p-4 text-sm">
                <div className="text-muted-foreground">Cập nhật</div>
                <div className="mt-1 font-medium">{formatDateTime(lead.updatedAt)}</div>
              </div>
            </div>
          </CardContent>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {quickActions.length > 0 ? (
                quickActions.map((action) => (
                  <Button key={`${lead.id}-${action.label}`} asChild variant={action.label === "Gọi" ? "default" : "outline"}>
                    <a href={action.href} target={action.external ? "_blank" : undefined} rel={action.external ? "noreferrer" : undefined}>
                      {action.label === "Gọi" ? <Phone data-icon="inline-start" /> : <ArrowRight data-icon="inline-start" />}
                      {action.label}
                    </a>
                  </Button>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">Lead này chưa có kênh liên hệ nhanh.</span>
              )}
              <DashboardCallBotButton
                leadId={lead.id}
                returnTo={`/dashboard/leads/${lead.id}`}
                disabled={!callBotState.enabled}
                disabledReason={callBotState.reason}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  !callBotState.enabled ? "cursor-not-allowed opacity-50" : ""
                )}
                idleLabel="Call bot"
              />
            </div>
            {!callBotState.enabled ? <p className="mt-3 text-muted-foreground text-sm">{callBotState.reason}</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Checklist follow-up</CardTitle>
            <CardDescription>Những bước nên làm tiếp theo để giữ nhịp xử lý lead.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {nextSteps.map((step) => (
              <div key={step} className="rounded-lg border p-4 text-sm leading-6">
                {step}
              </div>
            ))}
          </CardContent>
          {lead.tags.length > 0 ? (
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tagLabels[tag] ?? tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          ) : null}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Hồ sơ và ngữ cảnh</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <InfoField label="Điện thoại" value={lead.phone} />
              <InfoField label="Zalo" value={lead.zalo} />
              <InfoField label="Email" value={lead.email} />
              <InfoField label="Khung giờ gọi" value={lead.preferredCallbackTime} />
              <InfoField label="Lịch xem dự án" value={lead.preferredVisitTime} />
              <InfoField label="Đi cùng" value={lead.travelParty} />
            </CardContent>
            <CardContent className="pt-0">
              <div className="text-muted-foreground text-xs uppercase tracking-wide">Ghi chú tích lũy</div>
              <LeadNotesTable notes={lead.notes} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lịch sử tương tác</CardTitle>
              <CardAction>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/analytics">Mở analytics</Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="max-h-[540px] space-y-3 overflow-y-auto">
              {relatedEvents.length > 0 ? (
                relatedEvents.map((event) => (
                  <Link key={event.id} href={`/dashboard/events/${event.id}`} className="block rounded-lg border p-4 transition hover:bg-muted/50">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-1">
                        <div className="font-medium">{getDashboardEventLabel(event.name)}</div>
                        <div className="text-muted-foreground text-sm uppercase">{event.source}</div>
                      </div>
                      <div className="text-muted-foreground text-sm">{formatDateTime(event.createdAt)}</div>
                    </div>
                    <p className="mt-3 text-muted-foreground text-sm leading-6">{getDashboardEventSummary(event.name, event.summary)}</p>
                  </Link>
                ))
              ) : (
                <div className="rounded-lg border border-dashed p-5 text-muted-foreground text-sm">
                  Chưa có event gắn trực tiếp với lead này.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Điều chỉnh trạng thái xử lý</CardTitle>
              <CardDescription>Cập nhật nhanh trạng thái, độ nóng và ngữ cảnh mới nhất của lead.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={`/api/dashboard/leads/${lead.id}`} method="post" className="space-y-4">
              <input type="hidden" name="returnTo" value={`/dashboard/leads/${lead.id}`} />

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-sm font-medium">Trạng thái</div>
                  <DashboardFormSelect
                    name="status"
                    defaultValue={lead.status}
                    triggerClassName="h-10 rounded-md"
                    options={[
                      { value: "Chưa gọi", label: "Chưa gọi" },
                      { value: "Đã gọi", label: "Đã gọi" },
                      { value: "Đã gửi thông tin", label: "Đã gửi thông tin" },
                      { value: "Đặt lịch", label: "Đặt lịch" },
                      { value: "Đã xem dự án", label: "Đã xem dự án" },
                      { value: "Đang chốt", label: "Đang chốt" }
                    ]}
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-sm font-medium">Độ nóng</div>
                  <DashboardFormSelect
                    name="hotness"
                    defaultValue={lead.hotness}
                    triggerClassName="h-10 rounded-md"
                    options={[
                      { value: "Nóng", label: "Nóng" },
                      { value: "Ấm", label: "Ấm" },
                      { value: "Lạnh", label: "Lạnh" }
                    ]}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-sm font-medium">Kênh ưu tiên</div>
                  <DashboardFormSelect
                    name="contactPreference"
                    defaultValue={lead.contactPreference}
                    triggerClassName="h-10 rounded-md"
                    options={[
                      { value: "Zalo", label: "Zalo" },
                      { value: "Điện thoại", label: "Điện thoại" },
                      { value: "Email", label: "Email" },
                      { value: "Chưa rõ", label: "Chưa rõ" }
                    ]}
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-sm font-medium">Khung giờ gọi</div>
                  <input
                    type="text"
                    name="preferredCallbackTime"
                    placeholder={lead.preferredCallbackTime || "Ví dụ: 14:00 - 16:00"}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-sm font-medium">Lịch xem dự án</div>
                  <input
                    type="text"
                    name="preferredVisitTime"
                    placeholder={lead.preferredVisitTime || "Ví dụ: Thứ 7 sáng"}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-sm font-medium">Đi cùng</div>
                  <input
                    type="text"
                    name="travelParty"
                    placeholder={lead.travelParty || "Ví dụ: Đi cùng gia đình"}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </label>
              </div>

              <label className="block">
                <div className="mb-2 text-sm font-medium">Ngữ cảnh mới nhất</div>
                <input
                  type="text"
                  name="lastMessage"
                  placeholder={lead.lastMessage || "Ví dụ: muốn xem pháp lý trước"}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </label>

              <label className="block">
                <div className="mb-2 text-sm font-medium">Thêm ghi chú nội bộ</div>
                <textarea
                  name="notes"
                  rows={5}
                  placeholder="Ghi thêm diễn biến mới, phản hồi của khách, lý do cần follow-up..."
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm leading-7 shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </label>

              <div className="flex flex-wrap gap-3">
                <Button type="submit">
                  <Settings2 data-icon="inline-start" />
                  Lưu cập nhật
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard/leads">Về bảng lead</Link>
                </Button>
              </div>
            </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mở nhanh lead liên quan</CardTitle>
              <CardAction>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/leads">Mở danh sách</Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="max-h-[320px] space-y-3 overflow-y-auto">
              {similarLeads.length > 0 ? (
                similarLeads.map((item) => (
                  <Link key={item.id} href={`/dashboard/leads/${item.id}`} className="block rounded-lg border p-4 transition hover:bg-muted/50">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-medium">{getLeadDisplayName(item)}</div>
                        <div className="mt-1 text-muted-foreground text-sm">{item.need} • {item.budget}</div>
                      </div>
                      <Badge className={getHotnessTone(item.hotness)} variant="outline">
                        {item.hotness}
                      </Badge>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-lg border border-dashed p-5 text-muted-foreground text-sm">
                  Chưa có lead tương tự trong dataset hiện tại.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin kỹ thuật đi kèm</CardTitle>
              <CardDescription>Metadata gắn với lead để kiểm tra automation, chatbot và call bot.</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[360px] space-y-3 overflow-y-auto">
              {metadataEntries.length > 0 ? (
                metadataEntries.map(([key, value]) => (
                  <div key={key} className="rounded-lg border p-4">
                    <div className="text-muted-foreground text-xs uppercase tracking-wide">{key}</div>
                    <div className="mt-2 break-words text-sm leading-6">{value}</div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-dashed p-5 text-muted-foreground text-sm">
                  Lead này chưa có metadata bổ sung.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


