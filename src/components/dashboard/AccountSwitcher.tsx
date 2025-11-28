"use client";

import Image from "next/image";
import facebooklogo from "../../../public/facebook.png";

const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI!;
const SCOPES = [
  "pages_manage_posts",
  "pages_read_engagement",
  "business_management",
  "public_profile",
].join(",");

export default function AccountSwitcher() {

  const handleLogin = () => {
    const oauthUrl = `https://www.facebook.com/v24.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${SCOPES}&response_type=code&auth_type=rerequest`;
    window.location.href = oauthUrl;
  };

  return (
    <button
      onClick={handleLogin}
      className="text-xs px-2 py-1.5 cursor-pointer border rounded-md flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition"
    >
      <Image
        src={facebooklogo}
        alt="facebook logo"
        width={20}
        height={20}
        priority
      />
      Connect to Facebook
    </button>
  );
}
