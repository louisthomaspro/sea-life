"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { signUp } from "@/lib/supabase/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AppleSignInButton } from "@/components/auth/apple-signin-button"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"
import RegisterButton from "@/app/(auth)/_component/register-button"

export default function RegisterForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get("next")

  const [platform, setPlatform] = useState<"android" | "ios" | "macos" | "windows" | "unknown">("unknown")

  useEffect(() => {
    const userAgent = window.navigator.userAgent
    if (/android/i.test(userAgent)) {
      setPlatform("android")
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setPlatform("ios")
    } else if (/Mac/i.test(userAgent)) {
      setPlatform("macos")
    } else if (/Win/i.test(userAgent)) {
      setPlatform("windows")
    }
  }, [])

  return (
    <div className="mx-auto grid w-full max-w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-balance text-muted-foreground">Choose your preferred registration method</p>
      </div>
      {/* Registration options */}
      <div className="grid gap-4">
        <div className="flex flex-col gap-2">
          <GoogleSignInButton className="w-full" />
          <AppleSignInButton className="w-full" />
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <form className="grid gap-4" action={signUp}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <RegisterButton />
        </form>
      </div>
      {/* Login */}
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?
        <Button variant="link" className="p-2" asChild>
          <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}>Login</Link>
        </Button>
        {platform !== "unknown" && <div className="text-center text-xs opacity-10">{platform}</div>}
      </div>
    </div>
  )
}
