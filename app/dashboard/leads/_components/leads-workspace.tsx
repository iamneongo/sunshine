"use client";

import Link from "next/link";
import * as React from "react";
import { startTransition, useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Flame, PhoneCall, Search, Users } from "lucide-react";
import type { LeadRecord } from "@/lib/lead-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Filters, createFilter, type Filter, type FilterFieldConfig } from "@/components/reui/filters";
import { DataTable, type DataTableColumnMeta } from "@/components/tablecn/data-table";
import { DataTableColumnHeader } from "@/components/tablecn/data-table-column-header";
import { DashboardStatCard } from "../../_components/dashboard-stat-card";
import {
  DashboardEmptyState,
  DashboardPageIntro,
  buildLeadQuickActions,
  getHotnessTone,
  getLeadDisplayName,
  getLeadPrimaryContact,
  getLeadSourceLabel,
  getLeadSourceTone,
  getStatusTone
} from "../../_components/dashboard-ui";

type BreakdownItem = {
  label: string;
  count: number;
  share: number;
};

type LeadFiltersState = {
  q: string;
  source: string;
  hotness: string;
  status: string;
  need: string;
  budget: string;
};

type LeadsWorkspaceProps = {
  leads: LeadRecord[];
  overview: {
    totalLeads: number;
    hotLeads: number;
    pendingCalls: number;
    todayLeads: number;
  };
  connectionLeadSource: string;
  sourceBreakdown: BreakdownItem[];
  hotnessBreakdown: BreakdownItem[];
  statusBreakdown: BreakdownItem[];
  needBreakdown: BreakdownItem[];
  budgetBreakdown: BreakdownItem[];
  initialFilters: LeadFiltersState;
};

const filterFields: FilterFieldConfig[] = [
  { key: "source", label: "Nguồn", type: "select" },
  { key: "hotness", label: "Độ nóng", type: "select" },
  { key: "status", label: "Trạng thái", type: "select" },
  { key: "need", label: "Nhu cầu", type: "select" },
  { key: "budget", label: "Ngân sách", type: "select" }
];

