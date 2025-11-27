"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

export default function FacebookCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const code = params.get("code");

  useEffect(() => {
    if (!code) return;

    // fetch(`/api/auth/facebook/exchange`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ code }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log("Pages:", data.pages);
    //     router.push("/dashboard");
    //   })
    //   .catch(console.error);

    const fetchPage = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook/callback`,
          {
            code,
          }
        );
        console.log("pages data", data);
        router.push("/dashboard");
        // setData(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching Facebook pages data:", error.message);
        }
        // setData(null);
      }
    };

    fetchPage();
  }, [code]);

  return <div>Connecting your Facebook account...</div>;
}
