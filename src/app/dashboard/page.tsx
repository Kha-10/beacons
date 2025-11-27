import DashboardPage from "@/components/dashboard/DashboardPage";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
        set(name: string, value: string, options: any) {
          fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/supabase-cookies`, {
            method: "POST",
            body: JSON.stringify({ name, value, options }),
          });
        },
        remove(name: string, options: any) {
          fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/supabase-cookies`, {
            method: "POST",
            body: JSON.stringify({
              name,
              value: "",
              options: { ...options, maxAge: 0 },
            }),
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <DashboardPage />;
};

export default Page;
