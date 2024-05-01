import { signIn, signUp } from "@/lib/supabase/actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/auth/submit-button"

export default function LoginForm(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <form>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your email below to login to your account.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <SubmitButton variant={"default"} className="w-full" formAction={signUp}>
              Sign up
            </SubmitButton>
            <SubmitButton variant={"outline"} className="w-full" formAction={signIn}>
              Sign In
            </SubmitButton>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
