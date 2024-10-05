import Link from "next/link"

import { Icons } from "@/components/ui/icons/icons"
import { BlueGradient } from "@/app/(auth)/login/_component/blue-gradient"
import ErrorMessages from "@/app/(auth)/login/_component/error-messages"
import LoginForm from "@/app/(auth)/login/_component/login-form"
import RegisterForm from "@/app/(auth)/login/_component/register-form"

export default function LoginPage({
  searchParams,
}: {
  searchParams: { type?: "register" | "login"; message?: string }
}) {
  const isLogin = searchParams.type !== "register"

  return (
    <>
      <ErrorMessages />
      <div className="h-screen w-full lg:grid lg:grid-cols-2">
        <div className="relative hidden bg-muted lg:block">
          <div className="absolute left-5 top-5 z-10">
            <Link href="/">
              <Icons.logoWithTextWhite className="h-8 w-auto" />
            </Link>
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <h2 className="z-10 flex flex-col gap-2 text-4xl text-white">
              <span className="font-normal">Discover</span>
              <span className="font-bold">Marine Life</span>
            </h2>
          </div>
          <BlueGradient />
          <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-2 text-white">
            <p className="italic">"The sea, once it casts its spell, holds one in its net of wonder forever."</p>
            <p className="text-sm">Jacques Cousteau</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">{isLogin ? <LoginForm /> : <RegisterForm />}</div>
      </div>
    </>
  )
}
