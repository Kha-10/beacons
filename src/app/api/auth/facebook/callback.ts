import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;

  if (!code || typeof code !== "string") {
    return res.status(400).send("Missing code from Facebook OAuth");
  }

  try {
    // Exchange code for short-lived token
    const tokenResp = await axios.get(
      "https://graph.facebook.com/v20.0/oauth/access_token",
      {
        params: {
          client_id: process.env.FACEBOOK_APP_ID!,
          client_secret: process.env.FACEBOOK_APP_SECRET!,
          redirect_uri: process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI!,
          code,
        },
      }
    );

    const userAccessToken = tokenResp.data.access_token;

    // Optional: exchange for long-lived token
    const longTokenResp = await axios.get(
      "https://graph.facebook.com/v24.0/oauth/access_token",
      {
        params: {
          grant_type: "fb_exchange_token",
          client_id: process.env.FACEBOOK_APP_ID!,
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

    // You can store these page tokens in your database
    console.log("Pages:", pages);

    res.status(200).json({ pages });
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to exchange code or fetch pages" });
  }
}
