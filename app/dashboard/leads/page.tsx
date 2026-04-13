import { LeadsWorkspace } from "./_components/leads-workspace";
import { getDashboardSnapshot } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type DashboardLeadsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function DashboardLeadsPage({ searchParams }: DashboardLeadsPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const snapshot = await getDashboardSnapshot({
    leadLimit: 500,
    eventLimit: 500,
    recentLeadLimit: 24,
    recentEventLimit: 16
  });

  return (
    <LeadsWorkspace
      leads={snapshot.allLeads}
      overview={{
        totalLeads: snapshot.overview.totalLeads,
        hotLeads: snapshot.overview.hotLeads,
        pendingCalls: snapshot.overview.pendingCalls,
        todayLeads: snapshot.overview.todayLeads
      }}
      connectionLeadSource={snapshot.connection.leadSource}
      sourceBreakdown={snapshot.sourceBreakdown}
      hotnessBreakdown={snapshot.hotnessBreakdown}
      statusBreakdown={snapshot.statusBreakdown}
      needBreakdown={snapshot.needBreakdown}
      budgetBreakdown={snapshot.budgetBreakdown}
      initialFilters={{
        q: getSingleValue(params?.q).trim(),
        source: getSingleValue(params?.source).trim(),
        hotness: getSingleValue(params?.hotness).trim(),
        status: getSingleValue(params?.status).trim(),
        need: getSingleValue(params?.need).trim(),
        budget: getSingleValue(params?.budget).trim()
      }}
    />
  );
}