function extractVisibleLeadNote(notes: string): string {
  const lines = notes
    .split(/\r?\n/)
    .map((line) => line.replace(/\[UCall.*$/i, "").trim())
    .filter(Boolean)
    .filter((line) => !/^\[ucall/i.test(line));

  const firstLine = lines[0] ?? "";
  const chatbotIntent = firstLine.match(/chatbot intent:\s*([^|]+)/i)?.[1]?.trim();
  const budget = firstLine.match(/budget:\s*([^|]+)/i)?.[1]?.trim();
  const rawLastAsk = firstLine.match(/last ask:\s*([^|]+)/i)?.[1]?.trim();
  const lastAsk = rawLastAsk
    ?.replace(/chatbot intent:.*$/i, "")
    ?.replace(/budget:.*$/i, "")
    ?.replace(/last ask:.*$/i, "")
    ?.trim();

  if (chatbotIntent || budget || lastAsk) {
    const parts: string[] = [];

    if (chatbotIntent) {
      const intentLabel =
        {
          investment: "Đầu tư",
          pricing: "Xem bảng giá",
          legal: "Xem pháp lý",
          tour: "Đặt lịch xem dự án",
          video: "Xem video căn đẹp",
          resort: "Nghỉ dưỡng",
          living: "Ở / nghỉ dưỡng"
        }[chatbotIntent.toLowerCase()] ?? chatbotIntent;

      parts.push(`Nhu cầu ${intentLabel}`);
    }

    if (budget) {
      parts.push(`Ngân sách ${budget}`);
    }

    if (lastAsk) {
      parts.push(`Bước gần nhất: ${lastAsk}`);
    }

    return parts.join(" • ");
  }

  return firstLine;
}

function getLeadContextNote(lead: LeadRecord): string {
  return lead.preferredVisitTime || lead.preferredCallbackTime || lead.lastMessage || extractVisibleLeadNote(lead.notes) || "Chưa có ghi chú follow-up.";
}

function normalizeForSearch(value: string): string {
  return value.toLowerCase().trim();
}

function matchesLeadFilter(lead: LeadRecord, filters: LeadFiltersState): boolean {
  const query = normalizeForSearch(filters.q);
  const haystack = normalizeForSearch(
    [
      lead.fullName,
      lead.phone,
      lead.zalo,
      lead.email,
      lead.need,
      lead.budget,
      lead.status,
      lead.hotness,
      lead.notes,
      lead.lastMessage,
      lead.contactPreference,
      lead.projectName
    ]
      .filter(Boolean)
      .join(" ")
  );

  if (query && !haystack.includes(query)) {
    return false;
  }

  if (filters.source && lead.source !== filters.source) return false;
  if (filters.hotness && lead.hotness !== filters.hotness) return false;
  if (filters.status && lead.status !== filters.status) return false;
  if (filters.need && lead.need !== filters.need) return false;
  if (filters.budget && lead.budget !== filters.budget) return false;

  return true;
}

function buildFiltersFromState(state: LeadFiltersState): Filter[] {
  const entries: Array<[keyof Omit<LeadFiltersState, "q">, string]> = [
    ["source", state.source],
    ["hotness", state.hotness],
    ["status", state.status],
    ["need", state.need],
    ["budget", state.budget]
  ];

  return entries
    .filter(([, value]) => Boolean(value))
    .map(([field, value]) => createFilter(field, "is", [value]));
}

function applyChipFilters(base: LeadFiltersState, chips: Filter[]): LeadFiltersState {
  const nextState: LeadFiltersState = {
    ...base,
    source: "",
    hotness: "",
    status: "",
    need: "",
    budget: ""
  };

  for (const chip of chips) {
    const value = chip.values[0] ?? "";

    if (chip.field in nextState) {
      nextState[chip.field as keyof LeadFiltersState] = value;
    }
  }

  return nextState;
}

function buildSearchParams(filters: LeadFiltersState) {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.source) params.set("source", filters.source);
  if (filters.hotness) params.set("hotness", filters.hotness);
  if (filters.status) params.set("status", filters.status);
  if (filters.need) params.set("need", filters.need);
  if (filters.budget) params.set("budget", filters.budget);

  return params.toString();
}

function areFilterListsEqual(left: Filter[], right: Filter[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((item, index) => {
    const next = right[index];

    if (!next) {
      return false;
    }

    return item.field === next.field && item.operator === next.operator && item.values.join("|") === next.values.join("|");
  });
}

export function LeadsWorkspace({
  leads,
  overview,
  connectionLeadSource,
  sourceBreakdown,
  hotnessBreakdown,
  statusBreakdown,
  needBreakdown,
  budgetBreakdown,
  initialFilters
}: LeadsWorkspaceProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchText, setSearchText] = React.useState(initialFilters.q);
  const [debouncedSearchText, setDebouncedSearchText] = React.useState(initialFilters.q);
  const [chipFilters, setChipFilters] = React.useState<Filter[]>(buildFiltersFromState(initialFilters));
  const initialFiltersKey = useMemo(() => JSON.stringify(initialFilters), [initialFilters]);
  const lastSyncedQueryRef = React.useRef(buildSearchParams(initialFilters));

  const fields = useMemo<FilterFieldConfig[]>(
    () => [
      {
        ...filterFields[0],
        options: sourceBreakdown.map((item) => ({ value: item.label, label: getLeadSourceLabel(item.label as LeadRecord["source"]) }))
      },
      { ...filterFields[1], options: hotnessBreakdown.map((item) => ({ value: item.label, label: item.label })) },
      { ...filterFields[2], options: statusBreakdown.map((item) => ({ value: item.label, label: item.label })) },
      { ...filterFields[3], options: needBreakdown.map((item) => ({ value: item.label, label: item.label })) },
      { ...filterFields[4], options: budgetBreakdown.map((item) => ({ value: item.label, label: item.label })) }
    ],
    [budgetBreakdown, hotnessBreakdown, needBreakdown, sourceBreakdown, statusBreakdown]
  );

  const effectiveFilters = useMemo(() => {
    return applyChipFilters(
      {
        q: searchText,
        source: "",
        hotness: "",
        status: "",
        need: "",
        budget: ""
      },
      chipFilters
    );
  }, [chipFilters, searchText]);

  const syncedFilters = useMemo(() => {
    return applyChipFilters(
      {
        q: debouncedSearchText,
        source: "",
        hotness: "",
        status: "",
        need: "",
        budget: ""
      },
      chipFilters
    );
  }, [chipFilters, debouncedSearchText]);

  const filteredLeads = useMemo(
    () => leads.filter((lead) => matchesLeadFilter(lead, effectiveFilters)),
    [effectiveFilters, leads]
  );

  const urgentLeads = useMemo(
    () => filteredLeads.filter((lead) => lead.hotness === "Nóng").slice(0, 6),
    [filteredLeads]
  );

  React.useEffect(() => {
    const nextSearch = initialFilters.q;
    const nextChipFilters = buildFiltersFromState(initialFilters);

    lastSyncedQueryRef.current = buildSearchParams(initialFilters);
    setSearchText((current) => (current === nextSearch ? current : nextSearch));
    setDebouncedSearchText((current) => (current === nextSearch ? current : nextSearch));
    setChipFilters((current) => (areFilterListsEqual(current, nextChipFilters) ? current : nextChipFilters));
  }, [initialFiltersKey]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchText((current) => (current === searchText ? current : searchText));
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [searchText]);

  React.useEffect(() => {
    const query = buildSearchParams(syncedFilters);

    if (query === lastSyncedQueryRef.current) {
      return;
    }

    lastSyncedQueryRef.current = query;

    startTransition(() => {
      const href = query ? `${pathname}?${query}` : pathname;
      router.replace(href, { scroll: false });
    });
  }, [pathname, router, syncedFilters]);

  const metricCards = [
    {
      title: "Lead hiển thị",
      description: "Sau lọc",
      value: filteredLeads.length,
      note: "Số lead đang hiển thị trên trang",
      icon: Users,
      href: "/dashboard/leads"
    },
    {
      title: "Lead nóng",
      description: "Ưu tiên gọi",
      value: filteredLeads.filter((lead) => lead.hotness === "Nóng").length,
      note: "Nhóm khách có tín hiệu chốt nhanh",
      icon: Flame,
      href: "/dashboard/leads?hotness=N%C3%B3ng"
    },
    {
      title: "Chưa gọi",
      description: "Cần chạm sale",
      value: filteredLeads.filter((lead) => lead.status === "Chưa gọi").length,
      note: "Lead cần chạm bước đầu",
      icon: PhoneCall,
      href: "/dashboard/leads?status=Ch%C6%B0a+g%E1%BB%8Di"
    },
    {
      title: "Lead hôm nay",
      description: "Trong ngày",
      value: overview.todayLeads,
      note: "Lead mới phát sinh hôm nay",
      icon: ArrowRight,
      href: "/dashboard/overview"
    }
  ];

  const activeFilterCount = chipFilters.length + (effectiveFilters.q ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0;

  const columns = useMemo<ColumnDef<LeadRecord>[]>(
    () => [
      {
        id: "customer",
        accessorFn: (lead) => getLeadDisplayName(lead),
        header: ({ column }) => <DataTableColumnHeader column={column} title="Khách" />,
        meta: {
          label: "Khách",
          headerClassName: "min-w-[280px]",
          cellClassName: "min-w-[280px]"
        } satisfies DataTableColumnMeta,
        cell: ({ row }) => {
          const lead = row.original;

          return (
            <div className="space-y-2">
              <div>
                <Link href={`/dashboard/leads/${lead.id}`} className="font-semibold hover:underline">
                  {getLeadDisplayName(lead)}
                </Link>
                <div className="mt-1 text-muted-foreground text-sm">{getLeadPrimaryContact(lead)}</div>
              </div>
              <div className="max-w-[320px] text-muted-foreground text-sm leading-6">{getLeadContextNote(lead)}</div>
            </div>
          );
        }
      },
      {
        accessorKey: "source",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nguồn" />,
        meta: {
          label: "Nguồn",
          headerClassName: "min-w-[110px]",
          cellClassName: "min-w-[110px]"
        } satisfies DataTableColumnMeta,
        cell: ({ row }) => (
          <Badge className={getLeadSourceTone(row.original.source)} variant="outline">
            {getLeadSourceLabel(row.original.source)}
          </Badge>
        )
      },
      {
        accessorKey: "need",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nhu cầu" />,
        meta: {
          label: "Nhu cầu",
          headerClassName: "min-w-[140px]",
          cellClassName: "min-w-[140px]"
        } satisfies DataTableColumnMeta
      },
      {
        accessorKey: "budget",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngân sách" />,
        meta: {
          label: "Ngân sách",
          headerClassName: "min-w-[140px]",
          cellClassName: "min-w-[140px]"
        } satisfies DataTableColumnMeta
      },
      {
        id: "status",
        accessorFn: (lead) => `${lead.hotness}-${lead.status}`,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        meta: {
          label: "Trạng thái",
          headerClassName: "min-w-[190px]",
          cellClassName: "min-w-[190px]"
        } satisfies DataTableColumnMeta,
        cell: ({ row }) => {
          const lead = row.original;

          return (
            <div className="flex flex-wrap gap-2">
              <Badge className={getHotnessTone(lead.hotness)} variant="outline">
                {lead.hotness}
              </Badge>
              <Badge className={getStatusTone(lead.status)} variant="outline">
                {lead.status}
              </Badge>
            </div>
          );
        }
      },
      {
        id: "actions",
        enableSorting: false,
        enableHiding: false,
        header: "Liên hệ nhanh",
        meta: {
          label: "Liên hệ nhanh",
          headerClassName: "min-w-[220px]",
          cellClassName: "min-w-[220px]"
        } satisfies DataTableColumnMeta,
        cell: ({ row }) => {
          const lead = row.original;
          const quickActions = buildLeadQuickActions(lead);

          return (
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline" className="rounded-xl">
                <Link href={`/dashboard/leads/${lead.id}`}>Chi tiết</Link>
              </Button>
              {quickActions.slice(0, 2).map((action) => (
                <Button key={`${lead.id}-${action.label}`} asChild size="sm" variant="ghost" className="rounded-xl">
                  <a href={action.href} target={action.external ? "_blank" : undefined} rel={action.external ? "noreferrer" : undefined}>
                    {action.label}
                  </a>
                </Button>
              ))}
            </div>
          );
        }
      }
    ],
    []
  );

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <DashboardPageIntro
        eyebrow="Lead"
        title="Làm việc với danh sách lead"
        description="Tìm nhanh đúng nhóm khách, xem trạng thái xử lý và mở chi tiết chỉ trong một nhịp thao tác."
        badges={[
          { label: `${filteredLeads.length} lead đang hiển thị`, variant: "primary-light" },
          { label: `${filteredLeads.filter((lead) => lead.hotness === "Nóng").length} lead nóng`, variant: "warning-light" },
          { label: `${activeFilterCount} điều kiện lọc`, variant: hasActiveFilters ? "info-light" : "success-light" }
        ]}
        actions={
          <>
            {hasActiveFilters ? (
              <Button asChild variant="outline">
                <Link href="/dashboard/leads">Xóa lọc</Link>
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link href="/dashboard/follow-up">Follow-up</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/leads?hotness=N%C3%B3ng">Mở lead nóng</Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <DashboardStatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            badge={card.description}
            note={card.note}
            href={card.href}
          />
        ))}
      </div>

      <Card className="border-border/80">
        <CardHeader className="gap-4">
          <div className="space-y-1">
            <CardTitle>Bộ lọc lead</CardTitle>
            <CardDescription>Thêm nhanh điều kiện để gom đúng nhóm khách cần follow-up.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex h-12 w-full max-w-2xl items-center rounded-[1.4rem] border border-border/70 bg-card px-4 shadow-sm transition-[border-color,box-shadow] focus-within:border-primary/30 focus-within:ring-3 focus-within:ring-primary/15">
            <Search className="mr-3 size-4 shrink-0 text-muted-foreground" />
            <Input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Tìm theo tên, số điện thoại, email, nhu cầu..."
              className="h-full rounded-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <Filters filters={chipFilters} fields={fields} onChange={setChipFilters} />
          {hasActiveFilters ? (
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{filteredLeads.length} lead</Badge>
              {effectiveFilters.q ? <Badge variant="secondary">Từ khóa: {effectiveFilters.q}</Badge> : null}
              {chipFilters.map((filter) => (
                <Badge key={`${filter.field}-${filter.values.join("-")}`} variant="secondary">
                  {fields.find((field) => field.key === filter.field)?.label ?? filter.field}: {filter.values.join(", ")}
                </Badge>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.25fr)_360px]">
        <div className="space-y-4">
          <div className="md:hidden">
            <div className="grid gap-3 p-4 md:grid-cols-2">
              {filteredLeads.length > 0 ? (
                filteredLeads.slice(0, 18).map((lead) => {
                  const quickActions = buildLeadQuickActions(lead);
                  return (
                    <div key={lead.id} className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link href={`/dashboard/leads/${lead.id}`} className="block truncate font-semibold hover:underline">
                            {getLeadDisplayName(lead)}
                          </Link>
                          <div className="mt-1 truncate text-muted-foreground text-sm">{getLeadPrimaryContact(lead)}</div>
                        </div>
                        <Badge className={getLeadSourceTone(lead.source)} variant="outline">
                          {getLeadSourceLabel(lead.source)}
                        </Badge>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-muted-foreground text-[11px] uppercase tracking-[0.16em]">Nhu cầu</div>
                          <div className="mt-1 font-medium">{lead.need}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-[11px] uppercase tracking-[0.16em]">Ngân sách</div>
                          <div className="mt-1 font-medium">{lead.budget}</div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge className={getHotnessTone(lead.hotness)} variant="outline">
                          {lead.hotness}
                        </Badge>
                        <Badge className={getStatusTone(lead.status)} variant="outline">
                          {lead.status}
                        </Badge>
                      </div>
                      <div className="mt-4 text-muted-foreground text-sm leading-6">{getLeadContextNote(lead)}</div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button asChild size="sm" variant="outline" className="rounded-xl">
                          <Link href={`/dashboard/leads/${lead.id}`}>Chi tiết</Link>
                        </Button>
                        {quickActions.slice(0, 2).map((action) => (
                          <Button key={`${lead.id}-${action.label}`} asChild size="sm" variant="ghost" className="rounded-xl">
                            <a href={action.href} target={action.external ? "_blank" : undefined} rel={action.external ? "noreferrer" : undefined}>
                              {action.label}
                            </a>
                          </Button>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <DashboardEmptyState
                  title="Không có lead phù hợp"
                  message="Thử đổi từ khóa hoặc bỏ bớt điều kiện lọc để mở rộng danh sách."
                  action={
                    hasActiveFilters ? (
                      <Button asChild variant="outline" size="sm">
                        <Link href="/dashboard/leads">Xóa lọc</Link>
                      </Button>
                    ) : undefined
                  }
                />
              )}
            </div>
          </div>

          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={filteredLeads}
              initialPageSize={12}
              pageSizeOptions={[12, 24, 48]}
              emptyMessage="Không có lead phù hợp với bộ lọc hiện tại."
              toolbar={
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="font-semibold text-lg">Danh sách lead</div>
                    <div className="text-muted-foreground text-sm">Sắp xếp, đổi cột và mở chi tiết ngay từ bảng này.</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="rounded-full">
                      {filteredLeads.length} lead
                    </Badge>
                    <Badge variant="outline" className="rounded-full">
                      {connectionLeadSource}
                    </Badge>
                  </div>
                </div>
              }
            />
          </div>
        </div>

        <div className="grid gap-4">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle>Ưu tiên gọi</CardTitle>
              <CardDescription>Nhóm lead nóng cần gọi hoặc đẩy Zalo trước.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {urgentLeads.length > 0 ? (
                urgentLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/dashboard/leads/${lead.id}`}
                    className="block rounded-[1.25rem] border border-border/70 bg-background p-4 transition hover:bg-muted/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{getLeadDisplayName(lead)}</div>
                        <div className="mt-1 text-muted-foreground text-sm">
                          {lead.need} • {lead.budget}
                        </div>
                      </div>
                      <Badge className={getHotnessTone(lead.hotness)} variant="outline">
                        {lead.hotness}
                      </Badge>
                    </div>
                  </Link>
                ))
              ) : (
                <DashboardEmptyState
                  title="Chưa có lead nóng"
                  message="Khi có lead đạt mức ưu tiên cao theo bộ lọc hiện tại, danh sách này sẽ hiện ngay."
                  compact
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
