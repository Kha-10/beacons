"use client";

import React, { useState, useTransition } from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPerformanceSuggestions } from "@/app/action";
import { engagementData, reachData, followerData } from "@/lib/data";
import { toast } from "sonner";
import type { GeneratePerformanceSuggestionsOutput } from "@/ai/flows/generatePerformanceSuggestions";

export default function InsightsGenerator() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] =
    useState<GeneratePerformanceSuggestionsOutput | null>(null);

  const handleGenerate = () => {
    startTransition(async () => {
      const dateRange = { from: new Date(), to: new Date() }; // Dummy date range
      const response = await getPerformanceSuggestions(
        engagementData,
        reachData,
        followerData,
        dateRange
      );
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        toast.error(response.error);
      }
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-primary" />
          <span>AI-Powered Insights</span>
        </CardTitle>
        <CardDescription>
          Get AI-generated summaries and suggestions to boost your performance.
        </CardDescription>
      </CardHeader>
      <CardContent className="grow">
        {isPending && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-1/4 bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-1/4 bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-5/6 bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md" />
            </div>
          </div>
        )}
        {result && !isPending && (
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-1">Summary</h3>
              <p className="text-muted-foreground">{result.summary}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Suggestions</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {result.suggestions}
              </p>
            </div>
          </div>
        )}
        {!result && !isPending && (
          <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
            <p>Click the button to generate insights.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGenerate}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Generate Suggestions"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
