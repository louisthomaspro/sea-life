import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

import { SupabaseSafeSession } from "@/lib/supabase/supabase-safe-session"

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export const getSafeUser = async () => {
  const supabase = createClient()
  const safeUserSession = new SupabaseSafeSession(supabase, process.env.SUPABASE_JWT_SECRET!)
  const { data, error } = await safeUserSession.getUser()
  if (error) {
    // throw new Error(error.message)
    console.log("error", error.message)
    return null
  }
  return data
}
