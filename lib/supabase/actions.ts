"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Provider } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/server"

export const signOut = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect("/account")
}

export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`/account?message=${error.message}`)
  }

  return redirect("/")
}

export const signUp = async (formData: FormData) => {
  const origin = headers().get("origin")
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return redirect(`/account?message=${error.message}`)
  }
}

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/"
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`
  return url
}

export const signInWithProvider = async ({ provider, from }: { provider: Provider; from: string }) => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${getURL()}auth/callback?from=${encodeURIComponent(from)}`,
    },
  })

  if (data.url) {
    return redirect(data.url) // use the redirect API for your server framework
  }
}
