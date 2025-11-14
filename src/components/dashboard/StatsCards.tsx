"use client";
import { Users, ThumbsUp, Eye } from "lucide-react";
import StatsCard from "./StatsCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  totalFollowers: { value: string; change: number };
  totalEngagement: { value: string; change: number };
  totalReach: { value: string; change: number };
}

interface StatsCardsProps {
  stats: Stats | null;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[126px] rounded-lg" />
        <Skeleton className="h-[126px] rounded-lg" />
        <Skeleton className="h-[126px] rounded-lg" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Total Followers"
        value={stats.totalFollowers.value}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        change={stats.totalFollowers.change}
      />
      <StatsCard
        title="Total Engagement"
        value={stats.totalEngagement.value}
        icon={<ThumbsUp className="h-4 w-4 text-muted-foreground" />}
        change={stats.totalEngagement.change}
      />
      <StatsCard
        title="Total Reach"
        value={stats.totalReach.value}
        icon={<Eye className="h-4 w-4 text-muted-foreground" />}
        change={stats.totalReach.change}
      />
    </div>
  );
}
