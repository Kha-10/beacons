import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: existing } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!existing) {
          await supabase.from("profiles").insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || null,
            avatar_url: user.user_metadata?.avatar_url || null,
            last_login: new Date().toISOString(),
          });
        } else {
          await supabase
            .from("profiles")
            .update({ last_login: new Date().toISOString() })
            .eq("id", user.id);
        }
      }

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_ORIGIN}${next}`);
    }
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_ORIGIN}/auth/auth-code-error`
  );
}
