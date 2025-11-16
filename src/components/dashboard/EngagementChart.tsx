"use client";

import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartTooltipContent, ChartContainer, ChartConfig, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import type { EngagementData } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  likes: {
    label: "Likes",
    color: "var(--chart-1)",
  },
  comments: {
    label: "Comments",
    color: "var(--chart-2)",
  },
  shares: {
    label: "Shares",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

interface EngagementChartProps {
  data: EngagementData[];
}

export default function EngagementChart({ data }: EngagementChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement Metrics</CardTitle>
          <CardDescription>Likes, Comments, and Shares over time</CardDescription>
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
        <CardTitle>Engagement Metrics</CardTitle>
        <CardDescription>Likes, Comments, and Shares over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={data} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="likes" fill="var(--color-likes)" radius={4} />
            <Bar dataKey="comments" fill="var(--color-comments)" radius={4} />
            <Bar dataKey="shares" fill="var(--color-shares)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
