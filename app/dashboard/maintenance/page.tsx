import Link from "next/link";
import {
  CLEAR_TEST_DATA_CONFIRM_PHRASE,
  CLEAR_USER_DATA_CONFIRM_PHRASE,
  getTestDataAudit,
  getUserDataAudit
} from "@/lib/test-data";
import {
  DashboardBadge,
  DashboardEmptyState,
  DashboardPageHeader,
  DashboardSurfaceCard,
  dashboardButtonClasses,
  dashboardScrollAreaClasses,
  formatDateTime
} from "../_components/dashboard-ui";

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
      tone: "border border-emerald-200 bg-emerald-50 text-emerald-700",
      message: `Đã xóa ${leads} lead test và ${events} event test.`
    };
  }

  if (status === "confirm_missing") {
    return {
      tone: "border border-amber-200 bg-amber-50 text-amber-700",
      message: "Thiếu xác nhận xóa data test."
    };
  }

  if (status === "invalid_phrase") {
    return {
      tone: "border border-rose-200 bg-rose-50 text-rose-700",
      message: `Sai câu xác nhận: ${CLEAR_TEST_DATA_CONFIRM_PHRASE}`
    };
  }

  if (status === "invalid_total") {
    const expectedTotal = pickParam(params.expectedTotal) || "0";
    return {
      tone: "border border-rose-200 bg-rose-50 text-rose-700",
      message: `Sai tổng record. Hiện có ${expectedTotal} record test.`
    };
  }

  if (status === "failed") {
    return {
      tone: "border border-rose-200 bg-rose-50 text-rose-700",
      message: "Xóa data test chưa thành công."
    };
  }

  if (status === "empty") {
    return {
      tone: "border border-slate-200 bg-slate-50 text-slate-600",
      message: "Không có data test để xóa."
    };
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
      tone: "border border-emerald-200 bg-emerald-50 text-emerald-700",
      message: `Đã xóa ${leads} lead người dùng và ${events} event người dùng.`
    };
  }

  if (status === "confirm_missing") {
    return {
      tone: "border border-amber-200 bg-amber-50 text-amber-700",
      message: "Thiếu xác nhận xóa data người dùng."
    };
  }

  if (status === "invalid_phrase") {
    return {
      tone: "border border-rose-200 bg-rose-50 text-rose-700",
      message: `Sai câu xác nhận: ${CLEAR_USER_DATA_CONFIRM_PHRASE}`
    };
  }

  if (status === "invalid_total") {
    const expectedTotal = pickParam(params.expectedUserTotal) || "0";
    return {
      tone: "border border-rose-200 bg-rose-50 text-rose-700",
      message: `Sai tổng record. Hiện có ${expectedTotal} record người dùng.`
    };
  }

  if (status === "failed") {
    return {
      tone: "border border-rose-200 bg-rose-50 text-rose-700",
      message: "Xóa data người dùng chưa thành công."
    };
  }

  if (status === "empty") {
    return {
      tone: "border border-slate-200 bg-slate-50 text-slate-600",
      message: "Không có data người dùng để xóa."
    };
  }

  return null;
}

