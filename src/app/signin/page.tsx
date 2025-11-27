"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleIcon } from "@/components/icons";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/auth/callback`,
      },
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-chart-1/30 via-background to-accent/30 px-4">
      <div className="absolute top-10 left-10 w-24 h-24 bg-chart-1/40 rounded-full mix-blend-multiply filter opacity-70 animate-blob"></div>
      <div className="absolute top-10 right-20 w-24 h-24 bg-chart-2/40 rounded-full mix-blend-multiply filter opacity-70 animate-blob animate-delay-2000"></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-300/30 rounded-full mix-blend-multiply filter opacity-70 animate-blob animation-delay-1000"></div>
      <div className="absolute bottom-10 left-20 w-24 h-24 bg-chart-4/30 rounded-full mix-blend-multiply filter opacity-70 animate-blob animate-delay-4000"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-orange-300/30 rounded-full mix-blend-multiply filter opacity-70 animate-blob animate-delay-10000"></div>
      <div className="absolute bottom-1/2 right-1/3 w-20 h-20 bg-indigo-300/30 rounded-full mix-blend-multiply filter opacity-70 animate-blob animate-delay-3000"></div>

      <Card className="w-full max-w-sm shadow-lg border-none sm:border bg-card/30 backdrop-blur-3xl z-10">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold font-headline">
            Beacons
          </CardTitle>
          <CardDescription>
            Connect all your social accounts in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              variant="default"
              className="w-full py-6 text-base font-semibold bg-linear-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="mr-3 h-6 w-6" />
                  <span>Continue with Google</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
