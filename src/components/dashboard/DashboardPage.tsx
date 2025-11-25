"use client";

import { useState, useEffect, useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { startOfMonth } from "date-fns";
import {
  engagementData as allEngagementData,
  reachData as allReachData,
  followerData as allFollowerData,
} from "@/lib/data";
import { Stats } from "@/lib/types";
import type { EngagementData, ReachData, FollowerData } from "@/lib/types";
import DashboardHeader from "@/components/dashboard/Header";
import StatsCards from "@/components/dashboard/StatsCards";
import EngagementChart from "@/components/dashboard/EngagementChart";
import ReachChart from "@/components/dashboard/ReachChart";
import FollowerGrowthChart from "@/components/dashboard/FollowGrowth";
import InsightsGenerator from "@/components/dashboard/InsightsGenerator";
import axios from "axios";

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
  const [data, setData] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/analytics`);
        setData(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching Facebook insights:", error.message);
        }
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [date]);

  async function getPostInsights(postId: string) {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/analytics/posts/${postId}`
    );
    return data;
  }

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/analytics/posts`
        );

        const results = [];
        for (const post of data.data) {
          const insights = await getPostInsights(post.id);

          results.push({
            id: post.id,
            created_time: post.created_time,
            message: post.message || "",
            insights: insights,
          });
          console.log("results", results);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching Facebook posts:", error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <DashboardHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 w-full max-w-full overflow-x-hidden">
        <StatsCards stats={data} loading={isLoading} />
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
