"use server";

import { generatePerformanceSuggestions } from "@/ai/flows/generatePerformanceSuggestions";
import type { EngagementData, FollowerData, ReachData } from "@/lib/types";
import { suggestOptimalEventTime } from "@/ai/flows/suggestOptimalEventTIme";

// Mock data for AI past event analysis. In a real app, this would come from a database.
import { MOCK_EVENTS } from "@/lib/events";

export async function getPerformanceSuggestions(
  engagementData: EngagementData[],
  reachData: ReachData[],
  followerData: FollowerData[],
  dateRange: { from?: Date; to?: Date }
) {
  try {
    const socialMediaDataString = `
      Engagement Data (last 5 points): ${JSON.stringify(
        engagementData.slice(-5)
      )}
      Reach Data (last 5 points): ${JSON.stringify(reachData.slice(-5))}
      Follower Data (last 5 points): ${JSON.stringify(followerData.slice(-5))}
    `;

    const range =
      dateRange.from && dateRange.to
        ? `${dateRange.from.toDateString()} - ${dateRange.to.toDateString()}`
        : "all time";

    const result = await generatePerformanceSuggestions({
      socialMediaData: socialMediaDataString,
      dateRange: range,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to generate suggestions." };
  }
}
export async function getAISuggestionAction(topic: string) {
  try {
    const pastEventsForAI = MOCK_EVENTS.map((e) => ({
      startTime: new Date(`${e.date}T${e.time}`).toISOString(),
      durationMinutes: 60, // Mock duration
      engagementMetrics: Math.floor(Math.random() * 5000), // Mock engagement metrics
    }));

    const result = await suggestOptimalEventTime({
      topic,
      pastEvents: pastEventsForAI,
    });
    return result;
  } catch (error) {
    console.error("AI Suggestion Error:", error);
    return {
      title: null,
      description: null,
      suggestedTime: null,
      reasoning: null,
      error: "Failed to get AI suggestion. Please try again.",
    };
  }
}
