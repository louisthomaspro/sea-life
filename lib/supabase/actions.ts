"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Provider } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/server"

export const signOut = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect("/")
}

export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createClient()

  console.log(email, password)

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error(error)
    return redirect(`/login?error=${error.message}`)
  }

  return redirect("/")
}

export const signUp = async (formData: FormData) => {
  const origin = headers().get("origin")
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createClient()

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}`,
    },
  })

  if (error) {
    console.error(error)
    return redirect(`/register?error=${error.message}`)
  }

  return redirect("/login?message=Account created successfully. Please check your email for verification.")
}

// https://supabase.com/docs/guides/auth/redirect-urls#vercel-preview-urls
const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/"
  // Make sure to include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`
  return url
}

export const signInWithProvider = async ({ provider, next }: { provider: Provider; next?: string | null }) => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${getURL()}auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""}`,
    },
  })

  if (data.url) {
    return redirect(data.url) // use the redirect API for your server framework
  }
}

export const resetPassword = async (email: string) => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getURL()}reset-password`,
  })

  if (error) {
    throw error.message
  }
}

export const updatePassword = async (password: string) => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    console.error(error)
    throw error
  }
}
