import { redirect } from "next/navigation"
import { EmailOtpType } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  // `/auth/confirm` is the route that Supabase uses to confirm the email/password.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const next = searchParams.get("next") ?? "/"

  if (token_hash && type) {
    const supabase = createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next)
    }
    redirect(`/register?error=${error.message}`)
  }

  redirect(`/login?error=Something went wrong.`)
}
