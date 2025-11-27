import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json(
      { error: "Missing code from Facebook OAuth" },
      { status: 400 }
    );
  }

  try {
    // Exchange code for short-lived token
    const tokenResp = await axios.get(
      "https://graph.facebook.com/v24.0/oauth/access_token",
      {
        params: {
          client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
          client_secret: process.env.FACEBOOK_APP_SECRET!,
          redirect_uri: process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI!,
          code,
        },
      }
    );

    const userAccessToken = tokenResp.data.access_token;

    const longTokenResp = await axios.get(
      "https://graph.facebook.com/v24.0/oauth/access_token",
      {
        params: {
          grant_type: "fb_exchange_token",
          client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
          client_secret: process.env.FACEBOOK_APP_SECRET!,
          fb_exchange_token: userAccessToken,
        },
      }
    );

    const longLivedToken = longTokenResp.data.access_token;

    // Fetch pages
    const pagesResp = await axios.get(
      "https://graph.facebook.com/v24.0/me/accounts",
      {
        params: { access_token: longLivedToken },
      }
    );

    const pages = pagesResp.data.data;
    console.log("Pages:", pages);

    return NextResponse.json({ pages });
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    return NextResponse.json(
      { error: "Failed to exchange code or fetch pages" },
      { status: 500 }
    );
  }
}
