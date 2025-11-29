const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI!;
const SCOPES = [
  "pages_manage_posts",
  "pages_read_engagement",
  "business_management",
  "public_profile",
].join(",");
export { FACEBOOK_APP_ID, REDIRECT_URI, SCOPES };
