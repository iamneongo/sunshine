"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type AnalyticsActivityChartProps = {
  data: Array<{
    label: string;
    total: number;
  }>;
};

const activityChartConfig = {
  total: {
    label: "Activity",
    color: "var(--color-chart-4)"
  }
};

export function AnalyticsActivityChart({ data }: AnalyticsActivityChartProps) {
  return (
    <ChartContainer config={activityChartConfig} className="h-[320px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} tickMargin={10} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="total" fill="var(--color-total)" radius={10} />
      </BarChart>
    </ChartContainer>
  );
}
