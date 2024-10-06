import Link from "next/link"

import { signIn } from "@/lib/supabase/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"
import LoginButton from "@/app/(auth)/_component/login-button"

export default function LoginForm() {
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-balance text-muted-foreground">Choose your preferred login method</p>
      </div>
      {/* Login options */}
      <div className="grid gap-4">
        <GoogleSignInButton className="w-full" />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <form className="grid gap-4" action={signIn}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm text-muted-foreground hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
          <LoginButton />
        </form>
      </div>
      {/* Signup */}
      <div className="text-center text-sm text-muted-foreground">
        Don't have an account?
        <Button variant="link" className="p-2" asChild>
          <Link href="/register">Register</Link>
        </Button>
      </div>
    </div>
  )
}
