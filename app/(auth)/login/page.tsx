import { Suspense } from "react"

import LoginForm from "@/app/(auth)/_component/login-form"

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
