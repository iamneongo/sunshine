"use client";

import { Bar, BarChart, Cell, Label, Pie, PieChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type BreakdownItem = {
  label: string;
  count: number;
  share: number;
};

type OverviewBreakdownChartProps = {
  items: BreakdownItem[];
  variant: "donut" | "bar";
  centerLabel?: string;
};

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)"
];

const chartConfig = {
  count: {
    label: "Số lượng",
    color: "var(--color-chart-4)"
  }
};

export function OverviewBreakdownChart({
  items,
  variant,
  centerLabel
}: OverviewBreakdownChartProps) {
  const data = items.slice(0, 5).map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length]
  }));

  if (variant === "donut") {
    const total = data.reduce((sum, item) => sum + item.count, 0);

    return (
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <PieChart>
          <ChartTooltip
            content={<ChartTooltipContent formatter={(value) => <span className="font-medium">{value}</span>} />}
          />
          <Pie data={data} dataKey="count" nameKey="label" innerRadius={74} outerRadius={112} paddingAngle={3} strokeWidth={0}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.fill} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                  return null;
                }

                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy - 6} className="fill-foreground text-2xl font-semibold">
                      {total}
                    </tspan>
                    <tspan x={viewBox.cx} y={viewBox.cy + 16} className="fill-muted-foreground text-[12px]">
                      {centerLabel ?? "Tổng"}
                    </tspan>
                  </text>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <XAxis type="number" hide />
        <YAxis
          dataKey="label"
          type="category"
          tickLine={false}
          axisLine={false}
          width={92}
          interval={0}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Bar dataKey="count" radius={10}>
          {data.map((entry) => (
            <Cell key={entry.label} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
