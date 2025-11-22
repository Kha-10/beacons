import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { name, value, options } = await req.json();

  const cookieStore = await cookies();
  cookieStore.set({ name, value, ...options });

  return Response.json({ success: true });
}
