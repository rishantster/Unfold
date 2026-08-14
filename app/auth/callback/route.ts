import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.redirect(`${origin}/?error=invalid_link`);
  const supabase = await createClient();
  if (!supabase) return NextResponse.redirect(`${origin}/?error=not_configured`);
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(error ? `${origin}/?error=expired_link` : `${origin}/create`);
}
