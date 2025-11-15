"use client";
import { Users, ThumbsUp, Eye } from "lucide-react";
import StatsCard from "./StatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Stats } from "@/lib/types";

interface StatsCardsProps {
  stats: Stats | null;
  loading: boolean;
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
    
  if (loading || stats?.data?.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[126px] rounded-lg" />
        <Skeleton className="h-[126px] rounded-lg" />
        <Skeleton className="h-[126px] rounded-lg" />
      </div>
    );
  }

  const calculateDayOverDay = (
    values: Array<{ value: number; end_time: string }>
  ) => {
    if (values.length < 2) return 0;

    const yesterday = values[values.length - 2].value;
    const today = values[values.length - 1].value;

    if (yesterday === 0) return today > 0 ? 100 : 0;

    return ((today - yesterday) / yesterday) * 100;
  };

  const followersValues = stats?.data[1]?.values ?? [];
  const followers = calculateDayOverDay(followersValues);

  const engagementsValues = stats?.data[0]?.values ?? [];
  const engagements = calculateDayOverDay(engagementsValues);

  const impressionsValues = stats?.data[2]?.values ?? [];
  const impressions = calculateDayOverDay(impressionsValues);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Total Followers"
        value={followersValues[followersValues.length - 1]?.value ?? 0}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        change={followers}
      />
      <StatsCard
        title="Total Engagement"
        value={engagementsValues[engagementsValues.length - 1]?.value ?? 0}
        icon={<ThumbsUp className="h-4 w-4 text-muted-foreground" />}
        change={engagements}
      />
      <StatsCard
        title="Total Reach"
        value={impressionsValues[impressionsValues.length - 1]?.value ?? 0}
        icon={<Eye className="h-4 w-4 text-muted-foreground" />}
        change={impressions}
      />
    </div>
  );
}
