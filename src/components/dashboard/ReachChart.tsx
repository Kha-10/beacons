"use client";

import { Line, LineChart, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartTooltipContent,
  ChartContainer,
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { ReachData } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";

const chartConfig = {
  impressions: {
    label: "Impressions",
    color: "var(--chart-1)",
  },
  reach: {
    label: "Reach",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface ReachChartProps {
  data: ReachData[];
}

export default function ReachChart({ data }: ReachChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reach Metrics</CardTitle>
          <CardDescription>Impressions and Reach over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[300px]" />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reach Metrics</CardTitle>
        <CardDescription>Impressions and Reach over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<ChartTooltipContent hideIndicator />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="impressions"
              type="natural"
              stroke="var(--color-impressions)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="reach"
              type="natural"
              stroke="var(--color-reach)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
