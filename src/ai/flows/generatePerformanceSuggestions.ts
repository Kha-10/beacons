"use server";

/**
 * @fileOverview A flow that summarizes key social media trends and generates
 * suggestions for improving performance.
 *
 * - generatePerformanceSuggestions - A function that handles the performance
 *   suggestion generation process.
 * - GeneratePerformanceSuggestionsInput - The input type for the
 *   generatePerformanceSuggestions function.
 * - GeneratePerformanceSuggestionsOutput - The return type for the
 *   generatePerformanceSuggestions function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const TrendPrioritizationInputSchema = z.object({
  metric: z.string().describe("The social media metric to prioritize."),
});

const TrendPrioritizationOutputSchema = z.object({
  priorityScore: z
    .number()
    .describe("A score indicating the priority of this metric."),
});

const trendPrioritizationTool = ai.defineTool(
  {
    name: "prioritizeTrend",
    description: "Prioritizes a social media trend based on its impact.",
    inputSchema: TrendPrioritizationInputSchema,
    outputSchema: TrendPrioritizationOutputSchema,
  },
  async (input) => {
    // Mock implementation: return a score based on the length of the metric name
    // In a real application, this would involve a more sophisticated analysis.
    return { priorityScore: input.metric.length };
  }
);

const GeneratePerformanceSuggestionsInputSchema = z.object({
  socialMediaData: z
    .string()
    .describe(
      "The social media data, including engagement metrics, reach metrics, and follower growth trends."
    ),
  dateRange: z.string().describe("The date range for the social media data."),
});
export type GeneratePerformanceSuggestionsInput = z.infer<
  typeof GeneratePerformanceSuggestionsInputSchema
>;

const GeneratePerformanceSuggestionsOutputSchema = z.object({
  summary: z.string().describe("A summary of key social media trends."),
  suggestions: z
    .string()
    .describe("Suggestions for improving social media performance."),
});
export type GeneratePerformanceSuggestionsOutput = z.infer<
  typeof GeneratePerformanceSuggestionsOutputSchema
>;

export async function generatePerformanceSuggestions(
  input: GeneratePerformanceSuggestionsInput
): Promise<GeneratePerformanceSuggestionsOutput> {
  return generatePerformanceSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: "generatePerformanceSuggestionsPrompt",
  input: { schema: GeneratePerformanceSuggestionsInputSchema },
  output: { schema: GeneratePerformanceSuggestionsOutputSchema },
  tools: [trendPrioritizationTool],
  prompt: `You are a social media expert. Analyze the following social media data for the date range of {{dateRange}} and provide a summary of the key trends and suggestions for improving performance.

Social Media Data: {{socialMediaData}}

Prioritize the trends with the highest potential impact using the prioritizeTrend tool, and provide actionable suggestions based on your analysis. Focus on the metrics which prioritizeTrend indicates are most impactful.

Summary:
Suggestions:
`,
});

const generatePerformanceSuggestionsFlow = ai.defineFlow(
  {
    name: "generatePerformanceSuggestionsFlow",
    inputSchema: GeneratePerformanceSuggestionsInputSchema,
    outputSchema: GeneratePerformanceSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
