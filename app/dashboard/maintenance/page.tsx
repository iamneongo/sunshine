import Link from "next/link";
import { DatabaseZap, ShieldAlert, Trash2, UserRoundX } from "lucide-react";
import {
  CLEAR_TEST_DATA_CONFIRM_PHRASE,
  CLEAR_USER_DATA_CONFIRM_PHRASE,
  getTestDataAudit,
  getUserDataAudit
} from "@/lib/test-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardEmptyState, DashboardPageIntro, formatDateTime } from "../_components/dashboard-ui";
import { DashboardStatCard } from "../_components/dashboard-stat-card";

export const dynamic = "force-dynamic";

type DashboardMaintenancePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type CleanupNotice = {
  tone: string;
  message: string;
};

function pickParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getTestCleanupNotice(
  status: string,
  params: Record<string, string | string[] | undefined>
): CleanupNotice | null {
  if (status === "success") {
    const leads = pickParam(params.clearedLeads) || "0";
    const events = pickParam(params.clearedEvents) || "0";
    return {
      tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
      message: `Đã xóa ${leads} lead test và ${events} event test.`
    };
  }

  if (status === "confirm_missing") {
    return { tone: "border-amber-200 bg-amber-50 text-amber-700", message: "Thiếu xác nhận xóa data test." };
  }

  if (status === "invalid_phrase") {
    return { tone: "border-rose-200 bg-rose-50 text-rose-700", message: `Sai câu xác nhận: ${CLEAR_TEST_DATA_CONFIRM_PHRASE}` };
  }

  if (status === "invalid_total") {
    return {
      tone: "border-rose-200 bg-rose-50 text-rose-700",
      message: `Sai tổng record. Hiện có ${pickParam(params.expectedTotal) || "0"} record test.`
    };
  }

  if (status === "failed") {
    return { tone: "border-rose-200 bg-rose-50 text-rose-700", message: "Xóa data test chưa thành công." };
  }

  if (status === "empty") {
    return { tone: "border-border bg-muted text-muted-foreground", message: "Không có data test để xóa." };
  }

  return null;
}

function getUserCleanupNotice(
  status: string,
  params: Record<string, string | string[] | undefined>
): CleanupNotice | null {
  if (status === "success") {
    const leads = pickParam(params.clearedUserLeads) || "0";
    const events = pickParam(params.clearedUserEvents) || "0";
    return {
      tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
      message: `Đã xóa ${leads} lead người dùng và ${events} event người dùng.`
    };
  }

  if (status === "confirm_missing") {
    return { tone: "border-amber-200 bg-amber-50 text-amber-700", message: "Thiếu xác nhận xóa data người dùng." };
  }

  if (status === "invalid_phrase") {
    return { tone: "border-rose-200 bg-rose-50 text-rose-700", message: `Sai câu xác nhận: ${CLEAR_USER_DATA_CONFIRM_PHRASE}` };
  }

  if (status === "invalid_total") {
    return {
      tone: "border-rose-200 bg-rose-50 text-rose-700",
      message: `Sai tổng record. Hiện có ${pickParam(params.expectedUserTotal) || "0"} record người dùng.`
    };
  }

  if (status === "failed") {
    return { tone: "border-rose-200 bg-rose-50 text-rose-700", message: "Xóa data người dùng chưa thành công." };
  }

  if (status === "empty") {
    return { tone: "border-border bg-muted text-muted-foreground", message: "Không có data người dùng để xóa." };
  }

  return null;
}

function AuditList({
  title,
  count,
  items
}: {
  title: string;
  count: number;
  items: Array<{ id: string; label: string; source: string; createdAt: string }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{count} record</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[420px] space-y-3 overflow-y-auto">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="rounded-lg border p-4">
              <div className="font-medium">{item.label}</div>
              <div className="mt-1 text-muted-foreground text-sm uppercase">{item.source}</div>
              <div className="mt-2 text-muted-foreground text-sm">{formatDateTime(item.createdAt)}</div>
            </div>
          ))
        ) : (
          <DashboardEmptyState title="Không có dữ liệu" message="Danh sách sẽ hiện khi có record phù hợp." compact />
        )}
      </CardContent>
    </Card>
  );
}

function CleanupForm({
  action,
  returnTo,
  confirmPhrase,
  totalCount,
  buttonLabel,
  accent
}: {
  action: string;
  returnTo: string;
  confirmPhrase: string;
  totalCount: number;
  buttonLabel: string;
  accent: "danger" | "default";
}) {
  if (totalCount <= 0) {
    return (
      <div className="rounded-lg border border-dashed p-5 text-muted-foreground text-sm">
        Không có dữ liệu để xóa.
      </div>
    );
  }

  return (
    <form action={action} method="post" className="space-y-4">
      <input type="hidden" name="returnTo" value={returnTo} />

      <div className="rounded-lg border bg-muted/60 p-4 text-sm leading-6">
        <div className="font-medium">{totalCount} record</div>
        <div className="mt-1 text-muted-foreground">{confirmPhrase}</div>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium">Câu xác nhận</span>
        <input
          name="confirmPhrase"
          type="text"
          required
          placeholder={confirmPhrase}
          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium">Tổng record</span>
        <input
          name="confirmTotal"
          type="number"
          min="0"
          inputMode="numeric"
          required
          placeholder={String(totalCount)}
          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </label>

      <label className="flex items-start gap-3 rounded-lg border p-4 text-sm leading-6">
        <input name="understand" type="checkbox" className="mt-1 h-4 w-4 rounded border-input" />
        <span>Tôi hiểu đây là thao tác xóa vĩnh viễn.</span>
      </label>

      <Button type="submit" variant={accent === "danger" ? "destructive" : "default"} className="w-full">
        {buttonLabel}
      </Button>
    </form>
  );
}

