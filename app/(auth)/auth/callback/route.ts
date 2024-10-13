import { redirect } from "next/navigation"
import { EmailOtpType } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = createClient()

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      redirect(next)
    }
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next)
    }
    redirect(`/login?error=${error.message}`)
  }

  redirect(`/login?error=Something went wrong.`)
}
