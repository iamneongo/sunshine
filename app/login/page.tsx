import type { Metadata } from "next";
import { HARDCODED_DASHBOARD_ADMIN_USERNAME, getSafeDashboardRedirectPath } from "@/lib/dashboard-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Đăng nhập Dashboard | Sunshine Bay Retreat"
};

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function pickParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function getErrorMessage(error: string | undefined): string | null {
  if (error === "invalid") {
    return "Tài khoản hoặc mật khẩu chưa đúng. Vui lòng kiểm tra lại thông tin hardcode của dashboard.";
  }

  return null;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = getSafeDashboardRedirectPath(pickParam(params.next));
  const error = pickParam(params.error);
  const errorMessage = getErrorMessage(error);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-[480px] rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
            Dashboard
          </div>

          <div className="mt-6">
            <div className="text-base font-black tracking-tight text-slate-950">Sunshine Bay Retreat</div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Đăng nhập</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Vào khu quản trị với tài khoản admin nội bộ.</p>
          </div>

          {errorMessage ? (
            <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Tài khoản: <span className="font-black text-slate-950">{HARDCODED_DASHBOARD_ADMIN_USERNAME}</span>
          </div>

          <form action="/api/auth/login" method="post" className="mt-6 space-y-4">
            <input type="hidden" name="next" value={next} />

            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">Tài khoản</span>
              <input
                name="username"
                type="text"
                autoComplete="username"
                required
                defaultValue={HARDCODED_DASHBOARD_ADMIN_USERNAME}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
                placeholder="Nhập tài khoản"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">Mật khẩu</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
                placeholder="Nhập mật khẩu"
              />
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-slate-800"
            >
              Vào dashboard
            </button>
          </form>

          <div className="mt-6 text-xs uppercase tracking-[0.16em] text-slate-400">Admin access only</div>
        </div>
      </div>
    </main>
  );
}