export default async function DashboardMaintenancePage({ searchParams }: DashboardMaintenancePageProps) {
  const params = searchParams ? await searchParams : {};
  const testCleanupStatus = pickParam(params.testDataCleanup);
  const userCleanupStatus = pickParam(params.userDataCleanup);
  const testCleanupNotice = getTestCleanupNotice(testCleanupStatus, params);
  const userCleanupNotice = getUserCleanupNotice(userCleanupStatus, params);

  const [testDataAudit, userDataAudit] = await Promise.all([getTestDataAudit(), getUserDataAudit()]);

  return (
    <div className="space-y-6 lg:space-y-8">
      <DashboardPageHeader
        title="Maintenance"
        actions={
          <>
            <Link href="/dashboard/overview" className={dashboardButtonClasses("outline")}>
              Tổng quan
            </Link>
            <Link href="/dashboard/leads" className={dashboardButtonClasses()}>
              Leads
            </Link>
          </>
        }
      />

      <DashboardSurfaceCard className="border border-rose-200/80 bg-rose-50/60 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Clear data test</h2>
          <div className="flex flex-wrap gap-2">
            <DashboardBadge variant="warning">{testDataAudit.leadCount} lead test</DashboardBadge>
            <DashboardBadge variant="warning">{testDataAudit.eventCount} event test</DashboardBadge>
            <DashboardBadge variant={testDataAudit.supabaseConfigured ? "positive" : "muted"}>
              {testDataAudit.supabaseConfigured ? "Local + Supabase" : "Local only"}
            </DashboardBadge>
          </div>
        </div>

        {testCleanupNotice ? (
          <div className={`mt-6 rounded-xl px-4 py-3 text-sm leading-6 ${testCleanupNotice.tone}`}>
            {testCleanupNotice.message}
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
          <div className="space-y-4">
            <div className="rounded-xl border border-white/80 bg-white/80 p-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-black tracking-tight text-slate-950">Lead test</h3>
                <DashboardBadge>{testDataAudit.leadCount}</DashboardBadge>
              </div>
              <div className={`mt-4 space-y-3 ${dashboardScrollAreaClasses("card")}`}>
                {testDataAudit.leadItems.length > 0 ? (
                  testDataAudit.leadItems.map((lead) => (
                    <div key={lead.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                      <div className="text-sm font-black text-slate-950">{lead.label}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-slate-500">
                        <span>{lead.source}</span>
                        <span>•</span>
                        <span>{formatDateTime(lead.createdAt)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <DashboardEmptyState message="Không có lead test." />
                )}
              </div>
            </div>

            <div className="rounded-xl border border-white/80 bg-white/80 p-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-black tracking-tight text-slate-950">Event test</h3>
                <DashboardBadge>{testDataAudit.eventCount}</DashboardBadge>
              </div>
              <div className={`mt-4 space-y-3 ${dashboardScrollAreaClasses("card")}`}>
                {testDataAudit.eventItems.length > 0 ? (
                  testDataAudit.eventItems.map((event) => (
                    <div key={event.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                      <div className="text-sm font-black text-slate-950">{event.label}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-slate-500">
                        <span>{event.source}</span>
                        <span>•</span>
                        <span>{formatDateTime(event.createdAt)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <DashboardEmptyState message="Không có event test." />
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-rose-200 bg-white p-5 sm:p-6">
            <h3 className="text-xl font-black tracking-tight text-slate-950">Xác nhận</h3>
            {testDataAudit.totalCount > 0 ? (
              <form action="/dashboard/test-data/clear" method="post" className="mt-6 space-y-4">
                <input type="hidden" name="returnTo" value="/dashboard/maintenance" />

                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                  {testDataAudit.totalCount} record
                  <br />
                  {CLEAR_TEST_DATA_CONFIRM_PHRASE}
                </div>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">Câu xác nhận</span>
                  <input
                    name="confirmPhrase"
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-rose-400"
                    placeholder={CLEAR_TEST_DATA_CONFIRM_PHRASE}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">Tổng record</span>
                  <input
                    name="confirmTotal"
                    type="number"
                    min="0"
                    inputMode="numeric"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-rose-400"
                    placeholder={String(testDataAudit.totalCount)}
                  />
                </label>

                <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                  <input name="understand" type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500" />
                  <span>Tôi hiểu đây là thao tác xóa vĩnh viễn.</span>
                </label>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-rose-600 px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-rose-700"
                >
                  Clear data test
                </button>
              </form>
            ) : (
              <div className="mt-6">
                <DashboardEmptyState message="Không có data test." />
              </div>
            )}
          </div>
        </div>
      </DashboardSurfaceCard>

      <DashboardSurfaceCard className="border border-slate-300/80 bg-slate-100/70 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Xóa data người dùng</h2>
          <div className="flex flex-wrap gap-2">
            <DashboardBadge className="border-slate-300 bg-white text-slate-700">{userDataAudit.leadCount} lead</DashboardBadge>
            <DashboardBadge className="border-slate-300 bg-white text-slate-700">{userDataAudit.eventCount} event</DashboardBadge>
            <DashboardBadge variant={userDataAudit.supabaseConfigured ? "positive" : "muted"}>
              {userDataAudit.supabaseConfigured ? "Local + Supabase" : "Local only"}
            </DashboardBadge>
          </div>
        </div>

        {userCleanupNotice ? (
          <div className={`mt-6 rounded-xl px-4 py-3 text-sm leading-6 ${userCleanupNotice.tone}`}>
            {userCleanupNotice.message}
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
          <div className="space-y-4">
            <div className="rounded-xl border border-white/80 bg-white/80 p-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-black tracking-tight text-slate-950">Lead người dùng</h3>
                <DashboardBadge>{userDataAudit.leadCount}</DashboardBadge>
              </div>
              <div className={`mt-4 space-y-3 ${dashboardScrollAreaClasses("card")}`}>
                {userDataAudit.leadItems.length > 0 ? (
                  userDataAudit.leadItems.map((lead) => (
                    <div key={lead.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                      <div className="text-sm font-black text-slate-950">{lead.label}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-slate-500">
                        <span>{lead.source}</span>
                        <span>•</span>
                        <span>{formatDateTime(lead.createdAt)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <DashboardEmptyState message="Không có lead người dùng." />
                )}
              </div>
            </div>

            <div className="rounded-xl border border-white/80 bg-white/80 p-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-black tracking-tight text-slate-950">Event người dùng</h3>
                <DashboardBadge>{userDataAudit.eventCount}</DashboardBadge>
              </div>
              <div className={`mt-4 space-y-3 ${dashboardScrollAreaClasses("card")}`}>
                {userDataAudit.eventItems.length > 0 ? (
                  userDataAudit.eventItems.map((event) => (
                    <div key={event.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                      <div className="text-sm font-black text-slate-950">{event.label}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-slate-500">
                        <span>{event.source}</span>
                        <span>•</span>
                        <span>{formatDateTime(event.createdAt)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <DashboardEmptyState message="Không có event người dùng." />
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-300 bg-white p-5 sm:p-6">
            <h3 className="text-xl font-black tracking-tight text-slate-950">Xác nhận</h3>
            {userDataAudit.totalCount > 0 ? (
              <form action="/dashboard/user-data/clear" method="post" className="mt-6 space-y-4">
                <input type="hidden" name="returnTo" value="/dashboard/maintenance" />

                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
                  {userDataAudit.totalCount} record
                  <br />
                  {CLEAR_USER_DATA_CONFIRM_PHRASE}
                </div>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">Câu xác nhận</span>
                  <input
                    name="confirmPhrase"
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
                    placeholder={CLEAR_USER_DATA_CONFIRM_PHRASE}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">Tổng record</span>
                  <input
                    name="confirmTotal"
                    type="number"
                    min="0"
                    inputMode="numeric"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
                    placeholder={String(userDataAudit.totalCount)}
                  />
                </label>

                <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                  <input name="understand" type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500" />
                  <span>Tôi hiểu đây là thao tác xóa vĩnh viễn.</span>
                </label>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-slate-800"
                >
                  Xóa data người dùng
                </button>
              </form>
            ) : (
              <div className="mt-6">
                <DashboardEmptyState message="Không có data người dùng." />
              </div>
            )}
          </div>
        </div>
      </DashboardSurfaceCard>
    </div>
  );
}