export default async function DashboardMaintenancePage({ searchParams }: DashboardMaintenancePageProps) {
  const params = searchParams ? await searchParams : {};
  const testCleanupNotice = getTestCleanupNotice(pickParam(params.testDataCleanup), params);
  const userCleanupNotice = getUserCleanupNotice(pickParam(params.userDataCleanup), params);

  const [testDataAudit, userDataAudit] = await Promise.all([getTestDataAudit(), getUserDataAudit()]);

  const summaryCards = [
    {
      title: "Test data",
      value: testDataAudit.totalCount,
      description: "Tổng record test đang có trong hệ thống",
      icon: DatabaseZap,
      tone: "bg-primary/10 text-primary"
    },
    {
      title: "User data",
      value: userDataAudit.totalCount,
      description: "Record thật do người dùng gửi từ landing page",
      icon: UserRoundX,
      tone: "bg-orange-500/10 text-orange-500"
    },
    {
      title: "Cleanup risk",
      value: testDataAudit.totalCount + userDataAudit.totalCount,
      description: "Tổng số record có thể bị tác động khi thao tác xóa",
      icon: ShieldAlert,
      tone: "bg-rose-500/10 text-rose-500"
    }
  ];

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <DashboardPageIntro
        eyebrow="Bảo trì"
        title="Quản lý dữ liệu hệ thống"
        description="Kiểm tra nhanh số record đang có, sau đó chỉ thao tác xóa khi đã xác nhận đúng câu lệnh và tổng record."
        badges={[
          { label: `${testDataAudit.totalCount} record test`, variant: "warning-light" },
          { label: `${userDataAudit.totalCount} record người dùng`, variant: "info-light" },
          { label: `${testDataAudit.totalCount + userDataAudit.totalCount} record có thể bị tác động`, variant: "destructive-light" }
        ]}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/dashboard/leads">Leads</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/analytics">Analytics</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/overview">
                <Trash2 data-icon="inline-start" />
                Về tổng quan
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs md:grid-cols-3">
        {summaryCards.map((card) => (
          <DashboardStatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            iconToneClass={card.tone}
            note={card.description}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Clear data test</CardTitle>
            <CardDescription>Xóa record test dùng để QA trước khi bàn giao hoặc chạy live.</CardDescription>
            <CardAction className="flex gap-2">
              <Badge variant="outline">{testDataAudit.leadCount} lead</Badge>
              <Badge variant="outline">{testDataAudit.eventCount} event</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-4">
            {testCleanupNotice ? (
              <div className={`rounded-lg border p-4 text-sm ${testCleanupNotice.tone}`}>{testCleanupNotice.message}</div>
            ) : null}
            <CleanupForm
              action="/dashboard/test-data/clear"
              returnTo="/dashboard/maintenance"
              confirmPhrase={CLEAR_TEST_DATA_CONFIRM_PHRASE}
              totalCount={testDataAudit.totalCount}
              buttonLabel="Clear data test"
              accent="danger"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Xóa data người dùng</CardTitle>
            <CardDescription>Xóa lead và event thật do người dùng nhập từ form hoặc chatbot.</CardDescription>
            <CardAction className="flex gap-2">
              <Badge variant="outline">{userDataAudit.leadCount} lead</Badge>
              <Badge variant="outline">{userDataAudit.eventCount} event</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-4">
            {userCleanupNotice ? (
              <div className={`rounded-lg border p-4 text-sm ${userCleanupNotice.tone}`}>{userCleanupNotice.message}</div>
            ) : null}
            <CleanupForm
              action="/dashboard/user-data/clear"
              returnTo="/dashboard/maintenance"
              confirmPhrase={CLEAR_USER_DATA_CONFIRM_PHRASE}
              totalCount={userDataAudit.totalCount}
              buttonLabel="Xóa data người dùng"
              accent="default"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AuditList title="Lead test gần đây" count={testDataAudit.leadCount} items={testDataAudit.leadItems} />
        <AuditList title="Event test gần đây" count={testDataAudit.eventCount} items={testDataAudit.eventItems} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AuditList title="Lead người dùng gần đây" count={userDataAudit.leadCount} items={userDataAudit.leadItems} />
        <AuditList title="Event người dùng gần đây" count={userDataAudit.eventCount} items={userDataAudit.eventItems} />
      </div>
    </div>
  );
}
