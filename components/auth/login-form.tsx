import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"
import BackgroundGradient from "@/components/background-gradient"

export default function LoginForm(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <Card className="relative w-full max-w-sm overflow-hidden">
        {/* <BackgroundGradient className="absolute" /> */}
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <GoogleSignInButton className="w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
