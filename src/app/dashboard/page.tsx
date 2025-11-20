import DashboardPage from "@/components/dashboard/DashboardPage";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const Page = async () => {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options) {
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    try {
      // Check if profile exists
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      // Create profile if it doesn't exist
      if (!existing) {
        const { error } = await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
        });

        if (error) {
          console.error("Error creating profile:", error.message);
        }
      }
    } catch (error) {
      console.error("Profile setup error:", error);
    }
  }

  return <DashboardPage />;
};

export default Page;
