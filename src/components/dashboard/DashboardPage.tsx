"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { startOfMonth } from "date-fns";
import {
  engagementData as allEngagementData,
  reachData as allReachData,
  followerData as allFollowerData,
  getSummaryStats,
} from "@/lib/data";
import type { EngagementData, ReachData, FollowerData } from "@/lib/types";
import DashboardHeader from "@/components/dashboard/Header";
import StatsCards from "@/components/dashboard/StatsCards";
import EngagementChart from "@/components/dashboard/EngagementChart";
import ReachChart from "@/components/dashboard/ReachChart";
import FollowerGrowthChart from "@/components/dashboard/FollowGrowth";
import InsightsGenerator from "@/components/dashboard/InsightsGenerator";

const filterDataByDateRange = (
  data: any[],
  dateRange: DateRange | undefined
) => {
  if (!dateRange || !dateRange.from) return data;
  const from = dateRange.from;
  const to = dateRange.to || from;

  return data.filter((item) => {
    // A bit of a hack to make string dates comparable
    const itemDate = new Date(item.date + `, ${new Date().getFullYear()}`);
    return itemDate >= from && itemDate <= to;
  });
};

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const [engagementData, setEngagementData] = useState<EngagementData[]>([]);
  const [reachData, setReachData] = useState<ReachData[]>([]);
  const [followerData, setFollowerData] = useState<FollowerData[]>([]);

  useEffect(() => {
    // This simulates fetching and filtering data on the client side
    // to avoid hydration mismatches from server-generated random data.
    const filteredEngagement = filterDataByDateRange(allEngagementData, date);
    const filteredReach = filterDataByDateRange(allReachData, date);
    const filteredFollowers = filterDataByDateRange(allFollowerData, date);

    setEngagementData(filteredEngagement);
    setReachData(filteredReach);
    setFollowerData(filteredFollowers);
  }, [date]);

  const stats = useMemo(() => {
    if (!followerData.length && !engagementData.length && !reachData.length)
      return null;

    // In a real app, you'd calculate this more robustly
    const latestFollowers =
      followerData.length > 0
        ? followerData[followerData.length - 1].followers
        : 0;
    const totalEngagement = engagementData.reduce(
      (sum, item) => sum + item.likes + item.comments + item.shares,
      0
    );
    const totalReach = reachData.reduce((sum, item) => sum + item.reach, 0);

    return {
      totalFollowers: {
        value: latestFollowers.toLocaleString(),
        change: Math.random() * 10 - 4,
      },
      totalEngagement: {
        value: totalEngagement.toLocaleString(),
        change: Math.random() * 20 - 10,
      },
      totalReach: {
        value: totalReach.toLocaleString(),
        change: Math.random() * 15 - 7,
      },
    };
  }, [followerData, engagementData, reachData]);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
  <DashboardHeader date={date} onDateChange={setDate} />
  <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 w-full max-w-full overflow-x-hidden">
    <StatsCards stats={stats} />
    <div className="grid gap-4 grid-cols-1 xl:grid-cols-7 w-full max-w-full">
      <div className="xl:col-span-4 flex flex-col gap-4 w-full max-w-full overflow-hidden">
        <EngagementChart data={engagementData} />
        <ReachChart data={reachData} />
      </div>
      <div className="xl:col-span-3 flex flex-col gap-4 w-full max-w-full overflow-hidden">
        <FollowerGrowthChart data={followerData} />
        <InsightsGenerator />
      </div>
    </div>
  </main>
</div>
  );
}
