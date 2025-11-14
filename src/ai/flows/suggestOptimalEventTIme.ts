"use server";

/**
 * @fileOverview This file defines a Genkit flow for suggesting an optimal event time, title, and content based on a user-provided topic.
 *
 * - suggestOptimalEventTime - A function that suggests the optimal time, title, and content for an event.
 * - SuggestOptimalEventTimeInput - The input type for the suggestOptimalEventTime function.
 * - SuggestOptimalEventTimeOutput - The return type for the suggestOptimalEventTime function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const SuggestOptimalEventTimeInputSchema = z.object({
  topic: z.string().describe("The topic or idea for the social media post."),
  pastEvents: z
    .array(
      z.object({
        startTime: z
          .string()
          .describe("The start time of the past event (ISO format)."),
        durationMinutes: z
          .number()
          .describe("The duration of the past event in minutes."),
        engagementMetrics: z
          .number()
          .describe(
            "The engagement metrics for the past event (e.g., views, clicks, comments)."
          ),
      })
    )
    .describe(
      "An array of past events with their start times, durations, and engagement metrics."
    ),
});
export type SuggestOptimalEventTimeInput = z.infer<
  typeof SuggestOptimalEventTimeInputSchema
>;

const SuggestOptimalEventTimeOutputSchema = z.object({
  title: z.string().describe("The AI-generated title for the post."),
  description: z
    .string()
    .describe("The AI-generated content/description for the post."),
  suggestedTime: z
    .string()
    .describe("The suggested optimal time for the event (ISO format)."),
  reasoning: z
    .string()
    .describe("The reasoning behind the suggested time and content."),
});
export type SuggestOptimalEventTimeOutput = z.infer<
  typeof SuggestOptimalEventTimeOutputSchema
>;

export async function suggestOptimalEventTime(
  input: SuggestOptimalEventTimeInput
): Promise<SuggestOptimalEventTimeOutput> {
  return suggestOptimalEventTimeFlow(input);
}

const prompt = ai.definePrompt({
  name: "suggestOptimalEventTimePrompt",
  input: { schema: SuggestOptimalEventTimeInputSchema },
  output: { schema: SuggestOptimalEventTimeOutputSchema },
  prompt: `You are an expert social media manager AI. Your task is to create a compelling social media post and determine the optimal time to schedule it for maximum engagement.

Based on the provided topic and historical engagement data, generate a creative title and engaging post content. Also, suggest the best time to post it.

Topic for the post: {{{topic}}}

Historical data of past posts:
{{#each pastEvents}}
- Start Time: {{{startTime}}}, Engagement: {{{engagementMetrics}}}
{{/each}}

Your response should be in JSON format and include:
1.  'title': A catchy title for the post.
2.  'description': The full content for the post.
3.  'suggestedTime': The optimal time to post in ISO format.
4.  'reasoning': A brief explanation for your title, content, and time suggestions.
`,
});

const suggestOptimalEventTimeFlow = ai.defineFlow(
  {
    name: "suggestOptimalEventTimeFlow",
    inputSchema: SuggestOptimalEventTimeInputSchema,
    outputSchema: SuggestOptimalEventTimeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
