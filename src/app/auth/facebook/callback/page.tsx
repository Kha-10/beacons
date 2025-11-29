"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import { createClient } from "@/utils/supabase/client";
import BlobLoader from "@/components/BlobLoader";
import { Button } from "@/components/ui/button";
import { FACEBOOK_APP_ID, REDIRECT_URI, SCOPES } from "@/lib/fbData";

export default function FacebookCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const code = params.get("code");
  const errorDescription = params.get("error_description");

  const supabase = createClient();

  useEffect(() => {
    async function handleFacebookCallback() {
      if (!code) return;

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Failed to get session:", error);
        return;
      }

      const token = session?.access_token;
      if (!token) {
        console.error("No Supabase JWT found. Session:", session);
        return;
      }

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook/callback`,
          { code },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("pages data", data);
        router.push("/dashboard");
      } catch (err) {
        console.error("Callback failed:", err);
      }
    }

    handleFacebookCallback();
  }, [supabase, code]);

  const connectToFb = () => {
    const oauthUrl = `https://www.facebook.com/v24.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${SCOPES}&response_type=code&auth_type=rerequest`;
    window.location.href = oauthUrl;
  };

  if (!code) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8 space-y-6">
        <h1 className="text-xl font-semibold text-destructive">
          Facebook login was canceled
        </h1>

        {errorDescription && (
          <p className="text-center text-muted-foreground max-w-sm">
            {errorDescription.replace(/\+/g, " ")}
          </p>
        )}

        <Button
          variant="default"
          onClick={connectToFb}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Try Again
        </Button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8 space-y-8">
      <div className="relative flex items-center justify-center w-full max-w-sm">
        <BlobLoader />
      </div>
      <div className="w-full max-w-sm flex flex-col items-center space-y-4">
        <h1 className="text-xl font-medium text-foreground animate-[text-pulse_3s_ease-in-out_infinite]">
          Connecting your Facebook account...
        </h1>
      </div>
    </main>
  );
}
