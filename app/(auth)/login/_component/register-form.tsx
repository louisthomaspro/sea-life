import Link from "next/link"

import { signUp } from "@/lib/supabase/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"
import RegisterButton from "@/app/(auth)/login/_component/register-button"

export default function RegisterForm() {
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-balance text-muted-foreground">Choose your preferred registration method</p>
      </div>
      {/* Registration options */}
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
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  )
}
