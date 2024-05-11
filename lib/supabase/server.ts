import "server-only"

import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

// Deprecated - if user is deleted, the session will still be valid

// Export the initialized Supabase client and AuthManager
// export const supabaseServerClient = () => createClient()
// export const supabaseServerAuth = () => new AuthManager(supabaseServerClient(), process.env.SUPABASE_JWT_SECRET!)

// const { data: user } = await supabaseServerAuth().getSafeSession()
