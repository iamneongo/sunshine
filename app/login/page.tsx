import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { HARDCODED_DASHBOARD_ADMIN_USERNAME, getSafeDashboardRedirectPath } from "@/lib/dashboard-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Đăng nhập Dashboard | Sunshine Bay Retreat"
};

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope-login"
});

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function pickParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function getErrorMessage(error: string | undefined): string | null {
  if (error === "invalid") {
    return "Tài khoản hoặc mật khẩu chưa đúng. Vui lòng kiểm tra lại rồi thử lại.";
  }

  return null;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = getSafeDashboardRedirectPath(pickParam(params.next));
  const error = pickParam(params.error);
  const errorMessage = getErrorMessage(error);

  return (
    <main
      className={`${manrope.variable} min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_44%,#f8fafc_100%)] px-4 py-6 text-slate-950 [font-family:var(--font-manrope-login),system-ui,sans-serif] sm:px-6 lg:px-8`}
    >
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center">
        <Card className="w-full max-w-[440px] border-slate-200/80 bg-white/92 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <CardHeader className="justify-items-center gap-4 px-6 pt-8 text-center sm:px-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <ShieldCheck className="size-5" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold tracking-tight text-slate-950">Đăng nhập</CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-600">
                Truy cập dashboard quản trị Sunshine Bay Retreat.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 px-6 pb-8 sm:px-8">
            {errorMessage ? (
              <div className="rounded-[1rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <form action="/api/auth/login" method="post" className="space-y-4">
              <input type="hidden" name="next" value={next} />

              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Tài khoản</span>
                <Input
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  defaultValue={HARDCODED_DASHBOARD_ADMIN_USERNAME}
                  placeholder="Nhập tài khoản"
                  className="h-12 rounded-[1rem] border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 shadow-none focus-visible:border-indigo-500 focus-visible:ring-indigo-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Mật khẩu</span>
                <Input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Nhập mật khẩu"
                  className="h-12 rounded-[1rem] border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 shadow-none focus-visible:border-indigo-500 focus-visible:ring-indigo-100"
                />
              </label>

              <Button type="submit" className="h-12 w-full rounded-[1rem] text-sm font-semibold">
                Vào dashboard
                <ArrowRight data-icon="inline-end" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
