"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type OverviewActivityChartProps = {
  data: Array<{
    label: string;
    leadCount: number;
    eventCount: number;
    total: number;
  }>;
};

const chartConfig = {
  leadCount: {
    label: "Lead",
    color: "var(--color-chart-2)"
  },
  eventCount: {
    label: "Touchpoint",
    color: "var(--color-chart-4)"
  }
};

export function OverviewActivityChart({ data }: OverviewActivityChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart accessibilityLayer data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="overviewLeadFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-leadCount)" stopOpacity={0.24} />
            <stop offset="100%" stopColor="var(--color-leadCount)" stopOpacity={0.04} />
          </linearGradient>
          <linearGradient id="overviewEventFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-eventCount)" stopOpacity={0.2} />
            <stop offset="100%" stopColor="var(--color-eventCount)" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="monotone"
          dataKey="leadCount"
          stroke="var(--color-leadCount)"
          fill="url(#overviewLeadFill)"
          strokeWidth={2.2}
          activeDot={{ r: 4 }}
        />
        <Area
          type="monotone"
          dataKey="eventCount"
          stroke="var(--color-eventCount)"
          fill="url(#overviewEventFill)"
          strokeWidth={2.2}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
